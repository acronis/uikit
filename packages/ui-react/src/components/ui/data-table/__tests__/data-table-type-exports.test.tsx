import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  type Column,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnSizingState,
  DataTable,
  DataTableColumnHeader,
  type DataTableColumnHeaderProps,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TanstackTable,
  type VisibilityState,
} from '@/index';
import { type ColumnDef as ColumnDefFromReactEntry } from '@/react';

// GitHub #602: DataTable's own public props are typed with @tanstack/react-table
// types, so those types must be reachable from the package entry point — this
// file fails to compile (`pnpm typecheck`) if a re-export regresses.
interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person>[] = [{ accessorKey: 'name', header: 'Name' }];

const data: Person[] = [{ id: '1', name: 'Ada' }];

// A consumer wrapper around DataTableColumnHeader — needs both the component's
// own prop type and TanStack's `Column` to type the column it forwards.
function SortableHeader({
  column,
  title,
}: Pick<DataTableColumnHeaderProps<Person, unknown>, 'column' | 'title'>) {
  const typedColumn: Column<Person, unknown> = column;

  return <DataTableColumnHeader column={typedColumn} title={title} />;
}

describe('DataTable type re-exports', () => {
  it('types DataTable props with types imported from the package entry point', () => {
    const sorting: SortingState = [{ id: 'name', desc: false }];
    const columnOrder: ColumnOrderState = ['name'];
    const columnVisibility: VisibilityState = { name: true };
    const rowSelection: RowSelectionState = {};
    const onSortingChange: OnChangeFn<SortingState> = () => {};
    const onColumnSizingChange: OnChangeFn<ColumnSizingState> = () => {};
    const getRowCanExpand = (row: Row<Person>) => row.original.id === '1';

    render(
      <DataTable
        columns={columns}
        data={data}
        sorting={sorting}
        onSortingChange={onSortingChange}
        onColumnSizingChange={onColumnSizingChange}
        columnOrder={columnOrder}
        columnVisibility={columnVisibility}
        rowSelection={rowSelection}
        getRowCanExpand={getRowCanExpand}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('exposes the TanStack table instance type for externally-built instances', () => {
    const countRows = (table: TanstackTable<Person>) =>
      table.getRowModel().rows.length;

    expect(typeof countRows).toBe('function');
  });

  it('types a consumer wrapper around DataTableColumnHeader', () => {
    const sortableColumns: ColumnDef<Person>[] = [
      {
        accessorKey: 'name',
        enableSorting: true,
        header: ({ column }) => <SortableHeader column={column} title="Name" />,
      },
    ];

    render(<DataTable columns={sortableColumns} data={data} />);

    expect(
      screen.getByRole('button', { name: 'Sort by Name' })
    ).toBeInTheDocument();
  });

  it('exposes the same types from the ./react entry point', () => {
    const reactEntryColumns: ColumnDefFromReactEntry<Person>[] = columns;

    expect(reactEntryColumns).toHaveLength(1);
  });
});
