# Assets build — design-assets → SVG + React

How the `pd-assets` / `web-assets` outputs turn
[`@acronis-platform/design-assets`](../../../packages/design-assets) packs into
optimized SVG files and React components under `dist/`. The token stages
(`pd-dtcg`, `pd-css`) are unrelated — see [`pipeline.md`](pipeline.md).

All logic lives under `src/assets/`, one of the tool's two build domains (the
other is `tokens.ts` + `hooks/`; shared axes live in `platforms.ts`). The CLI
(`index.ts`) calls `assets/`'s `buildAssetsForFilter`, which drives
`read` → `resolve` → `executor` → `react/codegen` → `emit`.

## Resolver ≠ executor

`packages/design-assets/context/spec.md` defines **resolution** but deliberately
leaves **execution** to "a separate component … the executor." This tool is that
executor, on top of a faithful resolver:

- **`resolve.ts`** — spec §a–g + every runtime invariant the JSON schema cannot
  enforce: per-key merge `{...pack.values, ...asset.values}`, drop `null` (R5),
  effective canonical (asset flag wins; must be a `$file` source), resolve each
  variant to a leaf binary or a flattened derivation plan (`$from`/implicit-canonical
  hops concatenated leaf-first), cycle detection, `$file` existence, rule-id
  existence, and `$type`/extension consistency for **every** asset (incl. inherited
  `$type`). It throws `"<pack>.<asset> [<variant>]: <reason>"` and is exercised by
  the R1–R16 tests (`__tests__/resolve.test.ts`) against the live `concept-pack`.
- **`executor.ts`** — applies a variant's derivation plan to its source SVG.

The **build pipeline** (`pipeline.ts`) resolves per-asset and skips + warns on a
broken asset rather than aborting, so one upstream defect (see Gotchas) doesn't
sink the whole build. The resolver itself stays strict for tests.

## Rule execution

Rules apply left-to-right over the SVG AST (svgson):

- **`scale` (target T px)** — lossless: set the root `width`/`height` to T along
  the longer viewBox dimension (aspect preserved), **preserve the `viewBox` and
  all geometry**. No coordinate is rewritten, so gradient / `userSpaceOnUse`
  illustrations survive untouched.
- **`stroke` (target S px)** — set every stroked element's `stroke-width` so it
  renders at S px. After a preceding scale the user-unit→px ratio is
  `renderedLonger / viewBoxLonger`, so the attribute value is
  **`S · viewBoxLonger / renderedLonger`**. Example: stroke-mono `16` from a 24px
  source → scale to 16, then `stroke-1-6` → `1.6 · 24 / 16 = 2.4`; `32` →
  `2.5 · 24 / 32 = 1.875`. Filled-only elements are untouched. (Limitation: only
  elements carrying their own `stroke` attribute are matched — a stroke inherited
  from an ancestor `<g>` or set via CSS is not rewritten. Every source today
  strokes on the leaf element.)

## Color

`color.ts` rewrites hardcoded `fill`/`stroke`/`stop-color` to `currentColor` for
**mono** packs only (`concept-pack`, `icons-solid-mono`, `icons-stroke-mono`),
skipping `none`/`transparent`/`url(#…)`. **Multi** packs and **illustrations** keep
their exact colors and gradients (`preserve`). The pass runs on the AST **before**
SVGO so it is one parse and trivially testable; SVGO stays a pure optimizer.

## SVGO

`svgo-config.ts` is a conservative `preset-default` (SVGO v4) with load-bearing
overrides: `cleanupIds:false` (illustrations reference `url(#paint0_linear_…)`),
`convertColors.currentColor:false` (our pass owns currentColor); for `preserve`,
`mergePaths`/`convertShapeToPath` are also off so independently-filled shapes are
never collapsed. **viewBox is kept by default** — SVGO v4 dropped `removeViewBox`
from `preset-default`, so it is no longer overridden.

## The five deliverables

Each is its own self-contained directory under `dist/assets/`, named
`<filter>-<group>-<format>` — the format is the dir, not a subfolder:

| deliverable dir          | packs                                               | contents                                       |
| ------------------------ | --------------------------------------------------- | ---------------------------------------------- |
| `pd-concept-pack-svg/`   | `concept-pack`                                      | `<asset>-<size>.svg` + `manifest.json`         |
| `pd-concept-pack-react/` | `concept-pack`                                      | `<asset>.tsx` + `index.ts` + `manifest.json`   |
| `pd-icons-svg/`          | `icons-{solid,stroke}-{mono,multi}` (4, **merged**) | `<style>/<asset>-<size>.svg` + `manifest.json` |
| `pd-icons-react/`        | same four packs                                     | `<asset>.tsx` + `index.ts` + `manifest.json`   |
| `web-illustrations-svg/` | `illustrations`                                     | `<asset>-<size>.svg` + `manifest.json`         |

The group `manifest.json` is written into **every** deliverable dir for that group
(identical), so each platform dir stands alone. Icons namespace their SVGs by style
(`pd-icons-svg/stroke-mono/…`); other groups are flat. Assets are platform-filtered
by each asset's own `platforms` array — `pd-*` keeps `PD` assets, `web-*` keeps
`WEB`. **R8 rasters** are copied through byte-for-byte (no transform); a raster has
no React component. Tokens live under the sibling `dist/tokens/` root.

## React codegen

`react/codegen.ts` emits one `.tsx` per asset id. Props:

- **`size`** (both groups) — the manifest size keys; default = the effective
  canonical (`24`), per spec R11.
- **`variant`** (icons only) — the **style** (`stroke-mono`, `solid-multi`, …),
  restricted to the packs that asset appears in. concept-pack has no style axis, so
  its components expose only `size` (the user-facing "variant" for that group is
  the size). Default variant follows a fixed style precedence.

**Dedup.** With lossless resize, an asset's sizes share identical inner geometry,
differing only in root width/height and a uniform stroke-width (lifted to the root
so it inherits). Each unique `<svg>` geometry is emitted **once** as a constant and
reused across sizes/styles; the component clones it per render with the size's
width/height/strokeWidth + forwarded props/ref (the ui-legacy BaseIcon pattern). A
hand-authored size override (different markup) falls into its own constant. Output
is inline JSX (no svgr `?react` — that is a ui-legacy Vite build feature; this tool
has no Vite build). Generated `.tsx` lands in gitignored `dist/`, outside the
tool's `tsconfig`; `codegen.test.ts` asserts dedup, the prop unions/defaults, and
that the TSX transpiles cleanly.

## CLI / CI

The platform key stays `<filter>-<output>`; the deliverables are sub-dirs, not new
keys. `filtersFor('assets')` returns `['pd','web']` so assets build on both filters
independently of the token `FILTERS`. CI rebuilds incrementally — see the contract
table in [`../AGENTS.md`](../AGENTS.md) and the `assets-detect` / `assets-build`
jobs in `.github/workflows/ci.yml`.

## Gotchas

- **`concept-pack.image-raster` is a known upstream defect** — the manifest
  references `image-raster-24.png` but the package ships `image-raster-24.svg`. The
  resolver catches it (missing-file invariant); the build skips it with a warning,
  and `resolve.test.ts` asserts the fail-closed behavior. Fix belongs in
  `@acronis-platform/design-assets` (and needs a changeset).
- **mono vs multi is pack-name driven** (the `MONO_PACKS` set in `pipeline.ts`),
  not detected from content. A new mono/multi pack must be added there.
