---
'@acronis-platform/ui-react': minor
---

feat(data-table): `enableSorting` prop to disable column sorting globally.

- New `enableSorting?: boolean` prop (default `true`). Set to `false` to hide sort buttons and the "Sort column" tooltip hint on all header cells. Individual columns can still opt out via `enableSorting: false` on their `ColumnDef`. No-op when an external `table` instance is passed.
