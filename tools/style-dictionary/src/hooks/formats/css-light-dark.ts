// CSS rendering for the token build. Two kinds of declaration share a file:
//   - colors + dimensions + gradients → custom properties in `:root, :host` (so
//     the tokens resolve in the light DOM and inside web-component shadow roots).
//     Colors are
//     theme-aware: the light value is zipped with the matching dark value
//     (supplied via `darkTokens`, keyed by token path) into `light-dark()`.
//   - typography composites → utility classes (`.ui-typography-* { … }`). The
//     `typography/css-class` transform has already built each declaration block;
//     rendering only wraps it in the selector and indents it.
//
// `collectDecls` turns a resolved token slice into name→value / selector→block
// maps; `serializeCss` renders a file from those maps. Keeping the two apart lets
// the token builder partition tokens per output file and diff one brand against
// another (override-only files) before serializing. See context/output.md.

import type { TransformedToken } from 'style-dictionary/types';

export const CSS_LIGHT_DARK = 'css/light-dark';

/** Resolved declarations of one token slice, keyed for rendering and diffing. */
export interface Decls {
  /** CSS var name → value (colors as the `light-dark(...)` pair). */
  vars: Map<string, string>;
  /** Class selector → declaration block (typography utilities). */
  classes: Map<string, string>;
  /** Tokens that could not be represented, for the build log. */
  skipped: string[];
}

/**
 * Split a rendered box-shadow into its geometry and its color. Relies on the
 * `shadow/css` transform's contract that the shorthand is exactly four lengths
 * followed by the color — the color itself contains spaces (`rgb(0 0 0 / 0.4)`),
 * so splitting on the last space would not work.
 */
function splitShadow(value: string): { geometry: string; color: string } | null {
  const parts = value.split(' ');
  if (parts.length < 5) return null;
  return { geometry: parts.slice(0, 4).join(' '), color: parts.slice(4).join(' ') };
}

/**
 * A shadow's light and dark renderings → one theme-aware CSS value, or `null`
 * when they can't be combined (differing geometry, or an unparseable shorthand).
 *
 * `light-dark()` is a COLOR function: valid only where CSS expects a `<color>`,
 * so `box-shadow: light-dark(<shadow>, <shadow>)` is invalid. The pair goes in
 * the shadow's color slot instead — which is the only part that varies by theme.
 * Shared by the CSS format and the Tailwind preset builder so both render a
 * shadow identically.
 */
export function composeShadowLightDark(light: string, dark: string): string | null {
  if (light === dark) return light;
  const l = splitShadow(light);
  const d = splitShadow(dark);
  if (!l || !d || l.geometry !== d.geometry) return null;
  return `${l.geometry} light-dark(${l.color}, ${d.color})`;
}

/**
 * Collect a resolved token slice into declaration maps. `darkTokens` maps a
 * token path (`a.b.c`) to its resolved dark-mode color value; a color with no
 * dark entry falls back to its light value.
 */
export function collectDecls(
  tokens: TransformedToken[],
  darkTokens: Map<string, string>
): Decls {
  const vars = new Map<string, string>();
  const classes = new Map<string, string>();
  const skipped: string[] = [];

  for (const token of tokens) {
    if (token.$type === 'color') {
      const light = typeof token.$value === 'string' ? token.$value : null;
      const dark = darkTokens.get(token.path.join('.')) ?? light;
      if (light === null || dark == null) {
        skipped.push(`${token.name} (color)`);
        continue;
      }
      vars.set(token.name, `light-dark(${light}, ${dark})`);
    } else if (token.$type === 'typography') {
      // `typography/css-class` transformed the composite into a declaration block.
      if (typeof token.$value === 'string' && token.$value.length) {
        classes.set(`.${token.name}`, token.$value);
      } else {
        skipped.push(`${token.name} (typography)`);
      }
    } else if (token.$type === 'shadow') {
      const light = typeof token.$value === 'string' ? token.$value : null;
      if (light === null) {
        skipped.push(`${token.name} (shadow)`);
        continue;
      }
      const composed = composeShadowLightDark(light, darkTokens.get(token.path.join('.')) ?? light);
      if (composed === null) {
        skipped.push(`${token.name} (shadow: theme-varying geometry)`);
        continue;
      }
      vars.set(token.name, composed);
    } else if (typeof token.$value === 'string') {
      // dimension / scalar / gradient — already CSS-ready (theme-invariant).
      vars.set(token.name, token.$value);
    } else {
      skipped.push(`${token.name} (${token.$type})`);
    }
  }

  return { vars, classes, skipped };
}

