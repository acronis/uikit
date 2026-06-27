# DataTable

A data grid built on TanStack react-table v8, composed over the Table
primitives — sorting, filtering, column visibility, row selection, pagination,
and optional row expansion.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `data-table`. Adds no color of its own — it
> composes already-themed ui-react components. Reconcile with
> `/figma-component DataTable <url> --update` once a mockup lands.

## When to use

- Tabular data that needs interaction — sorting, filtering, selection, paging.

## When not to use

- A simple static table — use the `Table` primitives directly.
- A key/value list or cards layout — a table is the wrong shape.

## Parts

| Export                  | Purpose                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `DataTable`             | The grid. Owns table state; takes `columns` / `data`.                               |
| `DataTableColumnHeader` | A sortable column header — single-click toggle (↑/↓/↕). Use in a column's `header`. |
| `DataTableToolbar`      | Search box + Reset + view options. Takes a `table` instance.                        |
| `DataTablePagination`   | Selection count, rows-per-page, page controls. Takes a `table`.                     |
| `DataTableViewOptions`  | Column-visibility menu. Takes a `table`.                                            |

`DataTable` manages its own table state. The companion parts operate on a
TanStack `table` instance you build with `useReactTable` — render them around a
`DataTable` (or your own `<Table>`), passing the same instance.

## Example

```tsx
import { DataTable, DataTableColumnHeader } from '@acronis-platform/ui-react';
import type { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  { accessorKey: 'amount', header: 'Amount' },
];

<DataTable columns={columns} data={payments} />;
```

For a toolbar + pagination, build a `table` with `useReactTable` and pass it to
`DataTableToolbar` / `DataTablePagination` alongside the grid.
