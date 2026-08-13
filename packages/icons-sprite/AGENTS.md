# AGENTS.md — `packages/icons-sprite`

`@acronis-platform/icons-sprite` — a **published** package of optimized SVG
sprites generated from [`@acronis-platform/icons-svg`](../icons-svg). It ships
three committed artifacts in `sprites/`: a combined sprite plus monocolor-only and
multicolor-only sprites.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## Generated, committed artifacts

This follows the same model as `packages/tokens-pd`: the build output is
**committed**, so consumers (and npm) get the sprites with no build step.

- `build` (`tsx scripts/generate-sprite.ts`) regenerates `sprites/*.svg`.
- `clean` is a **no-op** — it must not delete the committed sprites; `build`
  regenerates them.
- `test` runs `build` (verifies generation still works / output is current).
- Only `sprites/` is published (see `files`); `scripts/` is build-time only.

Re-run `build` and commit the result whenever the upstream `icons-svg` sources
change — the sprites are committed output, so they go stale silently otherwise.

## How generation works (`scripts/generate-sprite.ts`)

1. Resolves the icons-svg source dir via `require.resolve('@acronis-platform/icons-svg/package.json')` — not a hard-coded relative path.
2. Reads `monocolor-icons/` and `multicolor-icons/`, wrapping each SVG in a
   `<symbol id="\<prefix>-\<name>">`: prefix `m-` for monocolor, `c-` for multicolor.
3. Monocolor symbols get fills rewritten to `currentColor` (CSS-themable);
   multicolor symbols keep their colors. `paint…` ids are namespaced per icon to
   avoid gradient/clip id collisions across symbols.
4. SVGO-optimizes each sprite with a sprite-safe config: **defs/symbols/hidden
   elements and ids are preserved** (they're referenced externally), only safe
   path/color optimizations run. viewBox is kept (SVGO v4 default).

## SVGO v4 note

`preset-default` overrides must be `\<params> | false` — a bare `true` is invalid
(it's also redundant, since those plugins are on by default). `removeViewBox` is
no longer in `preset-default`, so viewBox is preserved without an override.

## Dependency on icons-svg

`@acronis-platform/icons-svg` is a **devDependency** (`workspace:*`) — used only
at build time to read source SVGs. The published artifact is static SVG, so it
carries no runtime dependency on the private icons-svg package.
