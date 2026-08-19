---
'@acronis-platform/ui-react': minor
---

`DataTableBulkActionsBar` / `TableActionsCell`: move the row-actions ↔ bulk-actions switch point into the components.

The threshold is now a single shipped predicate, `isBulkSelectionActive(table)` — **one or more rows selected**, including exactly one. It was previously left to each consumer to re-derive.

- `DataTableBulkActionsBar` is **always mounted** — it doesn't appear and disappear with the selection. It switches between two states on the predicate: with nothing selected its actions are disabled (a native `<fieldset disabled>`) and the trailing side shows the new `loadedLabel` (e.g. `"25 of 1250 items loaded"`); from the first selected row on, the actions enable and the trailing side shows the selection summary plus **Deselect**.
- `TableActionsCell` takes a `bulkSelectionActive` prop: it keeps its 48px column (no grid reflow) but renders no children and no hover/press tint. Consumers no longer swap in a blank `TableCell` themselves.

The 32px checkbox column (`TableSelectCell`) is untouched.

`DataTable` also gains controlled `rowSelection` / `onRowSelectionChange` props (uncontrolled internal state when omitted), the mechanism for lifting selection out to a separately-mounted `DataTableBulkActionsBar`'s own `useReactTable` instance.
