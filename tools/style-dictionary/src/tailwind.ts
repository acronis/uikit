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
import { BRANDS, resolveColorMap, resolveTokens, semanticRoots, tailwindRoleMap } from './tokens';

// Partition tokens by tier: the shared semantic vocabulary (colors + gradients +
// typography) → one base `tokens` preset; every other first path segment is a
// component → its own preset. Mirrors the css build's semantics/component split,
// reusing the same data-driven root set so the two partitions can't drift.
const SEMANTIC_ROOTS = semanticRoots();
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

// ── Color / gradient → Tailwind namespace routing ────────────────────────────
// Acronis tokens encode their role in the path (semantic: `background`, `text`,
// `border`, `glyph`, `focus`, `gradients`; component: `container`, `icon`,
// `label`, `border-color`, …). The role → Tailwind-namespace map is NOT hardcoded
// here — it is authored in the source tiers as `com.acronis.tailwindRoles` and read
// via `tailwindRoleMap()`. Tailwind's model is that the theme key names the utility,
// so we route each token into its role-specific namespace and drop the role word
// from the key: `colors.background.surface.primary` → `backgroundColor:
// { 'surface-primary' }` → `bg-surface-primary`; `gradients.ai.idle` →
// `backgroundImage: { 'ai-idle' }`.
type ColorNamespace =
  | 'backgroundColor'
  | 'textColor'
  | 'borderColor'
  | 'fill'
  | 'ringColor'
  | 'backgroundImage';

// Tier-scoped role maps: a semantic token routes against the semantic roles only;
// a component token against the merged map (so it can reuse semantic role words and
// add its own). This keeps a component element name that collides with a semantic
// *token segment* (e.g. the input `error` message vs the semantic `error` focus
// variant) from shadowing semantic routing.
const SEMANTIC_ROLE_MAP = tailwindRoleMap(['semantics']);
const COMPONENT_ROLE_MAP = tailwindRoleMap();

// The semantic tier prefixes color paths with `colors`, and component color tokens
// wrap their value in a `color` group (`…container.color.idle`); neither carries
// meaning in the utility key. Semantic roles are *pure* — the role word is redundant
// with the namespace, so it (and the `colors` prefix) is dropped, giving clean keys
// like `surface-primary`. Component parts (`container`, `breadcrumb-label`, …) are
// *descriptive* — they disambiguate sibling tokens (a collapsed `breadcrumb-label`
// vs `label-current-page`), so they stay in the key.
const TIER_PREFIX = 'colors';
const WRAPPER_SEGMENT = 'color';

// Strip leading underscores (_global → global) and convert PascalCase/camelCase
// to kebab-case (Breadcrumb → breadcrumb, borderColor → border-color) so Tailwind
// utility keys follow industry-standard lowercase-kebab naming regardless of how
// segments are cased in Figma / the tiers.
const normalizeSegment = (segment: string): string =>
  segment
    .replace(/^_+/, '')
    .replace(/([A-Z])/g, m => `-${m.toLowerCase()}`)
    .replace(/^-/, '');

// Semantic color tokens (path starts with `colors`) MUST route — a failure
// there is a real bug and stays fatal. Component-tier color tokens come
// straight from per-component Figma authoring and occasionally use shapes the
// router can't map (flat `<role>-<state>` twins like sidebar.secondary
// .background-active, or new role words like switch.toggle.color-on). Those are
// kept in the tiers + CSS but skipped from the Tailwind preset with a warning,
// so component authoring drift can't break the whole build.
const isSemanticColor = (path: string[]): boolean => path[0] === 'colors';

/** Map a color token's path to its Tailwind namespace + key (no `ui-`, no role word). */
export function routeColor(path: string[]): { namespace: ColorNamespace; key: string } {
  const isSemantic = SEMANTIC_ROOTS.has(path[0]);
  const roleMap = isSemantic ? SEMANTIC_ROLE_MAP : COMPONENT_ROLE_MAP;
  for (let i = path.length - 1; i >= 0; i--) {
    const namespace = roleMap.get(path[i]);
    if (namespace) {
      const key = path
        .filter((seg, j) => {
          if (seg === WRAPPER_SEGMENT) return false;
          if (isSemantic && j === i) return false;
          if (isSemantic && j === 0 && seg === TIER_PREFIX) return false;
          return true;
        })
        .map(normalizeSegment)
        .join('-');
      return { namespace: namespace as ColorNamespace, key };
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
      let routed;
      try {
        routed = routeColor(token.path);
      } catch (err) {
        // Component-tier tokens that don't encode a routable role are kept in
        // CSS + tiers but omitted from the Tailwind preset (warned). Semantic
        // color tokens must always route — a throw there is a genuine bug.
        if (!isSemanticColor(token.path)) {
          console.warn(
            `tailwind: skipped unroutable component color token (kept in CSS/tiers; fix naming in Figma): ${token.path.join('.')}`,
          );
          continue;
        }
        throw err;
      }
      put(theme[routed.namespace], routed.key, `light-dark(${value}, ${dark})`, token.path);
    } else if (token.$type === 'gradient') {
      if (value === null) continue;
      // Gradients can't be a `*-color` (those set a solid paint); Tailwind's
      // gradient namespace is `backgroundImage` (→ `bg-*` setting background-image).
      // Like color tokens, component-tier gradients can use a path shape the
      // router can't map (e.g. `button.ai.container.idle` — `container` is not a
      // role word); keep them in CSS + tiers but skip the preset with a warning.
      let gradientRouted;
      try {
        gradientRouted = routeColor(token.path);
      } catch (err) {
        if (!isSemanticColor(token.path)) {
          console.warn(
            `tailwind: skipped unroutable component gradient token (kept in CSS/tiers; fix naming in Figma): ${token.path.join('.')}`,
          );
          continue;
        }
        throw err;
      }
      put(theme.backgroundImage, gradientRouted.key, value, token.path);
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
