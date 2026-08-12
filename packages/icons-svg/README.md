# @acronis-platform/icons-svg

Raw SVG icon sources for Acronis — **monocolor** and **multicolor** icons, plus
per-page JSON manifests. Private, source-only: it ships no build artifact and is
consumed in-repo directly from `src/`.

```
src/
  svg/                # full icon set
  monocolor-icons/    # single-color icons
  multicolor-icons/   # multi-color icons
  figma/              # per-page + combined JSON manifests (icon name lists)
```

## Importing (in-repo)

```ts
// raw SVG markup (resolved via the package "exports" map)
import addIcon from '@acronis-platform/icons-svg/monocolor/add--16.svg';
import statusIcon from '@acronis-platform/icons-svg/multicolor/status-ok--24.svg';

// a manifest (array of icon names)
import actions from '@acronis-platform/icons-svg/figma/actions.json' with { type: 'json' };
```

## Updating icons

The SVGs and manifests are committed in-repo and maintained by hand — there is
no automated Figma pull. Add, replace, or remove files under `src/` and update
the matching `src/figma/` manifest in the same change. The `icons-sprite`
package generates its committed sprites from this one, so re-run its `build`
afterwards.

## Maintenance

`pnpm --filter @acronis-platform/icons-svg fix-viewbox` normalizes any
monocolor SVG whose `viewBox` has a negative origin, shifting absolute path
coordinates so the origin becomes `0 0`.
