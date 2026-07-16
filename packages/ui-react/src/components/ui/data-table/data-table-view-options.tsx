import type { Table } from '@tanstack/react-table';

import { TableViewOptions } from '../table';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

// Thin TanStack adapter over the primitive-only `TableViewOptions`: maps
// `table.getAllColumns()` onto the plain `{ id, label, hidden }[]` shape and
// routes `onToggle` back through `column.toggleVisibility()`.
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide()
    )
    .map((column) => ({
      id: column.id,
      label: column.id,
      hidden: !column.getIsVisible(),
    }));

  return (
    <TableViewOptions
      columns={columns}
      onToggle={(id) => {
        const column = table.getColumn(id);
        column?.toggleVisibility(!column.getIsVisible());
      }}
    />
  );
}