const indent = (block: string): string =>
  block
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

// Every emitted class is an unlayered, single-class selector (specificity
// 0-1-0), so — for the padding/margin grammar specifically — textual order in
// the stylesheet is what decides which rule wins when two classes land on the
// same element (e.g. `ui-px-16 ui-ps-0`). Plain alphabetical order sorts every
// side-specific prefix (pb/pe/pl/pr/ps/pt) *before* the axis prefixes (px/py),
// so an axis utility would always beat a side utility regardless of which one
// is more specific to the developer's intent. Rank base < axis < side so a
// side utility always wins over an axis utility, matching Tailwind's override
// semantics; classes outside this grammar (typography, gap) fall through to
// alphabetical order.
const SPACING_PREFIX_RANK: Record<string, number> = {
  p: 0,
  m: 0,
  px: 1,
  py: 1,
  mx: 1,
  my: 1,
  pt: 2,
  pb: 2,
  pl: 2,
  pr: 2,
  ps: 2,
  pe: 2,
  mt: 2,
  mb: 2,
  ml: 2,
  mr: 2,
  ms: 2,
  me: 2,
};

const spacingSortKey = (selector: string): [number, string] => {
  const prefix = /^\.ui-([a-z]+)-/.exec(selector)?.[1];
  const rank = prefix !== undefined ? SPACING_PREFIX_RANK[prefix] : undefined;
  return [rank ?? -1, selector];
};

const compareClassSelectors = ([a]: [string, string], [b]: [string, string]): number => {
  const [rankA, keyA] = spacingSortKey(a);
  const [rankB, keyB] = spacingSortKey(b);
  return rankA !== rankB ? rankA - rankB : keyA.localeCompare(keyB);
};

export interface SerializeOptions {
  brand: string;
  /** `semantic` or a component name — recorded in the file header. */
  tier: string;
  /** Override-only files are bare `:root, :host {}`; base files carry the theme shell. */
  isOverride: boolean;
  vars: Map<string, string>;
  classes: Map<string, string>;
}

/** Render a CSS file from declaration maps. */
export function serializeCss({
  brand,
  tier,
  isOverride,
  vars,
  classes,
}: SerializeOptions): string {
  const varLines = [...vars.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n');

  const classBlocks = [...classes.entries()]
    .sort(compareClassSelectors)
    .map(([selector, block]) => `${selector} {\n${indent(block)}\n}`)
    .join('\n\n');

  const header =
    `/* Generated by @acronis-platform/style-dictionary — DO NOT EDIT. */\n` +
    `/* Source: @acronis-platform/design-tokens • brand: ${brand} • tier: ${tier}` +
    `${isOverride ? ' • overrides only' : ''} */\n`;

  // Base files declare the light/dark shell; override files only restate the
  // changed custom properties (they layer on top of the imported base).
  // `color-scheme: light dark` on `:root` lets an unthemed document follow
  // the OS preference. It is deliberately NOT repeated on the bare `:host`
  // rule: a shadow host would then re-declare `light dark` locally,
  // overriding the scheme it should otherwise inherit from the document —
  // making shadow-DOM content follow the OS instead of the app's
  // [data-theme] attribute on <html> (#674). Explicit [data-theme] below
  // still sets color-scheme on both :root and :host so a themed shadow
  // host is unaffected.
  const root = isOverride
    ? `:root, :host {\n${varLines}\n}`
    : `:root {\n  color-scheme: light dark;\n}\n\n` +
      `:root, :host {\n${varLines}\n}\n\n` +
      `[data-theme='light'], :host([data-theme='light']) {\n  color-scheme: light;\n}\n\n` +
      `[data-theme='dark'], :host([data-theme='dark']) {\n  color-scheme: dark;\n}`;

  return `${header}\n${[root, classBlocks].filter(Boolean).join('\n\n')}\n`;
}
