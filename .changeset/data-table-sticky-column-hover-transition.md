---
'@acronis-platform/ui-react': patch
---

Fix `DataTable`'s pinned/sticky columns: the leading selection (checkbox)
column's row-hover background now fades in sync with the row, matching the
trailing pinned actions column, instead of snapping in abruptly. Adds
`transition-colors` to the `TableCell` and `TableSelectCell` primitives.
