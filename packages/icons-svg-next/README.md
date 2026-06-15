# @acronis-platform/icons-svg-next

Next-generation raw SVG icon sources for Acronis — redesigned icons fetched from
the `shadcn-uikit` Figma file, plus per-pack JSON manifests. Private,
source-only: it ships no build artifact and is consumed in-repo directly from
`src/`. Unlike [`packages/icons-svg`](../icons-svg), it keeps a single flat icon
set — there is **no monocolor/multicolor split**.

```
src/
  svg/      # full current set (flat), replaced on every Figma sync
  figma/    # per-pack/per-category manifests + combined icons.json
```

The icon set is split into four **packs** by style × fill — `stroke-mono`,
`stroke-multi`, `solid-mono`, `solid-multi` — plus a combined `icons.json`. A
pack organized into categories splits into one manifest per category
(`stroke-mono-arrows.json`, `stroke-mono-shapes.json`, …); a pack that lists
icons directly gets a single `<pack>.json`. SVGs are stored flat, so a name
shared by two packs (a stroke vs solid variant) collides and the later one is
suffixed `-duplicate`.

## Importing (in-repo)

```ts
// raw SVG markup (resolved via the package "exports" map)
import arrowUturn from '@acronis-platform/icons-svg-next/svg/arrow-uturn.svg';

// a manifest (array of icon names)
import strokeArrows from '@acronis-platform/icons-svg-next/figma/stroke-mono-arrows.json' with { type: 'json' };
```

## Syncing icons from Figma

Icons are pulled by `@acronis-platform/figma-icons-fetcher` using its
`icon-packs` selection strategy against the `icon-packs-source` section (node
`2246:3201`, fetched directly by id). Each of the section's four top-level
frames is a pack, and icons are the `_assetsource/<Name>` components inside it;
packs organized into `Category` frames split into per-category manifests. Only
`src/svg/` and `src/figma/` are written (color categorization is off).

### Locally (then open a PR yourself)

1. Get a token at https://www.figma.com/developers/api#access-tokens
2. Copy `.env.local.example` → `.env.local` and set `FIGMA_FETCHER_FIGMA_TOKEN`
   (the file key, node id, and strategy are pre-filled).
3. Run the sync, then commit and open a PR:

```bash
pnpm --filter @acronis-platform/icons-svg-next pull-icons
git checkout -b chore/figma-icons-next-sync
git add packages/icons-svg-next/src
git commit -m "chore(icons-svg-next): sync icons from Figma"
```

### Via CI

The **Fetch Figma Icons (next)** GitHub Action
(`.github/workflows/icons-next-fetch.yml`) runs the same sync on demand
(Actions tab → Run workflow) and opens a pull request with any changes.

## Sync behavior

`src/svg/` is a **clean mirror** of the current Figma set — fully replaced on
every run — and `src/figma/` manifests are regenerated to match.

> The source canvas is a live design surface. A sync may surface
> work-in-progress noise (duplicate names → suffixed `-duplicate`, or stray
> annotation markup in a few SVGs). Review the diff and fix at the Figma source,
> then re-sync.
