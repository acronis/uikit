---
'@acronis-platform/ui-react': minor
---

`DataTable`: add `getRowId` to derive a stable row id from the row data, instead of the default array index. Needed whenever `data` can reorder (sort/filter) while a row's own per-row state (selection, a hook keyed by row) should follow the row instead of resetting to whatever now occupies its old slot. A no-op when an external `table` is passed — set `getRowId` on that `useReactTable` instance directly. Also documents that `rowSelection`/`onRowSelectionChange` were already no-ops in that case, which the `table` prop's own doc previously omitted.
