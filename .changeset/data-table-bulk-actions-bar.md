---
'@acronis-platform/ui-react': minor
---

`DataTableBulkActionsBar`: new selection-aware bulk-actions bar for `DataTable` — a thin TanStack adapter that renders the selected-row count (`table.getSelectedRowModel()`), a Deselect control wired to `table.resetRowSelection()`, and the consumer's bulk actions as `children`.

It is a separate part rather than an extension of `DataTableToolbar`, and it is **always mounted** rather than swapped in for the toolbar — see `isBulkSelectionActive` below for its two-state behavior. Drive it off its own minimal `useReactTable` instance (just the columns needed for selection) and share state with the grid via `DataTable`'s new `rowSelection` / `onRowSelectionChange` props, so both read one lifted selection state without requiring a single shared `table` instance. Both labels are localizable (`selectedLabel`, `clearLabel`).

The approved composition is captured in the `data-table-bulk-actions` usage pattern (now `ready`), and demonstrated by the `CoreCapabilities` / `CoreCapabilitiesWithPagination` stories under `UI/DataTable`.
