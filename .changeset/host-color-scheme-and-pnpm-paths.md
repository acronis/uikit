---
'@acronis-platform/tokens-pd': patch
'@acronis-platform/ui-react': patch
---

Fix two theming/build bugs:

- `tokens-pd`: dropped the bare `:host { color-scheme: light dark }` declaration
  from generated CSS. It let the browser pick a scheme from the OS preference
  independent of the shadow host's actual `[data-theme]` attribute, fighting
  shadow-DOM theming. `color-scheme` is now only set by the explicit
  `[data-theme='light'|'dark']` rules.
- `ui-react`: the library build now externalizes every bare npm import instead
  of bundling a handful of them (`class-variance-authority`, `date-fns`,
  `tailwind-merge`, `embla-carousel-reactive-utils`, `react-resizable-panels`).
  With `preserveModules: true`, bundling a dependency emitted it under its
  resolved pnpm store path (`node_modules/.pnpm/<pkg>@<version>/...`), which
  doesn't exist in a consumer's install and broke those imports at runtime.
