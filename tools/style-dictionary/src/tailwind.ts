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
import {
  BRANDS,
  resolveColorMap,
  resolveGapTokens,
  resolveTokens,
  semanticRoots,
  tailwindRoleMap,
} from './tokens';

// Partition tokens by tier: the shared semantic vocabulary (colors + gradients +
// typography) → one base `tokens` preset; every other first path segment is a
// component → its own preset. Mirrors the css build's semantics/component split,
// reusing the same data-driven root set so the two partitions can't drift.

function sanitizeLightDarkArg(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) throw new Error('Invalid empty color value for light-dark()');
  if (trimmed.toLowerCase().includes('light-dark(')) {
    throw new Error('Nested light-dark() is not allowed');
  }
  if (/[;{}]/.test(trimmed)) {
    throw new Error('Invalid characters in color value for light-dark()');
  }
  return trimmed;
}

function composeLightDark(light: string, dark: string): string {
  const safeLight = sanitizeLightDarkArg(light);
  const safeDark = sanitizeLightDarkArg(dark);
  return `light-dark(${safeLight}, ${safeDark})`;
}

const SEMANTIC_ROOTS = semanticRoots();
const sliceOf = (token: TransformedToken): string =>
  // Shared semantic vocabulary (colors/gradients/typography) is emitted under the base `tokens` preset.
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

// Fallback routing signal: Figma's variable `scopes` (preserved as
// `$extensions['com.figma.scopes']`) name the render surface a color is meant for.
// When a component token's PATH carries no routable role word, its scope still can:
// a single scope maps cleanly to a namespace; the icon `SHAPE_FILL`+`STROKE_COLOR`
// pair defaults to `fill`; `ALL_SCOPES` / empty / unknown give no signal (→ null,
// stays warned+skipped). Used only as a fallback when `routeColor` throws, so it
// never re-routes a token that already routes by path.
const SCOPE_TO_NAMESPACE: Partial<Record<string, ColorNamespace>> = {
  TEXT_FILL: 'textColor',
  FRAME_FILL: 'backgroundColor',
  STROKE_COLOR: 'borderColor',
  SHAPE_FILL: 'fill',
};

/** Namespace implied by a color token's Figma scopes, or null when scopes give no signal. */
export function scopeToNamespace(scopes: string[]): ColorNamespace | null {
  if (!Array.isArray(scopes) || scopes.length === 0) return null;
  if (scopes.length === 1) return SCOPE_TO_NAMESPACE[scopes[0]] ?? null; // ALL_SCOPES → null
  const set = new Set(scopes);
  if (set.size === 2 && set.has('SHAPE_FILL') && set.has('STROKE_COLOR')) return 'fill'; // icon default
  return null;
}

/**
 * Build a Tailwind color key from a path: drop `color` wrapper segments; for a
 * semantic token also drop the matched role segment (`skipIndex`) and a leading
 * `colors` tier prefix. Shared by path routing and the scope fallback so both
 * produce byte-identical keys.
 */
export function colorKeyFromPath(path: string[], skipIndex = -1, isSemantic = false): string {
  let key = '';
  for (let j = 0; j < path.length; j++) {
    const seg = path[j];
    if (seg === WRAPPER_SEGMENT) continue;
    if (isSemantic && j === skipIndex) continue;
    if (isSemantic && j === 0 && seg === TIER_PREFIX) continue;

    const normalized = normalizeSegment(seg);
    key = key ? `${key}-${normalized}` : normalized;
  }
  return key;
}

/** Map a color token's path to its Tailwind namespace + key (no `ui-`, no role word). */
export function routeColor(path: string[]): { namespace: ColorNamespace; key: string } {
  const isSemantic = SEMANTIC_ROOTS.has(path[0]);
  const roleMap = isSemantic ? SEMANTIC_ROLE_MAP : COMPONENT_ROLE_MAP;
  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i] === WRAPPER_SEGMENT) continue;
    const namespace = roleMap.get(path[i]);
    if (namespace) {
      return { namespace: namespace as ColorNamespace, key: colorKeyFromPath(path, i, isSemantic) };
    }
  }
  throw new Error(`Cannot route color token to a Tailwind namespace: ${path.join('.')}`);
}

/** Assign into a namespace map, throwing if two tokens land on the same key. */
function put(map: Record<string, string>, key: string, value: string, contextPath: string[]): void {
  if (key in map) throw new Error(`Tailwind key collision on '${key}' (at ${contextPath.join('.')})`);
  map[key] = value;
}

/** Parse a `prop: value;`-per-line declaration block into a property map. */
function parseDeclarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    // This parser intentionally supports exactly one declaration per line.
    // Multiline values are out of scope for typography token composites.
    if (/[\r\n]/.test(line)) continue;
    const match = /^([\w-]+)\s*:\s*([^;]+?)\s*;?$/.exec(line);
    if (match) out[match[1]] = match[2].trim();
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
        // Component-tier tokens that don't encode a routable role fall back to the
        // Figma scope (`com.figma.scopes`) for the namespace, keeping the path for
        // the key. Semantic color tokens must always route by path — a throw there
        // is a genuine bug. Tokens the scope can't disambiguate (ALL_SCOPES / empty)
        // are kept in CSS + tiers but omitted from the Tailwind preset (warned).
        if (isSemanticColor(token.path)) throw err;
        const scopes = (token.$extensions as Record<string, unknown> | undefined)?.['com.figma.scopes'];
        const ns = Array.isArray(scopes) ? scopeToNamespace(scopes as string[]) : null;
        if (!ns) {
          console.warn(
            `tailwind: skipped unroutable component color token (kept in CSS/tiers; fix naming in Figma): ${token.path.join('.')}`,
          );
          continue;
        }
        routed = { namespace: ns, key: colorKeyFromPath(token.path) };
      }
      let lightDarkValue: string;
      try {
        lightDarkValue = composeLightDark(value, dark);
      } catch (err) {
        if (!isSemanticColor(token.path)) {
          console.warn(
            `tailwind: skipped invalid component color token value for light-dark() (kept in CSS/tiers): ${token.path.join('.')}`,
          );
          continue;
        }
        throw err;
      }
      put(theme[routed.namespace], routed.key, lightDarkValue, token.path);
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

  // `units.gap.*` has no brand/theme axis; resolve once and merge it into every
  // brand's `tokens` preset (independent of the token-driven preset generation
  // below — gap sizes never flow through `buildThemeExtend`).
  const gapTokens = await resolveGapTokens(filter);

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
      if (slice === 'tokens') {
        for (const [sizeKey, pxValue] of gapTokens) theme.spacing[`gap-${sizeKey}`] = pxValue;
      }
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
