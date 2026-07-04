# Output — the CSS + Tailwind contract

The token build writes into the published `packages/tokens-pd/` package (committed,
not gitignored), grouped into `css/`, `tailwind/`, and `dtcg/` dirs. The CSS
(`tokens-pd/css/`) is partitioned by tier and brand:

- `css/acronis.css` — semantic tier, default brand (full): every `--ui-*` color +
  dimension custom property (colors in both light and dark), followed by the
  `.ui-typography-*` utility classes.
- `css/brand-b.css` — semantic tier, non-default brand: **override-only** (below).
- `css/<component>/acronis.css` — component tier, default brand (full), one dir per
  component (`button/`, `breadcrumb/`, …).
- `css/<component>/brand-b.css` — component tier, non-default brand: override-only.

Tokens partition into files by `token.path[0]`: `colors` and `typography` are the
semantic tier (root file); every other root is its own component dir.

## Theming — `light-dark()` + `color-scheme`

The modern, single-block approach (baseline-supported: Chrome 123+, Safari 17.5+,
Firefox 120+). Every variable lives in `:root`; color values carry both modes
inline and the browser resolves them from `color-scheme`:

```css
:root {
  color-scheme: light dark;

  --ui-background-surface-primary: light-dark(rgb(255 255 255), rgb(0 0 0));
  --ui-breadcrumb-gap: 4px;
}

[data-theme='light'] {
  color-scheme: light;
}
[data-theme='dark'] {
  color-scheme: dark;
}
```

By default the page follows the OS preference; setting `data-theme` on any
ancestor (or `color-scheme` directly) forces a mode for that subtree. Only the
**base** (`acronis`) files carry this shell; override files are bare `:root {}`.

## Brand model — base + override

Files write a bare `:root` (no brand class). An app picks **one brand**: import the
base then optionally that brand's override file — last import wins. A non-default
brand file contains a declaration only when its value **differs** from `acronis`
or is **new** in that brand (identical tokens are omitted).

## Variable & class names — `--ui-*`

The `name/ui` transform drops a leading `colors` tier segment and prefixes every
token with `ui`:

- `colors.background.surface.primary` → `--ui-background-surface-primary`
- `button._global.radius` → `--ui-button-global-radius` (leading `_` dropped)
- typography composites become a class → `.ui-typography-body-default`

## Value formats

| Token `$type` | Output                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color`       | `--ui-…` custom property, `light-dark(<rgb>, <rgb>)` — modern `rgb(r g b)`, or `rgb(r g b / a)` when the color carries opacity (raw decimal alpha) |
| `gradient`    | `--ui-…` custom property, `linear-gradient(<deg>, <rgb> <pos>%, …)` (theme-invariant; angle from the Figma transform)                              |
| `dimension`   | `--ui-…` custom property, `<value><unit>`, e.g. `4px`, `0px`                                                                                       |
| `typography`  | a `.ui-typography-…` class: `font-family`, `font-size` (px), `font-weight`, `line-height` (px), `letter-spacing` (px)                              |

Colors are always wrapped in `light-dark()`, even when both modes resolve to the
same value. Gradients, dimensions, and typography are mode-invariant, so they
appear once with a single value.

## Gradients

`colors.background.ai.*` gradient tokens are rendered by the `gradient/css`
transform (`hooks/transforms/gradient-css.ts`): the `$value` is a DTCG array of
`{ color, position }` stops and the matrix is under
`$extensions.com.figma.gradientTransform`, mapped to a CSS angle via
`atan2(a, -c)`. Each stop color uses the same hsl→rgb conversion as solid colors.

## Tailwind presets

`pd-tailwind` (`tailwind.ts`) emits `tailwind/<brand>.js` (+ `.d.ts`) — a preset
object (`{ theme: { extend: … } }`) consumed via `@config`. Values are
**baked** resolved literals (colors as `light-dark()`, gradients into
`backgroundImage`, typography into `fontSize`/`fontFamily`, dimensions into
`spacing`/`borderRadius`), keyed with the `ui-` prefix — so a preset is
self-contained (no `--ui-*` dependency) and brand selection is build-time.
