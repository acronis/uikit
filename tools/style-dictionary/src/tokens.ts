// The token build domain: the two Style Dictionary stages that turn
// @acronis-platform/design-tokens into the published `@acronis-platform/tokens-pd`
// CSS. `index.ts` (the CLI) dispatches here; the SD hooks these stages share live
// in `hooks/`.
//
//   1. buildDtcg (`<filter>-dtcg`) — read the Acronis token files and emit six
//      per-mode, 100%-DTCG JSON files into `tokens-pd/dtcg/`. Serialized from
//      `normalizeTree` directly, NOT via an SD format: SD's init normalization
//      relocates `$type`, which would break the intermediate's "every token
//      self-describing, references intact" contract. See context/pipeline.md.
//   2. buildCss (`<filter>-css`) — resolve those views per brand, then emit
//      tier-partitioned CSS into the package: the semantic tier at the root
//      (`<brand>.css`), each component tier in its own dir
//      (`<component>/<brand>.css`). The default brand (acronis) gets full files;
//      every other brand gets override-only files diffed against the default.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';

import { STATIC_HOOKS } from './hooks';
import { isEmittableToken } from './hooks/filters/semantic-only';
import { collectDecls, type Decls, serializeCss } from './hooks/formats/css-light-dark';
import { normalizeTree } from './hooks/preprocessors/acronis-dtcg';
import { ACRONIS_CSS_GROUP } from './hooks/transforms';
import {
  componentFile,
  cssDir,
  dtcgDir,
  FILTER_ENUM,
  type Filter,
  type PlatformKey,
  rel,
  semanticsFile,
} from './platforms';

// ── Sources ──────────────────────────────────────────────────────────────────

/** A raw token tree (a DTCG-shaped JSON object). */
type TokenTree = Record<string, unknown>;

/** The three source token files, addressed via the package's `exports`. */
const TOKEN_SOURCES = {
  primitives: '@acronis-platform/design-tokens/tiers/primitives.json',
  semantics: '@acronis-platform/design-tokens/tiers/semantics.json',
  components: '@acronis-platform/design-tokens/tiers/components.json',
} as const;

type TokenSourceName = keyof typeof TOKEN_SOURCES;

/** Read and parse one source token file by name. */
function readTokenSource(name: TokenSourceName): TokenTree {
  const url = import.meta.resolve(TOKEN_SOURCES[name]);
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as TokenTree;
}

/**
 * The semantic-tier roots — the non-`$` top-level keys of `semantics.json`
 * (`colors`, `gradients`, `typography`). Derived from the data so a new semantic
 * root needs no code change. A token whose first path segment is in this set
 * belongs to the semantics tier (one root CSS file / the base Tailwind preset);
 * everything else is a component tier (its own dir / preset). Shared by the css
 * and tailwind builds so the two partitions can't drift.
 */
export function semanticRoots(): Set<string> {
  return new Set(
    Object.keys(readTokenSource('semantics')).filter((key) => !key.startsWith('$'))
  );
}

/**
 * The role → Tailwind-namespace routing map, read from the source tiers'
 * root-level `com.acronis.tailwindRoles` extension (a build-time hint, not token
 * data). Keyed by a path segment (a semantic role like `background`, a component
 * part like `container`, or the `gradients` root); the value is the Tailwind
 * theme namespace the build routes that token into.
 *
 * Tier-scoped: pass `['semantics']` for the map a *semantic* token routes against
 * and the default (both tiers) for the map a *component* token routes against.
 * The split lets a component element reuse a name that exists as a *semantic token
 * segment* (e.g. the input `error` message vs the semantic `error` focus variant)
 * without the component entry shadowing semantic routing — semantic tokens never
 * see the component entries. Later tiers win on key conflicts within a single map.
 */
export function tailwindRoleMap(
  tiers: readonly TokenSourceName[] = ['semantics', 'components']
): Map<string, string> {
  const map = new Map<string, string>();
  for (const tier of tiers) {
    const ext = readTokenSource(tier)['$extensions'] as
      | Record<string, Record<string, string>>
      | undefined;
    const roles = ext?.['com.acronis.tailwindRoles'];
    if (roles)
      for (const [segment, namespace] of Object.entries(roles)) map.set(segment, namespace);
  }
  return map;
}

// ── Shared design data ─────────────────────────────────────────────────────────

/** The brand emitted in full; every other brand is a diff against it. */
export const DEFAULT_BRAND = 'acronis';

/**
 * Stage-1 outputs. `primitives` carries the Theme axis (light/dark); `semantic`
 * and `components` carry the Brand axis (acronis/brand-b). `mode` is the key to
 * pick out of each token's `values` dict; single-value tokens (units, font,
 * typography composites) are mode-invariant and emitted into every view of their
 * source file unchanged.
 */
interface DtcgView {
  out: string;
  source: TokenSourceName;
  mode: string;
}

