// Shared platform-key model + output locations — the axes the CLI and both build
// domains (tokens, assets) agree on, owned by none of them (so neither domain has
// to import the CLI). A build target is `${filter}-${output}`: `filter` maps to
// the `platforms` enum (PD | WEB) that both design-tokens and design-assets
// declare; `output` is the artifact kind. The token outputs (dtcg, css, tailwind)
// land inside the published `@acronis-platform/tokens-pd` package; assets stay
// under this tool's own `dist/assets/`.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ASSET_FILTERS } from './assets';

export type Filter = 'pd' | 'web';
export type Output = 'dtcg' | 'css' | 'tailwind' | 'assets';
export type PlatformKey = `${Filter}-${Output}`;

/** Filter slug → the `platforms` enum value kept by normalization / asset filtering. */
export const FILTER_ENUM: Record<Filter, 'PD' | 'WEB'> = { pd: 'PD', web: 'WEB' };

/** Token filters that have source data today. WEB lands here when it exists. */
export const FILTERS: Filter[] = ['pd'];

export const OUTPUTS: Output[] = ['dtcg', 'css', 'tailwind', 'assets'];

/**
 * Which filters have source data for a given output. `dtcg`/`css` come from the
 * token package (PD today). `assets` come from `@acronis-platform/design-assets`,
 * which already spans both platforms — icons/concept-pack are PD, illustrations
 * WEB, selected per-asset by each asset's `platforms`. So the asset build runs for
 * `ASSET_FILTERS` (pd + web), independently of the token `FILTERS`.
 */
export const filtersFor = (output: Output): Filter[] =>
  output === 'assets' ? (ASSET_FILTERS as Filter[]) : FILTERS;

/** Every filter that appears in any output — the valid `--filter` values. */
export const ALL_FILTERS: Filter[] = [...new Set<Filter>([...FILTERS, ...(ASSET_FILTERS as Filter[])])];

/** Tool root (`tools/style-dictionary/`). */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Gitignored build output root. Today only `assets/` lives here. */
export const DIST = path.join(ROOT, 'dist');

/**
 * The published token package the token builds write into:
 * `packages/tokens-pd/`. Its generated contents are committed.
 */
export const TOKENS_PD = path.resolve(ROOT, '..', '..', 'packages', 'tokens-pd');

/** The DTCG intermediate ships under `tokens-pd/dtcg/`. */
export const dtcgDir = (): string => path.join(TOKENS_PD, 'dtcg');

/** All CSS lives under `tokens-pd/css/`. */
export const cssDir = (): string => path.join(TOKENS_PD, 'css');

/** Semantic-tier CSS lives at the css root: `tokens-pd/css/<brand>.css`. */
export const semanticFile = (brand: string): string => path.join(cssDir(), `${brand}.css`);

/** Each component tier gets its own dir: `tokens-pd/css/<component>/`. */
export const componentDir = (component: string): string => path.join(cssDir(), component);

/** Component-tier CSS: `tokens-pd/css/<component>/<brand>.css`. */
export const componentFile = (component: string, brand: string): string =>
  path.join(componentDir(component), `${brand}.css`);

/** Tailwind presets live under `tokens-pd/tailwind/`, partitioned per brand. */
export const tailwindDir = (): string => path.join(TOKENS_PD, 'tailwind');

/** Per-brand Tailwind preset dir: `tokens-pd/tailwind/<brand>/`. */
export const tailwindBrandDir = (brand: string): string => path.join(tailwindDir(), brand);

/** Shared semantic-vocabulary preset: `tokens-pd/tailwind/<brand>/tokens.js`. */
export const tailwindTokensPreset = (brand: string): string =>
  path.join(tailwindBrandDir(brand), 'tokens.js');

/** Per-component preset: `tokens-pd/tailwind/<brand>/components/<component>.js`. */
export const tailwindComponentPreset = (brand: string, component: string): string =>
  path.join(tailwindBrandDir(brand), 'components', `${component}.js`);

/** Asset deliverables live under `dist/assets/<filter>-<group>-<format>/`. */
export const ASSETS_DIST = path.join(DIST, 'assets');

/** Path relative to CWD, for log lines. */
export const rel = (p: string): string => path.relative(process.cwd(), p);
