import type { Table } from '@tanstack/react-table';

import { TableViewOptions, type TableViewOptionsProps } from '../table';

interface DataTableViewOptionsProps<TData> extends Pick<
  TableViewOptionsProps,
  | 'triggerLabel'
  | 'iconOnly'
  | 'triggerAriaLabel'
  | 'searchPlaceholder'
  | 'showAllLabel'
  | 'noResultsLabel'
> {
  table: Table<TData>;
}

// Thin TanStack adapter over the primitive-only `TableViewOptions`: maps
// `table.getAllLeafColumns()` onto the plain `{ id, label, hidden }[]` shape and
// routes `onToggle` back through `column.toggleVisibility()`.
// Leaf (not `getAllColumns()`) because with grouped headers the top level is
// group columns, which have no `accessorFn` and would all be filtered out.
export function DataTableViewOptions<TData>({
  table,
  ...triggerProps
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide()
    )
    .map((column) => ({
      id: column.id,
      label:
        column.columnDef.meta?.label ??
        (typeof column.columnDef.header === 'string'
          ? column.columnDef.header
          : column.id),
      hidden: !column.getIsVisible(),
      category: column.columnDef.meta?.category,
    }));

  return (
    <TableViewOptions
      columns={columns}
      onToggle={(id) => {
        const column = table.getColumn(id);
        column?.toggleVisibility(!column.getIsVisible());
      }}
      {...triggerProps}
    />
  );
}
