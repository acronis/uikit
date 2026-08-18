import { useState } from 'react';
import {
  type ColumnDef,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../../button';
import { Checkbox } from '../../checkbox';
import { ButtonIcon } from '../../button-icon';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../table';
import {
  DataTableBulkActionsBar,
  isBulkSelectionActive,
} from '../index';

type Row = { id: string; email: string };

const data: Row[] = [
  { id: 'r1', email: 'one@example.com' },
  { id: 'r2', email: 'two@example.com' },
  { id: 'r3', email: 'three@example.com' },
];

const columns: ColumnDef<Row>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.email}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: 'email', header: 'Email' },
];

function BulkActionsHarness() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  const bulkSelectionActive = isBulkSelectionActive(table);

  return (
    <div>
      <DataTableBulkActionsBar table={table} loadedLabel="3 of 3 items loaded">
        <Button variant="destructive">Delete</Button>
      </DataTableBulkActionsBar>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} selected={row.getIsSelected()}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableActionsCell bulkSelectionActive={bulkSelectionActive}>
                <ButtonIcon aria-label={`Actions for ${row.original.email}`}>
                  <span aria-hidden>…</span>
                </ButtonIcon>
              </TableActionsCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const rowCheckbox = (email: string) =>
  screen.getByRole('checkbox', { name: `Select ${email}` });

const rowActions = (email: string) =>
  screen.queryByRole('button', { name: `Actions for ${email}` });

describe('DataTableBulkActionsBar', () => {
  it('shows the loaded summary and disables its actions while nothing is selected', () => {
    render(<BulkActionsHarness />);

    expect(screen.getByText('3 of 3 items loaded')).toBeInTheDocument();
    expect(screen.queryByText(/ selected:$/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  // A single selected row already switches to the bulk scope: this bar
  // enables and the row's own actions hide, same as two or more selected.
  it('enables its actions, shows the selection summary, and drops the row actions for a single selected row', async () => {
    const user = userEvent.setup();
    render(<BulkActionsHarness />);

    await user.click(rowCheckbox('one@example.com'));

    expect(screen.getByText('1 item selected:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Deselect' })).toBeInTheDocument();
    expect(rowActions('one@example.com')).toBeNull();
    expect(rowActions('two@example.com')).toBeNull();
  });

  it('drops the row actions once a second row is selected', async () => {
    const user = userEvent.setup();
    render(<BulkActionsHarness />);

    await user.click(rowCheckbox('one@example.com'));
    await user.click(rowCheckbox('two@example.com'));

    expect(screen.getByText('2 items selected:')).toBeInTheDocument();
    expect(rowActions('one@example.com')).toBeNull();
    expect(rowActions('two@example.com')).toBeNull();
    expect(rowActions('three@example.com')).toBeNull();
  });

  it('drops the row actions when the header select-all is checked', async () => {
    const user = userEvent.setup();
    render(<BulkActionsHarness />);

    await user.click(screen.getByRole('checkbox', { name: 'Select all' }));

    expect(screen.getByText('3 items selected:')).toBeInTheDocument();
    expect(rowActions('one@example.com')).toBeNull();
  });

  it('resets the selection, disables its actions again, and restores the loaded summary when Deselect is pressed', async () => {
    const user = userEvent.setup();
    render(<BulkActionsHarness />);

    await user.click(rowCheckbox('one@example.com'));
    await user.click(rowCheckbox('two@example.com'));
    expect(screen.getByText('2 items selected:')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Deselect' }));

    expect(screen.queryByText('2 items selected:')).not.toBeInTheDocument();
    expect(screen.getByText('3 of 3 items loaded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    expect(rowCheckbox('one@example.com')).toHaveAttribute(
      'aria-checked',
      'false'
    );
    expect(rowCheckbox('two@example.com')).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('localizes the count and clear labels through props', () => {
    function Localized() {
      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        state: { rowSelection: { 0: true, 1: true } },
        onRowSelectionChange: () => {},
      });
      return (
        <DataTableBulkActionsBar
          table={table}
          selectedLabel={(count) => `Vybrano: ${count}`}
          clearLabel="Zrusit"
        />
      );
    }

    render(<Localized />);
    expect(screen.getByText('Vybrano: 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zrusit' })).toBeInTheDocument();
  });
});
