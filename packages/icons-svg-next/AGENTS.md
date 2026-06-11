# AGENTS.md — `packages/icons-svg-next`

`@acronis-platform/icons-svg-next` — **private, source-only** package of raw SVG
icon sources for the **next-generation** icon set, fetched from the
`shadcn-uikit` Figma file, plus per-category JSON manifests. No build step, no
published artifact: consumers read `src/` directly through the package `exports`
map. Unlike `packages/icons-svg`, this package keeps a single flat icon set —
there is **no monocolor/multicolor split**.

It is the sibling of `packages/icons-svg` (the legacy icon source) and shares
the same `@acronis-platform/figma-icons-fetcher` engine — but uses the fetcher's
`icon-packs` selection strategy (against a node id) instead of `frames-by-name`.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## Layout

| Path         | Contents                                                         |
| ------------ | ---------------------------------------------------------------- |
| `src/svg/`   | Full current icon set — a flat, clean mirror, replaced each sync |
| `src/figma/` | Per-pack (or per-category) manifests + combined `icons.json`     |

## Source structure (important)

Icons are pulled from the **`icon-packs-source`** section (Figma node
`2246:3201`) via the fetcher's **`icon-packs`** strategy. The section is fetched
directly by node id, so no page name is configured.

- The section has **four top-level frames** — `stroke-mono`, `stroke-multi`,
  `solid-mono`, `solid-multi`. Each is a **pack**; a combined `src/figma/icons.json`
  lists every icon across all packs.
- Icons are the `COMPONENT` nodes named `_iconsource/<Name>` (the `_iconsource/`
  prefix is stripped to form the icon name).
- **Manifest grouping follows the pack layout.** A pack that organizes icons
  into `Category` frames splits into one manifest per category, named
  `<pack>-<category>` from the category's `CategoryTitle` (today `stroke-mono`
  → `stroke-mono-arrows.json`, `stroke-mono-shapes.json`, `stroke-mono-symbols.json`,
  `stroke-mono-documents.json`, `stroke-mono-objects.json`, `stroke-mono-assets.json`).
  A pack that lists icons directly gets a single `<pack>.json` (`stroke-multi.json`,
  `solid-mono.json`, `solid-multi.json`).
- All SVGs land **flat** in `src/svg/` (no per-pack subfolders). Icon names can
  repeat across packs (a stroke vs solid variant); colliding names are surfaced
  by the fetcher and suffixed `-duplicate` (see below).

The source is a live design surface, so a sync may surface work-in-progress
noise the designer still needs to clean up:

- **Duplicate names** — the same name in two packs, or genuine WIP dupes. The
  fetcher warns and suffixes them `-duplicate`. Fix the names in Figma if
  unintended, then re-sync.
- **Stray markup / placeholders** — a few unfinished components carry annotation
  artifacts or fail to render (skipped via `SKIP_MISSING_IMAGES`). Fix at source.

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
