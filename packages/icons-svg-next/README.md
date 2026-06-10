# @acronis-platform/icons-svg-next

Next-generation raw SVG icon sources for Acronis — redesigned icons fetched from
the `shadcn-uikit` Figma file, plus per-category JSON manifests. Private,
source-only: it ships no build artifact and is consumed in-repo directly from
`src/`. Unlike [`packages/icons-svg`](../icons-svg), it keeps a single flat icon
set — there is **no monocolor/multicolor split**.

```
src/
  svg/      # full current set, replaced on every Figma sync
  figma/    # per-category + combined JSON manifests (icon name lists)
```

## Importing (in-repo)

```ts
// raw SVG markup (resolved via the package "exports" map)
import arrowUturn from '@acronis-platform/icons-svg-next/svg/arrow-uturn.svg';

// a manifest (array of icon names)
import arrows from '@acronis-platform/icons-svg-next/figma/arrows.json' with { type: 'json' };
```

## Syncing icons from Figma

Icons are pulled by `@acronis-platform/figma-icons-fetcher` using its
`new-frames` selection strategy: each top-level frame in the source canvas is a
category, and icons come from the green frames badged `New` inside it. Only
`src/svg/` and `src/figma/` are written (color categorization is off).

### Locally (then open a PR yourself)

1. Get a token at https://www.figma.com/developers/api#access-tokens
2. Copy `.env.local.example` → `.env.local` and set `FIGMA_FETCHER_FIGMA_TOKEN`
   (the file key, page, and strategy are pre-filled).
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
