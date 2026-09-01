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
  column resizing, drag-to-reorder columns, or a few columns pinned while the
  rest scroll horizontally.

## When not to use

- A simple static table — use the `Table` primitives directly.
- A key/value list or cards layout — a table is the wrong shape.
- Grouped/aggregated rows — **not available yet** (deferred to a future
  revision); do not rely on them. (Drag-to-reorder columns _is_ supported now,
  via `enableColumnReordering`.)

## Parts

| Export                    | Purpose                                                                                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DataTable`               | The grid. Owns table state by default (`columns` / `data`), or renders a caller-built `table` instance. Supports resizing, pinned columns, server-driven sorting/pagination, and custom row/empty-state rendering.                        |
| `DataTableColumnHeader`   | A sortable column header — single-click toggle (↑/↓/↕). Use in a column's `header`.                                                                                                                                                       |
| `DataTableToolbar`        | Search box + per-column filters + applied-filter chips. Takes a `table` instance.                                                                                                                                                         |
| `DataTablePagination`     | Selection count, rows-per-page, page controls. Takes a `table`.                                                                                                                                                                           |
| `DataTableViewOptions`    | Column-visibility menu (a thin TanStack adapter over the `TableViewOptions` primitive). Pass `iconOnly` for the cog trigger that belongs in the trailing settings column.                                                                 |
| `DataTableExpandTrigger`  | A chevron toggle wired to a row's expansion state, placed inside a column's `cell` render function.                                                                                                                                       |
| `DataTableBulkActionsBar` | A selection-aware bar above the grid: the consumer's bulk actions in a `<fieldset>` disabled until a selection is active, plus the selection summary and a Deselect control (or `loadedLabel` when nothing is selected). Takes a `table`. |
| `isBulkSelectionActive`   | The single predicate for the bulk-selection threshold (one or more rows selected). Pass it to `TableActionsCell`'s `bulkSelectionActive` rather than re-deriving it.                                                                      |

`DataTable` manages its own table state by default. The companion parts
operate on a TanStack `table` instance you build with `useReactTable` — render
them around a `DataTable` (or your own `<Table>`), passing the same instance.
Pass that same instance to `DataTable`'s own `table` prop to have it render
from it too (see **Server-driven usage** below).

The TanStack types these props reference are re-exported from
`@acronis-platform/ui-react`, so a consumer never needs a direct
`@tanstack/react-table` import to type them: `Column`, `ColumnDef`, `Row`,
`OnChangeFn`, `TanstackTable` (TanStack's `Table`, aliased to avoid clashing
with the `Table` primitive), and the `SortingState` / `VisibilityState` /
`RowSelectionState` / `ColumnOrderState` / `ColumnSizingState` state types.
`DataTableColumnHeaderProps` is exported alongside them, so a wrapper around
`DataTableColumnHeader` can type its own props.

## Server-driven usage

- **External `table`** — pass an externally-built TanStack `table` instance
  via the `table` prop and DataTable renders from it as-is, owning no state of
  its own. Use this to share one instance across `DataTable` and its companion
  parts, or when the caller needs full control (e.g. a table already wired to
  a URL/query-state hook). Several props become no-ops when `table` is passed
  — see `table`'s own description in `api.yaml`.
- **Manual sorting** — set `manualSorting` and drive `sorting` /
  `onSortingChange` yourself; DataTable skips its own comparator so already
  server-sorted `data` isn't re-sorted client-side.
- **Infinite scroll** — set `paginationMode="infinite"` and pass the full
  accumulated `data`, `hasNextPage`, `isLoadingMore`, and an `onLoadMore`
  callback. DataTable renders a sentinel row that calls `onLoadMore` once it
  scrolls into view, and a trailing loading row while `isLoadingMore` is true.
  The sentinel needs at least one row already rendered — it can't drive an
  empty table's very first fetch, so seed the first page yourself (e.g. on
  mount). Pass `loadMoreRootMargin` (e.g. `'400px'`) to fire `onLoadMore`
  before the sentinel is literally visible, so the fetch has a head start on
  the user's scroll — tune it relative to your page size, since a large
  margin with small pages can trigger several `onLoadMore` calls back-to-back
  as the user scrolls normally. Does not compose with virtualization — for a
  very large accumulated list, virtualize the raw `Table` primitives yourself
  (e.g. `useVirtualizer` from `@tanstack/react-virtual`) instead.
- **Custom rows** — `renderRow` swaps in a fully custom row, bypassing
  DataTable's per-cell `flexRender` path (and, as a result, its own row
  expansion — a row rendered via `renderRow` must implement any expanded
  content itself). `renderEmptyState` swaps in a custom "no data" row,
  receiving `hasFilters` so the caller can distinguish "no data at all" from
  "no matches".

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
import {
  DataTable,
  DataTableColumnHeader,
  type ColumnDef,
} from '@acronis-platform/ui-react';

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
