# AGENTS.md — `packages/icons-svg`

`@acronis-platform/icons-svg` — **private, source-only** package of raw SVG icon
sources (monocolor + multicolor), plus per-page JSON manifests. No build step,
no published artifact: consumers read `src/` directly through the package
`exports` map.

The SVGs and manifests are **committed in-repo and maintained by hand**. There
is no automated Figma pull for this package.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## Layout

| Path                    | Contents                                                      |
| ----------------------- | ------------------------------------------------------------- |
| `src/svg/`              | Full icon set                                                 |
| `src/monocolor-icons/`  | Single-color icons                                            |
| `src/multicolor-icons/` | Multi-color icons                                             |
| `src/figma/`            | Per-page + combined `icons.json` manifests (icon name arrays) |
| `scripts/`              | `fix-negative-viewbox.ts` maintenance script                  |

## Scripts

- `fix-viewbox` — normalizes monocolor SVGs with a negative `viewBox` origin.
- `build`/`dev`/`clean`/`test` are intentional no-ops (raw data package).
- `typecheck` covers only `scripts/` (the SVG/JSON data is not typechecked).

## Updating icons

Add, replace, or remove SVGs under `src/` directly and update the matching
`src/figma/` manifest in the same change. Removing an icon breaks any consumer
still importing it — `packages/icons-sprite` regenerates its committed sprites
from this package, so re-run its `build` after any change here.
