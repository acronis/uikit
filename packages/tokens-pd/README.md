# @acronis-platform/tokens-pd

The Acronis platform (**PD**) design tokens, as ready-to-consume artifacts
generated from [`@acronis-platform/design-tokens`](../design-tokens) (the raw
DTCG token data) by the
[`@acronis-platform/style-dictionary`](../../tools/style-dictionary) build tool.

The raw tokens are a Figma-exported, multi-dimensional DTCG variant that no app
can use directly — primitives carry per-scheme (`light`/`dark`) values and
semantic/component tokens carry per-brand (`default`/`deep_sky_itkontoret`) aliases back into
the primitives. This package ships the resolved output. **The generated files are
committed** (and published); do not edit them by hand — change the upstream tokens
and rebuild.

## Layout

Output is grouped into three top-level directories — `css/`, `tailwind/`, `dtcg/`:

| Path                                         | Tier      | Contents                                                                                             |
| -------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `css/default.css`                            | semantic  | Default brand — every semantic token (`--ui-*`), `.ui-typography-*`, `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` |
| `css/deep_sky_itkontoret.css`                | semantic  | Non-default brand — only the tokens that differ from `default`                                       |
| `css/<component>/default.css`                | component | Default brand — that component's tokens (`button/`, `tooltip/`, …)                                   |
| `css/<component>/deep_sky_itkontoret.css`    | component | Non-default brand — only the component tokens that differ                                            |
| `tailwind/<brand>/tokens.js`                 | semantic  | Tailwind preset of the shared semantic vocabulary (**baked** values), incl. `gap-*` keys             |
| `tailwind/<brand>/components/<component>.js` | component | One preset per component — opt-in, so its utilities aren't suggested globally                        |
| `dtcg/*.json`                                | —         | The 100%-DTCG intermediate (per-mode), for generic DTCG tooling                                      |

Names use the `--ui-*` convention (the `colors` tier segment is dropped, every
token is prefixed with `ui`): `colors.background.surface.primary` →
`--ui-background-surface-primary`.

## Consume

```css
/* Default brand */
@import '@acronis-platform/tokens-pd/css/default.css';

/* …or a single brand per app: base + override (last import wins) */
@import '@acronis-platform/tokens-pd/css/default.css';
@import '@acronis-platform/tokens-pd/css/deep_sky_itkontoret.css';

/* Component tier is opt-in, per component */
@import '@acronis-platform/tokens-pd/css/button/default.css';
```

Light/dark is built in via `light-dark()` + `color-scheme`; switch with the
`[data-theme]` attribute (`<html data-theme="dark">`). The base (`default`) files
declare the `color-scheme` shell; override files restate only the changed
properties on top.

The Tailwind presets bake resolved values (no dependency on the CSS variables).
They split into a shared semantic `tokens` preset plus one preset per component,
so a component's utilities are only suggested where that component preset is
loaded — not globally:

```css
@import 'tailwindcss';
/* presets: [
     require('@acronis-platform/tokens-pd/tailwind/default/tokens.js'),       // shared vocabulary
     require('@acronis-platform/tokens-pd/tailwind/default/components/button.js'), // opt-in per component
   ] */
@config '../tailwind.config.js';
```

## Build

```sh
pnpm --filter @acronis-platform/tokens-pd build
```

This delegates to `@acronis-platform/style-dictionary` (`pd-css` + `pd-tailwind`,
which run their `pd-dtcg` dependency first). There is no build logic in this
package — it is a published home for the tool's token output.

## Scope

- Colors (incl. `light-dark()` theming and gradients as `linear-gradient(...)`),
  typography utility classes, spacing (margin/padding/gap), and component dimensions.
- Spacing ships three ways, generated directly from the `units.gap` **primitive**
  scale by dedicated build code (not a semantic token — see the tool's
  `context/output.md`): `--ui-gap-*` custom properties, framework-agnostic
  `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` utility classes (plus `.ui-mx-auto`), and `gap-*`
  Tailwind preset keys (e.g. `p-gap-8`, `gap-x-gap-16`) — not brand-dependent, so it
  carries no override-file entries.
- Non-default brands are emitted as **override-only** files: a token appears in
  `deep_sky_itkontoret.css` only when its value differs from `default` or is new in that brand.
