# Theming — `packages/legacy/ui`

The library ships a CSS-variable based theming system. Consumers swap
themes by changing the values of `--av-*` custom properties; no
JavaScript or component-level state is involved at the styling layer.

The choices below (`--av-*` prefix, Tailwind v4, the shipped themes)
are specific to this workspace. A future non-legacy package may pick a
different theming approach entirely — don't apply this file outside
`packages/legacy/ui`.

## CSS variable prefix

All themeable tokens use the `--av-` prefix:

- `--av-primary`, `--av-primary-foreground`
- `--av-background`, `--av-foreground`
- `--av-border`, `--av-ring`
- `--av-accent`, `--av-muted`, `--av-destructive`
- (full list lives in the theme files; see below)

> The `--av-` prefix appears only on **CSS custom properties**. It is
> not used as a BEM class prefix on components. If you see a doc claim
> like `.av-button_variant_primary`, it is from a stale Vue era and is
> incorrect for this React repo.

## Where theme files live

`src/styles/themes/` — each theme is a CSS file that sets the `--av-*`
variables for `:root` (light) and `.dark` (dark mode).

The base styles file (also under `src/styles/`) is what consumers import
via `@acronis-platform/shadcn-uikit/styles`.

## Tailwind v4

This workspace is on **Tailwind v4** (not v3). Notable consequences:

- `tailwind.config.ts` is still used for content paths and a few
  extensions, but the theming primitives are driven from CSS via
  `@theme` / CSS variables rather than the v3 `theme: { ... }` JS config.
- `@tailwindcss/postcss` is the PostCSS plugin (catalog: `4.2.2`).
- `tw-animate-css` provides the animation utilities (replaces the v3
  `tailwindcss-animate` plugin).

## How a consumer uses themes

```ts
// In a consuming app
import '@acronis-platform/shadcn-uikit/styles';
```

Then toggle a CSS class (`light` / `dark` / a custom theme name) on a
parent element — the cascading variable values do the rest. The library
uses `next-themes` (catalog-pinned) in the demo and docs sites.

## Adding a new themeable token

1. Add the variable to the base/light theme file with a sensible default.
2. Override it in the dark theme file.
3. Reference it from the component's Tailwind classes via the arbitrary
   value syntax — e.g. `bg-[var(--av-primary)]` — or via the configured
   Tailwind theme extension if one exists for that token.
4. Add or update a Storybook story that exercises the token under both
   themes.
