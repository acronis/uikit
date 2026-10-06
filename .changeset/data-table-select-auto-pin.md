---
'@acronis-platform/ui-react': minor
---

feat(data-table): `select` column is now always pinned to the left.

When a column with `id: 'select'` is present, DataTable auto-pins it to the left — matching the `__actions` column's unconditional right pin. `meta.pin` on the `select` column is silently ignored.

The first non-select data column's start padding is also stripped to prevent double spacing between the checkbox and the adjacent cell.

Note: `select` and `__actions` are reserved column ids managed by DataTable. Setting `meta.pin` on them has no effect.
