import { Fragment, type ReactNode, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

// Ported from `@acronis-platform/shadcn-uikit`'s `data-table`
// (packages/ui-legacy/src/components/ui/data-table/). A TanStack-react-table v8
// data grid composed over the ui-react Table primitives — sorting, filtering,
// column visibility, row selection, pagination, and optional row expansion. The
// presentational flags (`striped`, `bordered`, `skeleton`, `highlightCurrentRow`)
// are borrowed from the Vue `AvTable`; behavioral features come from TanStack.
// Pair with DataTableToolbar / DataTablePagination / DataTableColumnHeader, which
// take the `table` instance returned to column cells via TanStack context.
// The grid cells/rows/headers are themed by the Table primitives' `--ui-table-*`
// tier; DataTable's own chrome reuses that tier too — the wrapper border matches
// the cell borders (`--ui-table-global-cell-border-color`), the empty-state uses
// the muted table-value color, the current row the active-row color, and stripes
// the secondary surface.

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Enables row expansion for rows that return true. Pair with `renderExpandedRow`. */
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /**
   * Renders expanded content for an expanded row. Used together with
   * `getRowCanExpand`.
   */
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
  /** Alternating row backgrounds. */
  striped?: boolean;
  /** Vertical borders between columns (rows already have horizontal borders). */
  bordered?: boolean;
  /** Highlight the row the user last clicked (the "current" row). */
  highlightCurrentRow?: boolean;
  /** Render placeholder skeleton rows instead of data (loading state). */
  skeleton?: boolean;
  /** Number of skeleton rows to render when `skeleton` is set. */
  skeletonRows?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowCanExpand,
  renderExpandedRow,
  striped = false,
  bordered = false,
  highlightCurrentRow = false,
  skeleton = false,
  skeletonRows = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [currentRowId, setCurrentRowId] = useState<string>();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection, expanded },
  });

  const rows = table.getRowModel().rows;
  // Vertical borders are opt-in; a trailing border on the last cell would
  // double up with the wrapper, so suppress it.
  const borderedClass = bordered
    ? '[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r [&_th]:border-[var(--ui-table-global-cell-border-color)] [&_td]:border-[var(--ui-table-global-cell-border-color)]'
    : undefined;

  return (
    <div
      className={cn(
        'rounded-md border border-[var(--ui-table-global-cell-border-color)]',
        borderedClass
      )}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {skeleton ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <div className="h-4 w-full animate-pulse rounded bg-[var(--ui-background-surface-secondary)]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows?.length ? (
            rows.map((row, rowIndex) => {
              const isSelected = row.getIsSelected();
              const isCurrent = highlightCurrentRow && currentRowId === row.id;
              return (
                <Fragment key={row.id}>
                  <TableRow
                    selected={isSelected}
                    onClick={
                      highlightCurrentRow
                        ? () => setCurrentRowId(row.id)
                        : undefined
                    }
                    className={cn(
                      highlightCurrentRow && 'cursor-pointer',
                      striped &&
                        rowIndex % 2 === 1 &&
                        !isSelected &&
                        !isCurrent &&
                        'bg-[var(--ui-background-surface-secondary)]',
                      isCurrent &&
                        !isSelected &&
                        'bg-[var(--ui-table-global-row-color-active)]'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderExpandedRow && row.getIsExpanded() && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        className="h-auto py-3"
                        colSpan={row.getVisibleCells().length}
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-[var(--ui-table-data-value-color-disabled)]"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
