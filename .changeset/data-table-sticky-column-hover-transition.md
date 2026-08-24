---
'@acronis-platform/ui-react': patch
---

Fix `DataTable`'s pinned/sticky columns: the leading selection (checkbox)
column's row-hover background now fades in sync with the row, matching the
trailing pinned actions column, instead of snapping in abruptly. Adds
`transition-colors` to the `TableCell` primitive — used by every table cell,
not just the pinned selection column — and to the `TableSelectCell` primitive
used by standalone `Table` compositions (`DataTable` itself never renders
`TableSelectCell`).
