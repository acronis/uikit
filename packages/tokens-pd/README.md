# @acronis-platform/tokens-pd

The Acronis platform (**PD**) design tokens, as ready-to-consume artifacts
generated from [`@acronis-platform/design-tokens`](../design-tokens) (the raw
DTCG token data) by the
[`@acronis-platform/style-dictionary`](../../tools/style-dictionary) build tool.

The raw tokens are a Figma-exported, multi-dimensional DTCG variant that no app
can use directly — primitives carry per-scheme (`light`/`dark`) values and
semantic/component tokens carry per-brand aliases back into the primitives. This
package ships the resolved output. **The generated files are committed** (and
published); do not edit them by hand — change the upstream tokens and rebuild.

Brands: `default` plus `blue_yellow_uss_signal`, `brown`, `dark_gray`,
`deep_purple`, `deep_sky_itkontoret`, `green_also_choise_df`, `ingram_micro`,
`light_blue_hp`, `light_gray`, `orange_tsukaeru_helpox`, `pinky`, `purple`,
`purple_fusion_media`, `red_fire_brick`, `red_home_pl`, `sand`, `telstra`,
`virtual_one`, `virtuozzo`, `yellow_1c`.

## Layout

Output is grouped into three top-level directories — `css/`, `bundles/`, `dtcg/`:

| Path                          | Tier      | Contents                                                                                                                                 |
| ----------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `css/default.css`             | semantic  | Default brand — every semantic token (`--ui-*`, incl. `--ui-shadow-*`), `.ui-typography-*`, `.ui-p-*`/`.ui-m-*`/`.ui-gap-*`              |
| `css/<brand>.css`             | semantic  | Non-default brand — only the tokens that differ from `default`                                                                           |
| `css/<Component>/default.css` | component | Default brand — that component's tokens (`Button/`, `Tooltip/`, …; dirs are PascalCase)                                                  |
| `css/<Component>/<brand>.css` | component | Non-default brand — only the component tokens that differ                                                                                |
| `bundles/<brand>.css`         | bundle    | Full brand in one file — semantic tier + every component tier merged, always full (never override-only). Runtime re-theming entry point. |
| `dtcg/*.json`                 | —         | The 100%-DTCG intermediate (per-mode), for generic DTCG tooling                                                                          |

Names use the `--ui-*` convention (the `colors` tier segment is dropped, every
token is prefixed with `ui`): `colors.background.surface.primary` →
`--ui-background-surface-primary`.

## Consume

```css
/* Default brand */
@import '@acronis-platform/tokens-pd/css/default.css';

/* Component tier is opt-in, per component (dirs are PascalCase) */
@import '@acronis-platform/tokens-pd/css/Button/default.css';
```

**Brand override: every tier must be overridden.** Overriding only the semantic
file (`css/<brand>.css`) re-themes the shared `--ui-*` vocabulary but leaves
every component on the default brand's colors, because component-tier values are
baked literals, not references to the semantic tokens. Load the matching component
override for each component tier you use:

```css
@import '@acronis-platform/tokens-pd/css/default.css';
@import '@acronis-platform/tokens-pd/css/deep_sky_itkontoret.css'; /* semantic */
@import '@acronis-platform/tokens-pd/css/Button/default.css';
@import '@acronis-platform/tokens-pd/css/Button/deep_sky_itkontoret.css'; /* component */
```

Or use a **bundle** — one file carries the semantic tier and every component tier
merged, so you never need to enumerate component overrides:

```css
@import '@acronis-platform/tokens-pd/bundles/deep_sky_itkontoret.css';
```

Light/dark is built in via `light-dark()` + `color-scheme`; switch with the
`[data-theme]` attribute (`<html data-theme="dark">`). The base (`default`) files
declare the `color-scheme` shell; override files restate only the changed
properties on top.

## Build

```sh
pnpm --filter @acronis-platform/tokens-pd build
```

This delegates to `@acronis-platform/style-dictionary` (`pd-css`, which runs
its `pd-dtcg` dependency first). There is no build logic in this package — it
is a published home for the tool's token output.

## Scope

- Colors (incl. `light-dark()` theming and gradients as `linear-gradient(...)`),
  typography utility classes, spacing (margin/padding/gap), shadows, and component
  dimensions.
- Shadows ship as `--ui-shadow-{sm,md,lg}` custom properties. The light/dark pair
  sits **inside the shadow's color slot** (`0px 8px 16px 0px light-dark(…, …)`)
  because `light-dark()` is a color function and cannot wrap a whole shadow value.
- Spacing ships two ways, generated directly from the `units.gap` **primitive**
  scale by dedicated build code (not a semantic token — see the tool's
  `context/output.md`): `--ui-gap-*` custom properties, and framework-agnostic
  `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` utility classes (plus `.ui-mx-auto`) — not
  brand-dependent, so it carries no override-file entries.
- Non-default brands are emitted as **override-only** files: a token appears in a
  brand's file only when its value differs from `default` or is new in that brand.
