# AGENTS.md — `packages/icons-svg-next`

`@acronis-platform/icons-svg-next` — **private, source-only** package of raw SVG
icon sources for the **next-generation** icon set, plus per-category JSON
manifests. No build step, no published artifact: consumers read `src/` directly
through the package `exports` map. Unlike `packages/icons-svg` (the legacy icon
source, of which this is the sibling), it keeps a single flat icon set — there
is **no monocolor/multicolor split**.

The SVGs and manifests are **committed in-repo and maintained by hand**. There
is no automated Figma pull for this package.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## Layout

| Path         | Contents                                                     |
| ------------ | ------------------------------------------------------------ |
| `src/svg/`   | Full icon set, flat (no per-pack subfolders)                 |
| `src/figma/` | Per-pack (or per-category) manifests + combined `icons.json` |

## Set structure (important)

- The set is split into **four packs** — `stroke-mono`, `stroke-multi`,
  `solid-mono`, `solid-multi`. A combined `src/figma/icons.json` lists every
  icon across all packs.
- **Manifest grouping follows the pack layout.** A pack organized into
  categories has one manifest per category, named `<pack>-<category>` (today
  `stroke-mono` → `stroke-mono-arrows.json`, `stroke-mono-shapes.json`,
  `stroke-mono-symbols.json`, `stroke-mono-documents.json`,
  `stroke-mono-objects.json`, `stroke-mono-assets.json`). A pack that lists
  icons directly has a single `<pack>.json` (`stroke-multi.json`,
  `solid-mono.json`, `solid-multi.json`).
- SVGs are stored **flat** in `src/svg/`, so a name shared by two packs (a
  stroke vs solid variant) collides; the colliding file carries a `-duplicate`
  suffix.

The `currentColor` system color for this set is `#1763CF` (the redesign stroke).

## Scripts

`build`/`dev`/`clean`/`lint`/`test`/`typecheck` are intentional no-ops (raw
data package — no TypeScript source of its own).

## Updating icons

Add, replace, or remove SVGs under `src/svg/` directly and update the matching
`src/figma/` manifest (and `icons.json`) in the same change.
