# @acronis-platform/tokens-pd

The Acronis platform (**PD**) design tokens, as ready-to-consume artifacts
generated from [`@acronis-platform/design-tokens`](../design-tokens) (the raw
DTCG token data) by the
[`@acronis-platform/style-dictionary`](../../tools/style-dictionary) build tool.

The raw tokens are a Figma-exported, multi-dimensional DTCG variant that no app
can use directly — primitives carry per-scheme (`light`/`dark`) values and
semantic/component tokens carry per-brand (`acronis`/`brand-b`) aliases back into
the primitives. This package ships the resolved output. **The generated files are
committed** (and published); do not edit them by hand — change the upstream tokens
and rebuild.

## Layout

Output is grouped into three top-level directories — `css/`, `tailwind/`, `dtcg/`:

| Path                                         | Tier      | Contents                                                                      |
| -------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| `css/acronis.css`                            | semantic  | Default brand — every semantic token (`--ui-*`) + `.ui-typography-*`          |
| `css/brand-b.css`                            | semantic  | Non-default brand — only the tokens that differ from `acronis`                |
| `css/<component>/acronis.css`                | component | Default brand — that component's tokens (`button/`, `tooltip/`, …)            |
| `css/<component>/brand-b.css`                | component | Non-default brand — only the component tokens that differ                     |
| `tailwind/<brand>/tokens.js`                 | semantic  | Tailwind preset of the shared semantic vocabulary (**baked** values)          |
| `tailwind/<brand>/components/<component>.js` | component | One preset per component — opt-in, so its utilities aren't suggested globally |
| `dtcg/*.json`                                | —         | The 100%-DTCG intermediate (per-mode), for generic DTCG tooling               |

Names use the `--ui-*` convention (the `colors` tier segment is dropped, every
token is prefixed with `ui`): `colors.background.surface.primary` →
`--ui-background-surface-primary`.

## Consume

```css
/* Default brand */
@import '@acronis-platform/tokens-pd/css/acronis.css';

/* …or a single brand per app: base + override (last import wins) */
@import '@acronis-platform/tokens-pd/css/acronis.css';
@import '@acronis-platform/tokens-pd/css/brand-b.css';

/* Component tier is opt-in, per component */
@import '@acronis-platform/tokens-pd/css/button/acronis.css';
```

Light/dark is built in via `light-dark()` + `color-scheme`; switch with the
`[data-theme]` attribute (`<html data-theme="dark">`). The base (`acronis`) files
declare the `color-scheme` shell; override files restate only the changed
properties on top.

The Tailwind presets bake resolved values (no dependency on the CSS variables).
They split into a shared semantic `tokens` preset plus one preset per component,
so a component's utilities are only suggested where that component preset is
loaded — not globally:

```css
@import 'tailwindcss';
/* presets: [
     require('@acronis-platform/tokens-pd/tailwind/acronis/tokens.js'),       // shared vocabulary
     require('@acronis-platform/tokens-pd/tailwind/acronis/components/button.js'), // opt-in per component
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
  typography utility classes, and component dimensions.
- Non-default brands are emitted as **override-only** files: a token appears in
  `brand-b.css` only when its value differs from `acronis` or is new in `brand-b`.
