// The tailwind build domain (`<filter>-tailwind`): turn the resolved tokens into
// a per-brand Tailwind preset (`tokens-pd/tailwind.preset.<brand>.js`) consumed
// via `@config`. Values are BAKED (resolved literals — colors as `light-dark()`,
// dimensions as `px`, gradients as `linear-gradient()`), so the preset has no
// dependency on the `--ui-*` custom properties; light/dark still switches at
// runtime through `light-dark()`. Reuses the css stage's SD resolve (`./tokens`).

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { TransformedToken } from 'style-dictionary/types';

import {
  type Filter,
  rel,
  tailwindComponentPreset,
  tailwindDir,
  tailwindTokensPreset,
} from './platforms';
import { BRANDS, resolveColorMap, resolveTokens } from './tokens';

// Partition tokens by tier: the shared semantic vocabulary (colors + typography)
// → one base `tokens` preset; every other first path segment is a component →
// its own preset. Mirrors the css build's semantic/component split.
const SEMANTIC_ROOTS = new Set(['colors', 'typography']);
const sliceOf = (token: TransformedToken): string =>
  SEMANTIC_ROOTS.has(token.path[0]) ? 'tokens' : token.path[0];

// Tailwind theme namespaces we populate from tokens. Colors are split into
// role-restricted namespaces (a `background` token only makes `bg-*`, a `text`
// token only `text-*`, …) so the utility prefix carries the role and the key
// doesn't repeat it. Keys drop the `ui-` prefix that the CSS variables keep, so
// utilities read `bg-surface-primary`, `text-on-surface-primary`, `ring-brand`.
interface ThemeExtend {
  backgroundColor: Record<string, string>;
  textColor: Record<string, string>;
  borderColor: Record<string, string>;
  fill: Record<string, string>;
  ringColor: Record<string, string>;
  backgroundImage: Record<string, string>;
  fontFamily: Record<string, string>;
  fontSize: Record<string, [string, Record<string, string>]>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

const emptyTheme = (): ThemeExtend => ({
  backgroundColor: {},
  textColor: {},
  borderColor: {},
  fill: {},
  ringColor: {},
  backgroundImage: {},
  fontFamily: {},
  fontSize: {},
  spacing: {},
  borderRadius: {},
});

const stripUi = (name: string): string => name.replace(/^ui-/, '');

// ── Color → Tailwind namespace routing ───────────────────────────────────────
// Acronis colors encode their role in the token path (`background`, `text`,
// `border`, `glyph` icons, `focus` rings). Tailwind's model is that the theme
// key names the utility, so we route each color into the role-specific namespace
// and drop the role word from the key: `colors.background.surface.primary` →
// `backgroundColor: { 'surface-primary' }` → `bg-surface-primary`. Icons paint
// via `fill`/`stroke` (`currentColor`), so `glyph` → `fill` (which also keeps it
// from colliding with `text` keys that share leaf names like `on-surface-primary`).
type ColorNamespace = 'backgroundColor' | 'textColor' | 'borderColor' | 'fill' | 'ringColor';

// Semantic tier: the segment right after `colors` is the role.
const SEMANTIC_ROLE: Record<string, ColorNamespace> = {
  background: 'backgroundColor',
  text: 'textColor',
  border: 'borderColor',
  glyph: 'fill',
  focus: 'ringColor',
};

// Component tier: a role word somewhere in the path. PURE roles set the namespace
// and are dropped from the key; DESC(riptive) roles set the namespace but stay in
// the key (a switch `circle`, a breadcrumb `chevron` are meaningful descriptors).
const PURE_ROLE: Record<string, ColorNamespace> = {
  background: 'backgroundColor',
  border: 'borderColor',
  'border-color': 'borderColor',
  text: 'textColor',
  label: 'textColor',
  color: 'textColor',
  icon: 'fill',
  glyph: 'fill',
};
const DESC_ROLE: Record<string, ColorNamespace> = {
  circle: 'backgroundColor',
  divider: 'borderColor',
  chevron: 'fill',
  link: 'textColor',
  value: 'textColor',
  title: 'textColor',
};

const normalizeSegment = (segment: string): string => segment.replace(/^_+/, '');
const normalizePath = (segments: string[]): string[] => segments.map(normalizeSegment);

/** Map a color token's path to its Tailwind namespace + key (no `ui-`, no role word). */
export function routeColor(path: string[]): { namespace: ColorNamespace; key: string } {
  if (path[0] === 'colors' && SEMANTIC_ROLE[path[1]]) {
    return {
      namespace: SEMANTIC_ROLE[path[1]],
      key: normalizePath(path.slice(2)).join('-'),
    };
  }
  for (let i = path.length - 1; i >= 1; i--) {
    if (PURE_ROLE[path[i]]) {
      return {
        namespace: PURE_ROLE[path[i]],
        key: normalizePath(path.filter((_, j) => j !== i)).join('-'),
      };
    }
    if (DESC_ROLE[path[i]]) {
      return { namespace: DESC_ROLE[path[i]], key: normalizePath(path).join('-') };
    }
  }
  throw new Error(`Cannot route color token to a Tailwind namespace: ${path.join('.')}`);
}

/** Assign into a namespace map, throwing if two tokens land on the same key. */
function put(map: Record<string, string>, key: string, value: string, path: string[]): void {
  if (key in map) throw new Error(`Tailwind key collision on '${key}' (at ${path.join('.')})`);
  map[key] = value;
}

/** Parse a `prop: value;`-per-line declaration block into a property map. */
function parseDeclarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of block.split('\n')) {
    const match = /^\s*([\w-]+)\s*:\s*(.+?);?\s*$/.exec(line);
    if (match) out[match[1]] = match[2];
  }
  return out;
}

