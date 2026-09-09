---
'@acronis-platform/ui-react': minor
---

DataTable now re-exports the `@tanstack/react-table` types (`Column`, `ColumnDef`, `Row`, `Table` — as `TanstackTable` — `OnChangeFn`, and the `ColumnOrderState` / `ColumnSizingState` / `VisibilityState` / `RowSelectionState` / `SortingState` state types) it already requires consumers to reference in its own props, so they no longer need a direct import from `@tanstack/react-table`. `DataTableColumnHeaderProps` is exported too, so a wrapper around `DataTableColumnHeader` can be typed from the package entry point alone.
