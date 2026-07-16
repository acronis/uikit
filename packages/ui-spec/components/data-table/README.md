# DataTable

A data grid built on TanStack react-table v8, composed over the Table
primitives — sorting, filtering, column visibility, row selection, pagination,
optional row expansion, column resizing, and sticky (pinned) columns.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `data-table`. Adds no color of its own — it
> composes already-themed ui-react components. Reconcile with
> `/figma-component DataTable <url> --update` once a mockup lands.

## When to use

- Tabular data that needs interaction — sorting, filtering, selection, paging,
  column resizing, or a few columns pinned while the rest scroll horizontally.

## When not to use

- A simple static table — use the `Table` primitives directly.
- A key/value list or cards layout — a table is the wrong shape.
- Drag-to-reorder columns or grouped/aggregated rows — **not available yet**
  (deferred to a future revision); do not rely on them.

## Parts

| Export                   | Purpose                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `DataTable`              | The grid. Owns table state; takes `columns` / `data`. Supports resizing + pinned columns.           |
| `DataTableColumnHeader`  | A sortable column header — single-click toggle (↑/↓/↕). Use in a column's `header`.                 |
| `DataTableToolbar`       | Search box + per-column filters + applied-filter chips + view options. Takes a `table` instance.    |
| `DataTablePagination`    | Selection count, rows-per-page, page controls. Takes a `table`.                                     |
| `DataTableViewOptions`   | Column-visibility menu (a thin TanStack adapter over the `TableViewOptions` primitive).             |
| `DataTableExpandTrigger` | A chevron toggle wired to a row's expansion state, placed inside a column's `cell` render function. |

`DataTable` manages its own table state. The companion parts operate on a
TanStack `table` instance you build with `useReactTable` — render them around a
`DataTable` (or your own `<Table>`), passing the same instance.

## Advanced columns

- **Column resizing** — set `enableColumnResizing` on `DataTable` to render a
  drag handle at the trailing edge of each resizable header (TanStack's native
  `columnResizing`). Pass `onColumnSizingChange` to persist widths.
- **Sticky (pinned) columns** — set `meta.pin: 'left' | 'right'` on a
  `ColumnDef`. DataTable drives TanStack's native column-pinning and renders the
  column as `position: sticky` cells with an opaque row background.
- **Wrapping columns** — set `meta.wrap: true` on a `ColumnDef` to let that
  column's header and cell content wrap onto multiple lines instead of
  truncating, mirroring the `Table` primitives' `wrap` prop.
- **Expandable column** — put a `DataTableExpandTrigger` in a column's `cell`
  render function so the expand affordance sits in a real column instead of a
  whole-row click. It reads `row.getCanExpand()` / `getIsExpanded()` and calls
  `row.toggleExpanded()`; the row-level `getRowCanExpand` / `renderExpandedRow`
  contract is unchanged.
- **Per-column filtering** — pass filter fields as `children` to
  `DataTableToolbar`. They render inside a `FilterSearchFilters` popover (wire
  each field via `useFilterSearchFilters()` keyed by column id), and the toolbar
  renders a `FilterSearchAppliedFilters` chip row below itself. `filtersLabel`
  and `getFilterChipLabel` customize the trigger and chip labels.

## Example

```tsx
import { DataTable, DataTableColumnHeader } from '@acronis-platform/ui-react';
import type { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: { pin: 'left' }, // sticky column
  },
  { accessorKey: 'amount', header: 'Amount' },
];

// Resizable, with the first column pinned left
<DataTable columns={columns} data={payments} enableColumnResizing />;
```

For a toolbar + pagination, build a `table` with `useReactTable` and pass it to
`DataTableToolbar` / `DataTablePagination` alongside the grid; pass filter fields
as `children` of the toolbar for per-column filtering.