/** Add a resolved typography composite to the fontSize / fontFamily namespaces. */
function addTypography(theme: ThemeExtend, key: string, block: string): void {
  const decls = parseDeclarations(block);
  const size = decls['font-size'];
  if (size) {
    const extra: Record<string, string> = {};
    if (decls['line-height']) extra.lineHeight = decls['line-height'];
    if (decls['letter-spacing']) extra.letterSpacing = decls['letter-spacing'];
    if (decls['font-weight']) extra.fontWeight = decls['font-weight'];
    theme.fontSize[key] = [size, extra];
  }
  if (decls['font-family']) theme.fontFamily[key] = decls['font-family'];
}

/** Build one brand's `theme.extend` from its resolved tokens (baked values). */
export function buildThemeExtend(
  tokens: TransformedToken[],
  darkColors: Map<string, string>
): ThemeExtend {
  const theme = emptyTheme();
  for (const token of tokens) {
    const value = typeof token.$value === 'string' ? token.$value : null;
    if (token.$type === 'color') {
      if (value === null) continue;
      const dark = darkColors.get(token.path.join('.')) ?? value;
      const { namespace, key } = routeColor(token.path);
      put(theme[namespace], key, `light-dark(${value}, ${dark})`, token.path);
    } else if (token.$type === 'gradient') {
      if (value === null) continue;
      // Gradients can't be a `*-color` (those set a solid paint); Tailwind's
      // gradient namespace is `backgroundImage` (→ `bg-*` setting background-image).
      put(theme.backgroundImage, routeColor(token.path).key, value, token.path);
    } else if (token.$type === 'typography') {
      if (value !== null) addTypography(theme, stripUi(token.name), value);
    } else if (token.$type === 'dimension') {
      if (value === null) continue;
      const key = stripUi(token.name);
      if (key.includes('radius')) put(theme.borderRadius, key, value, token.path);
      else put(theme.spacing, key, value, token.path);
    }
  }
  return theme;
}

/** Drop empty namespaces so the emitted preset stays tidy. */
function prune(theme: ThemeExtend): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(theme).filter(([, v]) => Object.keys(v as object).length > 0)
  );
}

function renderPreset(brand: string, slice: string, theme: ThemeExtend): string {
  const extend = JSON.stringify(prune(theme), null, 2);
  const label = slice === 'tokens' ? 'semantic tokens' : `component: ${slice}`;
  return (
    `// Generated by @acronis-platform/style-dictionary — DO NOT EDIT.\n` +
    `// Source: @acronis-platform/design-tokens • brand: ${brand} • ${label}\n` +
    `// Tailwind preset (baked token values) — consume via \`@config\`.\n\n` +
    `export default {\n  theme: {\n    extend: ${extend.replace(/\n/g, '\n    ')},\n  },\n};\n`
  );
}

const DTS =
  `// Generated by @acronis-platform/style-dictionary — DO NOT EDIT.\n` +
  `declare const preset: { theme: { extend: Record<string, unknown> } };\n` +
  `export default preset;\n`;

export async function buildTailwind(filter: Filter): Promise<void> {
  rmSync(tailwindDir(), { recursive: true, force: true });
  for (const brand of BRANDS) {
    const darkColors = await resolveColorMap(filter, brand, 'dark');
    const tokens = await resolveTokens(filter, brand, 'light');

    // Group tokens by tier so each lands in its own preset.
    const bySlice = new Map<string, TransformedToken[]>();
    for (const token of tokens) {
      const slice = sliceOf(token);
      const bucket = bySlice.get(slice);
      if (bucket) bucket.push(token);
      else bySlice.set(slice, [token]);
    }

    const emit = (dest: string, slice: string): void => {
      const theme = buildThemeExtend(bySlice.get(slice) ?? [], darkColors);
      mkdirSync(path.dirname(dest), { recursive: true });
      writeFileSync(dest, renderPreset(brand.name, slice, theme));
      writeFileSync(dest.replace(/\.js$/, '.d.ts'), DTS);
      console.log(`✓ ${rel(dest)}`);
    };

    // The shared semantic vocabulary, then one preset per component.
    emit(tailwindTokensPreset(brand.name), 'tokens');
    for (const slice of bySlice.keys()) {
      if (slice !== 'tokens') emit(tailwindComponentPreset(brand.name, slice), slice);
    }
  }
}