/**
 * Tiers whose tokens carry the Brand axis — their `values` dicts are keyed by
 * brand. (The primitives tier is keyed by theme: light/dark, not by brand.)
 */
const BRAND_TIERS: TokenSourceName[] = ['semantics', 'components'];

/** Collect the key set of every `values` dict in a token tree. */
export function collectValueKeys(node: unknown, into: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  const values = obj['values'];
  if (values && typeof values === 'object' && !Array.isArray(values)) {
    for (const key of Object.keys(values)) into.add(key);
    return; // token leaf — do not descend into the resolved values
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    collectValueKeys(v, into);
  }
}

/**
 * Discover the brand set from the token data — the union of `values` keys across
 * the brand-bearing tiers (semantic + components). `DEFAULT_BRAND` is emitted in
 * full and listed first; the rest are alphabetical. The brand set is
 * data-driven: adding a brand mode in `@acronis-platform/design-tokens` adds a
 * brand here (and a generated `<brand>.css`) with **no code change**.
 */
export function discoverBrands(): string[] {
  const keys = new Set<string>();
  for (const tier of BRAND_TIERS) collectValueKeys(readTokenSource(tier), keys);
  if (!keys.has(DEFAULT_BRAND)) {
    throw new Error(
      `Default brand "${DEFAULT_BRAND}" has no token values in ${BRAND_TIERS.join(' / ')}`
    );
  }
  return [DEFAULT_BRAND, ...[...keys].filter((b) => b !== DEFAULT_BRAND).sort()];
}

/** The discovered brand set (data-driven). */
export const BRAND_NAMES: readonly string[] = discoverBrands();

const VIEWS: DtcgView[] = [
  { out: 'primitives-light', source: 'primitives', mode: 'light' },
  { out: 'primitives-dark', source: 'primitives', mode: 'dark' },
  ...BRAND_NAMES.flatMap((brand): DtcgView[] => [
    { out: `semantics-${brand}`, source: 'semantics', mode: brand },
    { out: `components-${brand}`, source: 'components', mode: brand },
  ]),
];

/**
 * Stage-2 brands. Each brand resolves its semantic + component view against both
 * theme views of the primitives, zipping colors into `light-dark()`. Derived
 * from the discovered brand set, so the list is data-driven.
 */
export interface Brand {
  name: string;
  semantics: string;
  components: string;
}

export const BRANDS: Brand[] = BRAND_NAMES.map((name) => ({
  name,
  semantics: `semantics-${name}`,
  components: `components-${name}`,
}));

export type Theme = 'light' | 'dark';

// ── Style Dictionary factory ─────────────────────────────────────────────────
// Every instance shares this tool's static hooks (transforms, transform group,
// filter). Stage 2 (css) uses SD only to resolve aliases + run the transforms;
// emission is driven directly from the resolved tokens. Stage 1 (dtcg) writes
// normalized trees directly (see file header).

const makeSd = (config: Config): StyleDictionary =>
  new StyleDictionary({
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'disabled' },
    hooks: STATIC_HOOKS,
    ...config,
  });

// Recursively sort object keys alphabetically (ASCII code-unit order), with
// all-numeric keys ordered numerically so "8" precedes "12". Arrays keep their
// order. Mirrors the tiers' ordering rule so the emitted DTCG is alphabetical too.
const sortKeysDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value === null || typeof value !== 'object') return value;
  const entries = Object.keys(value as Record<string, unknown>).sort((a, b) => {
    const na = /^\d+$/.test(a);
    const nb = /^\d+$/.test(b);
    if (na && nb) return Number(a) - Number(b);
    return a < b ? -1 : a > b ? 1 : 0;
  });
  const out: Record<string, unknown> = {};
  for (const k of entries) out[k] = sortKeysDeep((value as Record<string, unknown>)[k]);
  return out;
};

// ── Stage 1: dtcg ──────────────────────────────────────────────────────────────

export function buildDtcg(filter: Filter): void {
  const outDir = dtcgDir();
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // Each source feeds several views (primitives → light + dark, etc.), so read
  // each file once up front rather than re-reading it per view.
  const sources = {} as Record<TokenSourceName, TokenTree>;
  for (const name of Object.keys(TOKEN_SOURCES) as TokenSourceName[]) {
    sources[name] = readTokenSource(name);
  }

  for (const view of VIEWS) {
    const tree = normalizeTree(sources[view.source], view.mode, FILTER_ENUM[filter]);
    const dest = path.join(outDir, `${view.out}.json`);
    writeFileSync(dest, `${JSON.stringify(sortKeysDeep(tree), null, 2)}\n`);
    console.log(`✓ ${rel(dest)}`);
  }
}

// ── Stage 2: css ─────────────────────────────────────────────────────────────

const readView = (name: string): Config['tokens'] =>
  JSON.parse(readFileSync(path.join(dtcgDir(), `${name}.json`), 'utf8'));

