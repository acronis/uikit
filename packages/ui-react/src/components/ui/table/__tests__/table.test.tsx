import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../checkbox';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectCell,
  TableSettingsCell,
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
      'data-[state=selected]:bg-[var(--ui-table-data-row-color-active)]'
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
    expect(cell).toHaveClass('h-[var(--ui-table-global-cell-min-height)]');
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
    expect(cell).not.toHaveClass('h-[var(--ui-table-global-cell-min-height)]');
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
    expect(header).not.toHaveClass('h-[var(--ui-table-global-cell-min-height)]');
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

describe('Table structural cells', () => {
  it('renders the selection cell as a td by default and a th in the header', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableSelectCell header data-testid="select-head">
              <Checkbox aria-label="Select all" />
            </TableSelectCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableSelectCell data-testid="select-cell">
              <Checkbox aria-label="Select row" />
            </TableSelectCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId('select-head').tagName).toBe('TH');
    expect(screen.getByTestId('select-cell').tagName).toBe('TD');
    expect(screen.getByLabelText('Select all')).toBeInTheDocument();
    expect(screen.getByLabelText('Select row')).toBeInTheDocument();
  });

  it('pads the selection cell only at the inline start so it stays RTL-safe', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableSelectCell data-testid="select-cell" />
          </TableRow>
        </TableBody>
      </Table>
    );

    const cell = screen.getByTestId('select-cell');
    expect(cell).toHaveClass('ps-[var(--ui-table-global-cell-padding-x)]');
    expect(cell.className).not.toMatch(/\b(pl-|pr-)/);
  });

  it('wires the actions cell to the data-cell interaction tokens', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableActionsCell data-testid="actions">
              <button type="button">More</button>
            </TableActionsCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const cell = screen.getByTestId('actions');
    expect(cell.tagName).toBe('TD');
    expect(cell).toHaveClass('hover:bg-[var(--ui-table-data-cell-color-hover)]');
    expect(cell).toHaveClass(
      'active:bg-[var(--ui-table-data-cell-color-active)]'
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  it('suppresses the actions cell content (keeping its column) while a bulk selection is active', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableActionsCell data-testid="actions" bulkSelectionActive>
              <button type="button">More</button>
            </TableActionsCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const cell = screen.getByTestId('actions');
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
    // The 48px column is still reserved, but the cell no longer reads as
    // interactive.
    expect(cell).toHaveClass('w-12');
    expect(cell).not.toHaveClass(
      'hover:bg-[var(--ui-table-data-cell-color-hover)]'
    );
  });

  it('wires the settings cell to the header-cell interaction tokens', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableSettingsCell data-testid="settings">
              <button type="button">Columns</button>
            </TableSettingsCell>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const cell = screen.getByTestId('settings');
    expect(cell.tagName).toBe('TH');
    expect(cell).toHaveClass(
      'hover:bg-[var(--ui-table-header-cell-color-hover)]'
    );
    expect(cell).toHaveClass(
      'active:bg-[var(--ui-table-header-cell-color-active)]'
    );
  });

  it('wires a keyboard focus ring on the row itself', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" tabIndex={0} />
        </TableBody>
      </Table>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveClass('focus-visible:ring-[3px]');
    expect(row).toHaveClass('focus-visible:ring-[var(--ui-focus-primary)]');
  });

  it('tints a sortable header at the cell level, not on the inner control', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable data-testid="head">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const head = screen.getByTestId('head');
    expect(head).toHaveClass(
      'hover:bg-[var(--ui-table-header-cell-color-hover)]'
    );
    expect(head).toHaveClass('has-[:focus-visible]:ring-[3px]');
    // The inner button carries no background of its own.
    expect(screen.getByRole('button').className).not.toMatch(/bg-/);
  });
});

// The Figma "Basic table behavior" section states that once a row is checked,
// that row's single-row actions disappear. The Table primitives don't own that
// rule (there is no actions-column concept) — it's a composition rule, so this
// pins the composition the stories/docs demonstrate.
describe('row selection hides that row\'s actions', () => {
  function Grid({ selected }: { selected: string[] }) {
    return (
      <Table>
        <TableBody>
          {['alpha', 'beta'].map((name) => {
            const isSelected = selected.includes(name);
            return (
              <TableRow key={name} selected={isSelected}>
                <TableSelectCell>
                  <Checkbox checked={isSelected} aria-label={`Select ${name}`} />
                </TableSelectCell>
                <TableCell>{name}</TableCell>
                <TableActionsCell>
                  {!isSelected && (
                    <button type="button">{`Actions for ${name}`}</button>
                  )}
                </TableActionsCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  it('shows every row action while nothing is selected', () => {
    render(<Grid selected={[]} />);
    expect(
      screen.getByRole('button', { name: 'Actions for alpha' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Actions for beta' })
    ).toBeInTheDocument();
  });

  it('hides only the selected row\'s actions, keeping the cell in place', () => {
    render(<Grid selected={['alpha']} />);
    expect(
      screen.queryByRole('button', { name: 'Actions for alpha' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Actions for beta' })
    ).toBeInTheDocument();
    // The row keeps its 4 cells so columns stay aligned across rows.
    const selectedRow = screen.getByLabelText('Select alpha').closest('tr');
    expect(selectedRow?.querySelectorAll('td')).toHaveLength(3);
  });
});
