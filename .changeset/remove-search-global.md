---
'@acronis-platform/ui-react': major
---

Remove the `SearchGlobal` component — it is no longer part of the design system.

### BREAKING CHANGES

- **Removed export:** `SearchGlobal` (and `SearchGlobalProps`). The component's
  `--ui-search-global-*` token tier is being dropped from
  `@acronis-platform/design-tokens`, so the component can no longer be themed.
  Consumers rendering a search field should use `InputSearch` (aliased as
  `Search`), which has its own `--ui-input-search-*` tier.

`AppShell` is unaffected — it is a slot-based layout and never depended on
`SearchGlobal`; only its story and the docs examples referenced it.
