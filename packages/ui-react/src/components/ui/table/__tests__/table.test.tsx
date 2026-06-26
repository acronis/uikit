import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

function InvoiceTable() {
  return (
    <Table>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders a table with header, body, caption, and cells', () => {
    render(<InvoiceTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Invoice' })
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'INV001' })).toBeInTheDocument();
    expect(screen.getByText('Recent invoices')).toBeInTheDocument();
  });

  it('themes the cells from the --ui-table-* tier', () => {
    render(<InvoiceTable />);
    expect(screen.getByRole('cell', { name: 'INV001' })).toHaveClass(
      'px-[var(--ui-table-global-cell-padding-x)]'
    );
  });

  it('marks a sortable header with aria-sort and fires onSort on activation', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={false} onSort={onSort}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header).toHaveAttribute('aria-sort', 'none');
    await user.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('reflects the sort direction in aria-sort', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending'
    );
  });

  it('applies the selected (active) row state', () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected data-testid="row">
            <TableCell>Selected</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveAttribute('data-state', 'selected');
    expect(row).toHaveClass(
      'data-[state=selected]:bg-[var(--ui-table-global-row-color-active)]'
    );
  });

  it('forwards the ref to the table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});
