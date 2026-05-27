import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../data-table';

type RowData = {
  id: string;
  name: string;
  details: string;
};

const rows: RowData[] = [
  { id: 'r1', name: 'Tom', details: 'Tom details' },
  { id: 'r2', name: 'Jane', details: 'Jane details' },
];

const expandableColumns: ColumnDef<RowData>[] = [
  {
    id: 'expand',
    header: () => null,
    cell: ({ row }) => (
      <button
        type="button"
        aria-label={`toggle-${row.original.id}`}
        onClick={row.getToggleExpandedHandler()}
      >
        {row.getIsExpanded() ? '−' : '+'}
      </button>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

describe('DataTable', () => {
  it('renders expandable rows and toggles expanded content', async () => {
    render(
      <DataTable
        columns={expandableColumns}
        data={rows}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <div>{row.original.details}</div>}
      />
    );

    expect(screen.queryByText('Tom details')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'toggle-r1' }));
    expect(screen.getByText('Tom details')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'toggle-r1' }));
    expect(screen.queryByText('Tom details')).not.toBeInTheDocument();
  });
});
