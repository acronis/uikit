---
'@acronis-platform/tokens-pd': patch
'@acronis-platform/ui-react': patch
---

Fix two theming/build bugs:

- `tokens-pd`: dropped the bare `:host { color-scheme: light dark }` declaration
  from generated CSS, keeping it on `:root` unconditionally. The `:host`
  declaration let the browser pick a scheme from the OS preference independent
  of the shadow host's actual `[data-theme]` attribute, fighting shadow-DOM
  theming ([#674](https://github.com/acronis/uikit/issues/674)). An unthemed
  document still follows the OS preference via `:root`; explicit
  `[data-theme='light'|'dark']` rules continue to set `color-scheme` on both
  `:root` and `:host`.
- `ui-react`: the library build now externalizes every bare npm import instead
  of bundling a handful of them (`class-variance-authority`, `date-fns`,
  `tailwind-merge`, `embla-carousel-reactive-utils`, `react-resizable-panels`).
  With `preserveModules: true`, bundling a dependency emitted it under its
  resolved pnpm store path (`node_modules/.pnpm/<pkg>@<version>/...`), which
  doesn't exist in a consumer's install and broke those imports at runtime.
