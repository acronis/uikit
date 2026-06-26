---
'@acronis-platform/ui-react': minor
---

feat(data-table): add DataTable (TanStack data grid)

A data grid built on TanStack react-table v8, composed over the Table primitives —
sorting, filtering, column visibility, row selection, pagination, and optional row
expansion. Ported from the legacy library. Exports `DataTable` plus the companion
parts `DataTableColumnHeader`, `DataTableToolbar`, `DataTablePagination`, and
`DataTableViewOptions` (which operate on a TanStack `table` instance). Adds
`@tanstack/react-table` as a dependency. Design-pending v1: it reuses the Table
component's `--ui-table-*` tokens (the wrapper border matches the cell borders)
and composes the already-themed Button / ButtonIcon / Checkbox / DropdownMenu /
InputSelect / InputText components.
