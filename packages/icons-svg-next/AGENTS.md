# AGENTS.md — `packages/icons-svg-next`

`@acronis-platform/icons-svg-next` — **private, source-only** package of raw SVG
icon sources for the **next-generation** icon set, fetched from the
`shadcn-uikit` Figma file, plus per-category JSON manifests. No build step, no
published artifact: consumers read `src/` directly through the package `exports`
map. Unlike `packages/icons-svg`, this package keeps a single flat icon set —
there is **no monocolor/multicolor split**.

It is the sibling of `packages/icons-svg` (the legacy icon source) and shares
the same `@acronis-platform/figma-icons-fetcher` engine — but uses the fetcher's
`new-frames` selection strategy instead of `frames-by-name`.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## Layout

| Path         | Contents                                                       |
| ------------ | -------------------------------------------------------------- |
| `src/svg/`   | Full current icon set — a clean mirror, replaced on every sync |
| `src/figma/` | Per-category + combined `icons.json` manifests (name arrays)   |

## Source structure (important)

Icons are pulled from the `[TEMP] Old icons categorisation` canvas via the
fetcher's **`new-frames`** strategy:

- Each **top-level frame** (`Arrows`, `Objects`, `Shapes`, `Symbols`,
  `Documents`, `asset types`, `Brands / logos`) is a **category** and becomes a
  manifest group.
- Inside each category, the redesigned icons live in green frames badged with a
  vertical **`New`** text label. Only the icon leaves inside those frames are
  pulled; the old size-suffixed icons (`name--16/24/32`) sitting next to them
  are ignored.

The source canvas is a live design surface, so a sync may surface
work-in-progress noise the designer still needs to clean up:

- **Duplicate names** (e.g. several `Monitor` variants) — the fetcher warns and
  suffixes them `-duplicate`. Fix the names in Figma, then re-sync.
- **Stray markup** — a few unfinished frames carry annotation artifacts (e.g. a
  red overlay) that end up in the exported SVG. Fix at source.

The `currentColor` system color for this set is `#1763CF` (the redesign stroke).

## Scripts

- `pull-icons` — runs `@acronis-platform/figma-icons-fetcher` from this package's
  directory (`tsx ../../tools/figma-icons-fetcher/src/index.ts`), so the
  fetcher's relative output paths (`./src/svg`, `./src/figma`) and `.env.local`
  resolve here. Config comes from `.env.local` (copy from `.env.local.example`)
  or `process.env`. The fetcher runs with color categorization **off** — only
  `src/svg/` and `src/figma/` are written.
- `build`/`dev`/`clean`/`lint`/`test`/`typecheck` are intentional no-ops (raw
  data package — no TypeScript source of its own).

## Sync model

The fetcher does a **clean sync** of `src/svg/`: it is fully replaced with the
current Figma set on every run, and `src/figma/` manifests are regenerated to
match. There are no append-only directories.

## Updating icons

Either run `pull-icons` locally and open a PR, or trigger the **Fetch Figma
Icons (next)** workflow (`.github/workflows/icons-next-fetch.yml`), which runs
the sync and opens a PR. Never hand-edit fetched SVGs — they'll be overwritten on
the next sync; fix the source in Figma instead.