/** Merge a brand's semantic + component views with one theme of the primitives. */
const mergeViews = (brand: Brand, theme: Theme): Config['tokens'] => ({
  ...readView(`primitives-${theme}`),
  ...readView(brand.semantics),
  ...readView(brand.components),
});

const cssConfig = (filter: Filter, brand: Brand, theme: Theme): Config => {
  const key: PlatformKey = `${filter}-css`;
  return {
    tokens: mergeViews(brand, theme),
    platforms: { [key]: { transformGroup: ACRONIS_CSS_GROUP } },
  };
};

/** Resolve a brand+theme to its transformed, emittable tokens (primitives dropped). */
export async function resolveTokens(
  filter: Filter,
  brand: Brand,
  theme: Theme
): Promise<TransformedToken[]> {
  const sd = makeSd(cssConfig(filter, brand, theme));
  const { allTokens } = await sd.getPlatformTokens(`${filter}-css`);
  return allTokens.filter(isEmittableToken);
}

/** Resolve a theme to a `path → value` map of its color tokens (already `rgb()`). */
export async function resolveColorMap(
  filter: Filter,
  brand: Brand,
  theme: Theme
): Promise<Map<string, string>> {
  const tokens = await resolveTokens(filter, brand, theme);
  return new Map(
    tokens
      .filter((t) => t.$type === 'color')
      .map((t) => [t.path.join('.'), t.$value as string])
  );
}

// The semantics tier (one root file per brand) vs the component tier (one dir per
// component). Tokens partition by their first path segment; the semantic roots are
// data-driven (see `semanticRoots`), so a new root (e.g. `gradients`) needs no edit.
const SEMANTIC_ROOTS = semanticRoots();
const sliceOf = (token: TransformedToken): string =>
  SEMANTIC_ROOTS.has(token.path[0]) ? 'semantics' : token.path[0];
const sliceFile = (slice: string, brand: string): string =>
  slice === 'semantics' ? semanticsFile(brand) : componentFile(slice, brand);

const emptyDecls = (): Decls => ({ vars: new Map(), classes: new Map(), skipped: [] });

/** Override-only maps: entries that differ from (or are absent in) the base. */
export function diffDecls(base: Decls, brand: Decls): Pick<Decls, 'vars' | 'classes'> {
  const vars = new Map<string, string>();
  for (const [name, value] of brand.vars) {
    if (base.vars.get(name) !== value) vars.set(name, value);
  }
  const classes = new Map<string, string>();
  for (const [selector, block] of brand.classes) {
    if (base.classes.get(selector) !== block) classes.set(selector, block);
  }
  return { vars, classes };
}

/** Remove the generated CSS tree (`tokens-pd/css/`) before a rebuild. */
function cleanCssOutputs(): void {
  rmSync(cssDir(), { recursive: true, force: true });
}

export async function buildCss(filter: Filter): Promise<void> {
  cleanCssOutputs();

  // brand → slice → resolved declarations.
  const perBrand = new Map<string, Map<string, Decls>>();
  for (const brand of BRANDS) {
    const darkColors = await resolveColorMap(filter, brand, 'dark');
    const tokens = await resolveTokens(filter, brand, 'light');

    const bySlice = new Map<string, TransformedToken[]>();
    for (const token of tokens) {
      const slice = sliceOf(token);
      const bucket = bySlice.get(slice);
      if (bucket) bucket.push(token);
      else bySlice.set(slice, [token]);
    }

    const decls = new Map<string, Decls>();
    for (const [slice, toks] of bySlice) decls.set(slice, collectDecls(toks, darkColors));
    perBrand.set(brand.name, decls);
  }

  const write = (dest: string, content: string): void => {
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, content);
    console.log(`✓ ${rel(dest)}`);
  };

  // Default brand: full files.
  const baseDecls = perBrand.get(DEFAULT_BRAND) ?? new Map<string, Decls>();
  for (const [slice, d] of baseDecls) {
    write(
      sliceFile(slice, DEFAULT_BRAND),
      serializeCss({ brand: DEFAULT_BRAND, tier: slice, isOverride: false, vars: d.vars, classes: d.classes })
    );
  }

  // Other brands: override-only files for every slice (default's slices + any
  // brand-only slice), so every brand exposes the same stable set of imports.
  for (const brand of BRANDS) {
    if (brand.name === DEFAULT_BRAND) continue;
    const decls = perBrand.get(brand.name) ?? new Map<string, Decls>();
    const slices = new Set([...baseDecls.keys(), ...decls.keys()]);
    for (const slice of slices) {
      const { vars, classes } = diffDecls(
        baseDecls.get(slice) ?? emptyDecls(),
        decls.get(slice) ?? emptyDecls()
      );
      write(
        sliceFile(slice, brand.name),
        serializeCss({ brand: brand.name, tier: slice, isOverride: true, vars, classes })
      );
    }
  }
}
