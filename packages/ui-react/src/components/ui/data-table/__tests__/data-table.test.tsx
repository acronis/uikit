import { useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from '../index';

type Row = { id: string; email: string; amount: number };

const data: Row[] = Array.from({ length: 12 }, (_, i) => ({
  id: `r${i + 1}`,
  email: `user${i + 1}@example.com`,
  amount: (i + 1) * 100,
}));

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

describe('DataTable', () => {
  it('renders the column headers and rows', () => {
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
  });

  it('shows an empty state with no data', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('renders expanded content for an expanded row', async () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          >
            {row.getIsExpanded() ? '-' : '+'}
          </button>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <span>Details for {row.original.id}</span>}
      />
    );
    expect(screen.queryByText('Details for r1')).not.toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Expand row' })[0]);
    expect(screen.getByText('Details for r1')).toBeInTheDocument();
  });
});

describe('DataTable presentational features', () => {
  it('stripes alternating rows', () => {
    render(<DataTable columns={columns} data={data.slice(0, 4)} striped />);
    const secondRow = screen.getByText('user2@example.com').closest('tr')!;
    const firstRow = screen.getByText('user1@example.com').closest('tr')!;
    expect(secondRow.className).toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
    expect(firstRow.className).not.toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
  });

  it('adds vertical borders when bordered', () => {
    const { container } = render(
      <DataTable columns={columns} data={data.slice(0, 2)} bordered />
    );
    const wrapper = container.querySelector('div.rounded-md') as HTMLElement;
    expect(wrapper.className).toContain('[&_td:not(:last-child)]:border-r');
  });

  it('renders skeleton placeholder rows instead of data', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} skeleton skeletonRows={3} />
    );
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    // 3 rows × 2 columns of pulse bars
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });

  it('highlights the clicked row when highlightCurrentRow', async () => {
    render(
      <DataTable columns={columns} data={data.slice(0, 3)} highlightCurrentRow />
    );
    const row = screen.getByText('user2@example.com').closest('tr')!;
    // Exact class token — the primitive carries `active:bg-[…row-color-active]`
    // for its pressed pseudo-state, so a substring check would collide.
    const current = 'bg-[var(--ui-table-global-row-color-active)]';
    const classes = (el: HTMLElement) => el.className.split(/\s+/);
    expect(classes(row)).not.toContain(current);
    await userEvent.click(row);
    expect(classes(row)).toContain(current);
  });
});

function Harness() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    state: { columnFilters },
  });
  return (
    <div>
      <DataTableToolbar table={table} searchKey="email" searchPlaceholder="Filter emails…" />
      <div data-testid="page-rows">
        {table.getRowModel().rows.map((r) => (
          <span key={r.id}>{r.original.email}</span>
        ))}
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

describe('DataTableToolbar + DataTablePagination', () => {
  it('filters rows via the search box', async () => {
    render(<Harness />);
    const search = screen.getByPlaceholderText('Filter emails…');
    await userEvent.type(search, 'user11');
    const rows = within(screen.getByTestId('page-rows'));
    expect(rows.getByText('user11@example.com')).toBeInTheDocument();
    expect(rows.queryByText('user1@example.com')).not.toBeInTheDocument();
  });

  it('paginates to the next page', async () => {
    render(<Harness />);
    const rows = () => within(screen.getByTestId('page-rows'));
    expect(rows().getByText('user1@example.com')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(rows().queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(rows().getByText('user6@example.com')).toBeInTheDocument();
  });
});
