# AGENTS.md — `tools/style-dictionary`

`@acronis-platform/style-dictionary` — a **private** (unpublished) build tool: a
[Style Dictionary v5](https://styledictionary.com/) translation pipeline that
turns `@acronis-platform/design-tokens` into the published
`@acronis-platform/tokens-pd` package (per-brand CSS, per-component CSS, Tailwind
presets, and a DTCG intermediate). This is the first inhabitant of the repo's
`tools/` tier (scripts that automate, translate, or execute operations — never
published to npm).

Repo-wide rules (TypeScript, file naming, Conventional Commits) live in the repo
root's [`../../context/`](../../context/) and apply on top. This file documents
only what is specific to this workspace.

## Build

The only script that does real work. From the repo root:

```bash
pnpm --filter @acronis-platform/style-dictionary build
```

`src/index.ts` is the single entry point. Each output is a **platform key**,
`<filter>-<output>` — the SD-style name that is also the CLI selector. It builds
them in dependency order. The **token** outputs are written into the published
`packages/tokens-pd/` package (committed, not gitignored); **assets** stay under
this tool's gitignored `dist/assets/`:

1. `pd-dtcg` → `tokens-pd/dtcg/` — six per-mode, 100%-DTCG JSON files.
2. `pd-css` → `tokens-pd/css/` — semantic tier at the css root (`acronis.css`
   full, `brand-b.css` override-only) + one dir per component
   (`css/<component>/<brand>.css`). Names use the `--ui-*` convention.
3. `pd-tailwind` → `tokens-pd/tailwind/<brand>/tokens.js` (semantic) +
   `tokens-pd/tailwind/<brand>/components/<component>.js` (one per component) —
   per-brand Tailwind presets with **baked** token values, consumed via `@config`.
   Colors use role-namespaced keys (`bg-surface-primary`, `fill-on-surface-primary`,
   `ring-brand`); splitting the components out keeps their utilities opt-in.
4. `pd-assets` / `web-assets` → optimized SVG + React from
   `@acronis-platform/design-assets`, emitted as **one dir per deliverable** under
   `dist/assets/<filter>-<group>-<format>/`: `pd-icons-{svg,react}` (the `icons`
   pack's four `assetsGroups` merged) and `web-illustrations-svg` (SVG-only). The
   group manifest is duplicated into each deliverable dir so it is self-contained.
   See [`context/assets.md`](context/assets.md).

Usage:

```bash
tsx src/index.ts                                # all filters, all outputs
tsx src/index.ts pd-css                         # one platform (runs its pd-dtcg dependency first)
tsx src/index.ts pd-assets web-assets --pack=icons   # one asset pack only
tsx src/index.ts --filter=web                   # restrict to one filter (web-assets only)
```

`pd-css` and `pd-tailwind` consume the DTCG files `pd-dtcg` writes, so requesting
either runs `pd-dtcg` first; the default builds everything. `dev` is a no-op;
`clean` removes `dist/` (assets only — the token output lives in `tokens-pd` and
is cleaned per-build before regenerating); `lint`/`typecheck` run eslint/tsc;
`test` runs the vitest suite (resolver R1–R16, executor, codegen, SVGO, plus the
token normalization + CSS rendering units).

## Platforms

A platform key is `<filter>-<output>`. Both halves are real axes:

- **`filter`** (`pd` | `web`) maps to the `platforms` enum (`PD` | `WEB`) — a
  closed enum mirrored by design-tokens and design-assets. The same sources produce
  a **different** bundle per filter.
- **`output`** (`dtcg` | `css` | `tailwind` | `assets`) is the artifact kind.

The valid filters differ **per output**, because tokens and assets have different
source coverage — `filtersFor(output)` in `index.ts` encodes this:

- `dtcg`/`css`/`tailwind` come from the token package. Every token is `["PD"]`
  today, so `FILTERS` is `['pd']`; `web` is schema-defined and coming.
- `assets` come from `@acronis-platform/design-assets`, which **already** spans
  both platforms — icons are `PD`, illustrations `WEB` — selected
  per-asset by each asset's own `platforms`. So the asset build runs for
  `ASSET_FILTERS` (`['pd','web']`), independent of the token `FILTERS`. The valid
  platform keys are therefore `pd-{dtcg,css,tailwind,assets}` + `web-assets`.
- Adding WEB tokens = add `'web'` to `FILTERS`. No hook changes — the stages take a
  `filter` and derive their keys / dist dirs from it.

## Source layout

`index.ts` is the **CLI home only** — it parses keys/filters/packs and dispatches
to the build domains. `tokens.ts` is the Style Dictionary token → CSS build (its SD
hooks live in `hooks/`); `tailwind.ts` builds the per-brand Tailwind presets
(reusing `tokens.ts`'s resolve); `assets/` is the design-assets → SVG/React build
(no SD instance — its own resolver + executor + codegen). The shared platform-key
axes + output locations they all agree on live in `platforms.ts`, so no domain has
to import the CLI.

```
src/
  index.ts              CLI home: parseArgs/parseKey/main, dispatch to tokens + tailwind + assets.
  platforms.ts          Shared axes: Filter/Output/PlatformKey, FILTERS, OUTPUTS,
                        filtersFor, ALL_FILTERS, FILTER_ENUM; the tokens-pd output
                        paths (TOKENS_PD, dtcgDir, cssDir, semanticsFile, componentFile,
                        tailwindDir, tailwindTokensPreset, tailwindComponentPreset),
                        DIST/ASSETS_DIST, rel.
  tokens.ts             The two SD stages (buildDtcg, buildCss) + TOKEN_SOURCES, VIEWS,
                        BRANDS, the makeSd factory; exports resolveTokens/resolveColorMap.
  tailwind.ts           buildTailwind — per-brand Tailwind preset (baked values).
  hooks/                Style Dictionary hooks — the token pipeline's extension points.
    preprocessors/      acronis/dtcg — Acronis source → per-mode DTCG. `normalizeTree`
                        is what stage 1 calls directly; `acronisDtcg` wraps it as an
                        SD preprocessor (kept for reuse, not currently registered).
    transforms/         color/hsl-to-rgb, gradient/css, dimension/px, scalar/css,
                        typography/css-class, name/ui + the `acronis/css` transform group.
    filters/            semantic-only — drop the primitive roots from CSS output
                        (isEmittableToken is the plain predicate the builder reuses).
    formats/            css/light-dark — collectDecls + serializeCss render the CSS.
    index.ts            STATIC_HOOKS — the registry every instance shares.
  assets/               The design-assets → SVG/React domain (see context/assets.md):
    read.ts             load packs / rules / binaries from the package.
    resolve.ts          the resolver — spec §a–g + runtime invariants (fail closed).
    executor.ts         the executor — apply scale/stroke rules to an SVG.
    rules/, color.ts    scale (lossless resize), stroke (width formula), currentColor.
    svgo-config.ts      conservative SVGO (mono | preserve).
    react/              codegen + naming (one .tsx per asset, size/variant props, dedup).
    emit.ts, pipeline.ts  write the dist layout; orchestrate per filter.
    index.ts            barrel — buildAssetsForFilter, ASSET_FILTERS, listPackNames.
    __tests__/          vitest specs.
```

`tokens.ts` + `hooks/` are the SD token build; `assets/` is the independent SVG
pipeline; `index.ts` just wires them to the CLI. Adding a token output is a new
build function in `tokens.ts` + a CLI branch; new token logic goes in a hook under
`hooks/`. A new source package gets a reader (like `readTokenSource` in `tokens.ts`
/ `assets/read.ts`).

## CI integration

Change-detection and validation-gating live in **CI**, not this tool — the tool is
a pure, granular builder. CI detects changed paths, runs each package's existing
`validate` (ajv), and on success calls the tool with the right selector. The
contract, implemented by the `assets-detect` / `assets-build` jobs in
`.github/workflows/ci.yml`:

| Changed path                                     | Build invocation                                        |
| ------------------------------------------------ | ------------------------------------------------------- |
| `design-tokens/tiers/**` or its schema           | `build` (token build: `pd-dtcg`+`pd-css`+`pd-tailwind`) |
| `design-assets/packs/<name>.json` or `<name>/**` | `build pd-assets web-assets --pack=<name>`              |
| `design-assets/rules/**` or `pack.schema.json`   | `build pd-assets web-assets` (all packs — shared input) |

Both asset filters (`pd-assets web-assets`) are passed because a pack's platform —
not the selector — decides where it lands: an icon pack emits under `pd-assets`,
`illustrations` under `web-assets`. The tool drops keys whose group has no selected
pack, so the unaffected filter is a no-op. Tokens always build together (one
schema, tightly-coupled files); assets are per-pack (a pack name is the
`packs/<name>.json` stem). `--pack` validates against the live pack list, so the
tool needs `@acronis-platform/design-assets` as a workspace dependency.

## Gotchas

- **Node ≥ 22** — Style Dictionary v5 requires it (the repo is already on 22).
- **Token output is committed, assets are gitignored.** The token builds write
  into `packages/tokens-pd/` whose generated files are **tracked** (CI fails if a
  token change isn't re-generated + committed — see the drift gate in `ci.yml`);
  the asset build still writes gitignored `dist/assets/`.
  `@acronis-platform/design-tokens` is the source of truth either way — never
  hand-edit generated output.
- **`--ui-*` naming.** The `name/ui` transform drops a leading `colors` tier
  segment and prefixes every token with `ui` (`colors.background.surface.primary`
  → `--ui-background-surface-primary`). Tokens partition into output files by
  `token.path[0]`: the **data-driven** semantic roots (`colors`/`gradients`/
  `typography`) → the semantic root file, every other root → its own component
  dir. The semantic roots are derived from the top-level keys of `semantics.json`
  via the shared `semanticRoots()` helper, not a hardcoded set. Non-default brands
  are diffed against the default (`acronis`) and emit override-only files.
- **Platform filter** — the `normalizeTree` pass keeps only tokens whose
  `platforms` array includes the build's filter enum value (PD today), then strips
  the (non-DTCG) `platforms` key; `$extensions` is retained for traceability. The
  enum value is threaded in from the `filter` via `FILTER_ENUM` (see Platforms),
  not hardcoded.
- **Stage 1 serializes `normalizeTree`'s output directly**, not `sd.tokens` —
  SD's own init normalization relocates `$type` (it drops the redundant
  group-level type _and_ the token-level type on units-promoted dimensions),
  which would break the "every token self-describing, references intact"
  contract of the DTCG artifact. That's why `buildDtcg` calls `normalizeTree`
  itself instead of running stage 1 through an SD instance.
- **Scalar value transforms stay non-transitive; the typography one must be
  transitive.** Stage 2's `acronis/css` group keeps `color/hsl-to-rgb`,
  `dimension/px`, and `scalar/css` **non-transitive** — they run after reference
  resolution and must not be `transitive: true` (a transitive scalar transform
  re-runs mid-resolution and breaks `{…}` alias resolution). `typography/css-class`
  is the deliberate **exception**: a composite token's sub-fields are references,
  so SD only applies a value transform to it on the transitive (post-resolution)
  pass — non-transitive, it never fires at all. It's safe because typography
  composites are terminal (nothing aliases into them), so it can't interfere with
  anyone else's resolution.
- **Typography → utility classes, not variables.** Composite typography tokens
  are emitted as `.ui-typography-*` classes (one declaration per field), not per
  field as `--…` custom properties. They are **not** expanded: the
  `typography/css-class` transform builds the declaration block from the resolved
  composite `$value`, and `serializeCss` wraps it in the `.ui-typography-*`
  selector. Because the composite's sub-fields carry no `$type`, the transform
  formats them by shape (`formatScalar`), handling both already-px strings and
  inline `{ value, unit }` objects.
- **Gradients are supported.** The `gradient/css` transform renders the top-level
  `gradients.*` root (color-stop arrays + a Figma transform matrix) into
  `linear-gradient(...)` strings (angle from `com.figma.gradientTransform`).
  `gradients` is a semantic root, so they emit as plain `--ui-gradients-*` custom
  properties (theme-invariant, not zipped into `light-dark()`) in the root semantic
  CSS, and route into the base Tailwind preset's `backgroundImage` — the routing is
  driven by the source `com.acronis.tailwindRoles` extension, not hardcoded.
- **Assets: lossless resize + data-driven currentColor.** `scale` sets
  width/height and preserves the viewBox; `stroke` sizes to target px via
  `S·viewBoxLonger/renderedLonger`; `currentColor` is applied to **mono** styles
  only — a style is mono when its effective `values` reference a `color`-kind rule
  (`current-color`), not a hardcoded pack list (multi + illustrations keep exact
  colors). The `icons` pack ships its styles as `assetsGroups`; the pipeline
  expands each group into a flat manifest and resolves it. SVGO keeps the viewBox
  and ids. The asset **build** skips a broken asset with a warning (so one upstream
  defect doesn't sink it) while the **resolver** stays strict for tests — full
  reasoning and the React dedup are in [`context/assets.md`](context/assets.md).

## Loading context

Before non-trivial work, read the matching file(s) in full.

| When the task involves…                                                                                                                     | Load                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| The two stages, the source→mode mapping, the PD filter, how aliases are kept vs flattened                                                   | [`context/pipeline.md`](context/pipeline.md) |
| The CSS contract — `light-dark()`, `rgb()` colors, `--ui-*` names, tier split, brand override diff, typography, gradients, Tailwind presets | [`context/output.md`](context/output.md)     |
| The assets build — resolver/executor split, scale/stroke execution, currentColor, SVGO, React dedup + size/variant                          | [`context/assets.md`](context/assets.md)     |

To understand the **input** shape (the Acronis token divergences this tool
consumes), read
[`../../packages/design-tokens/context/manifest.md`](../../packages/design-tokens/context/manifest.md).

## Conventions for new context files

`context/<name>.md`, lowercase-hyphen. One concept per file; add a row to the
table above in the same change — an unlisted file is invisible to the agent.
