import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../checkbox';
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

  it('puts the pointer cursor on the sort button, not just the header cell', () => {
    // Native <button> elements get the browser's default (arrow) cursor, not
    // pointer — setting cursor-pointer on an ancestor <th> doesn't override
    // that. The clickable target itself must carry the class.
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={false}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('button', { name: /Name/ })).toHaveClass(
      'cursor-pointer'
    );
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

  it('keeps the fixed row height and single line by default on a cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="cell">value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveClass('h-10');
    expect(cell).not.toHaveClass('whitespace-normal');
  });

  it('drops the fixed height and wraps when a cell sets wrap', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell wrap data-testid="cell">
              long value
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveClass('whitespace-normal');
    expect(cell).not.toHaveClass('h-10');
  });

  it('wraps a header when TableHead sets wrap', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead wrap>Very long header label</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: /Very long/ });
    expect(header).toHaveClass('whitespace-normal');
    expect(header).not.toHaveClass('h-10');
  });

  it('drives a tri-state header checkbox across none/some/all row selection', async () => {
    const user = userEvent.setup();
    function SelectableTable() {
      const rows = ['a', 'b'];
      const [selected, setSelected] = useState<Record<string, boolean>>({});
      const count = rows.filter((row) => selected[row]).length;
      const all = count === rows.length;
      const some = count > 0 && !all;
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  aria-label="Select all"
                  checked={all}
                  indeterminate={some}
                  onCheckedChange={() =>
                    setSelected(
                      all
                        ? {}
                        : Object.fromEntries(rows.map((row) => [row, true]))
                    )
                  }
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${row}`}
                    checked={!!selected[row]}
                    onCheckedChange={(value) =>
                      setSelected((previous) => ({ ...previous, [row]: !!value }))
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    render(<SelectableTable />);
    const selectAll = screen.getByLabelText('Select all');

    // None selected → unchecked (not indeterminate).
    expect(selectAll).toHaveAttribute('aria-checked', 'false');

    // Some selected → indeterminate (mixed).
    await user.click(screen.getByLabelText('Select a'));
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');

    // All selected → checked.
    await user.click(screen.getByLabelText('Select b'));
    expect(selectAll).toHaveAttribute('aria-checked', 'true');

    // Toggling the header unchecks every row.
    await user.click(selectAll);
    expect(selectAll).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByLabelText('Select a')).toHaveAttribute(
      'aria-checked',
      'false'
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
