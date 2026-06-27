---
'@acronis-platform/ui-react': minor
---

feat(data-table): single-click column sorting

`DataTableColumnHeader` now sorts in a single click. The dropdown menu
(Asc / Desc / Hide) is replaced by a toggle button whose trailing arrow shows the
sort state — an up or down arrow in the brand blue when sorted, a muted up/down
arrow when unsorted — matching the `Table` primitive's sortable header. Column
hiding remains available via the toolbar's `DataTableViewOptions` menu.
