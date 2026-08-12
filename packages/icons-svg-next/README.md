# @acronis-platform/icons-svg-next

Next-generation raw SVG icon sources for Acronis — the redesigned icon set, plus
per-pack JSON manifests. Private, source-only: it ships no build artifact and is
consumed in-repo directly from `src/`. Unlike the `icons-svg` package, it keeps
a single flat icon set — there is **no monocolor/multicolor split**.

```
src/
  svg/      # full icon set (flat)
  figma/    # per-pack/per-category manifests + combined icons.json
```

The icon set is split into four **packs** by style × fill — `stroke-mono`,
`stroke-multi`, `solid-mono`, `solid-multi` — plus a combined `icons.json`. A
pack organized into categories splits into one manifest per category
(`stroke-mono-arrows.json`, `stroke-mono-shapes.json`, …); a pack that lists
icons directly gets a single `<pack>.json`. SVGs are stored flat, so a name
shared by two packs (a stroke vs solid variant) collides, and the colliding file
carries a `-duplicate` suffix.

## Importing (in-repo)

```ts
// raw SVG markup (resolved via the package "exports" map)
import arrowUturn from '@acronis-platform/icons-svg-next/svg/arrow-uturn.svg';

// a manifest (array of icon names)
import strokeArrows from '@acronis-platform/icons-svg-next/figma/stroke-mono-arrows.json' with { type: 'json' };
```

## Updating icons

The SVGs and manifests are committed in-repo and maintained by hand — there is
no automated Figma pull. Add, replace, or remove files under `src/svg/` and
update the matching `src/figma/` manifest (and `icons.json`) in the same change.
