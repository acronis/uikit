---
'@acronis-platform/ui-react': patch
---

Storybook dev experience: add brand (acronis / deep-sky), light/dark,
direction (auto / ltr / rtl), and locale toolbars driven by the tokens-pd
delivery model (`[data-theme]` + `color-scheme` for dark mode, injected
override CSS for brand), enrich every hand-authored story's `argTypes` with
full controls + descriptions, and add a demo-only i18n message catalog so the
locale toolbar can render localized (and RTL) sample content. Also adds the
conventional `vite/client` type reference the package was missing. No change to
the published component API.
