import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColumnDef } from '@tanstack/react-table';
import { userEvent, waitFor, within } from 'storybook/test';
import { Checkbox } from '../checkbox';
import { Button } from '../button';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
} from '../data-table';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import React, { useState } from 'react';

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const payments: Payment[] = [
  { id: 'p1', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'p2', amount: 242, status: 'success', email: 'abe45@example.com' },
  {
    id: 'p3',
    amount: 837,
    status: 'processing',
    email: 'monserrat44@example.com',
  },
  { id: 'p4', amount: 874, status: 'success', email: 'silas22@example.com' },
  { id: 'p5', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p6', amount: 100, status: 'pending', email: 'test@example.com' },
  { id: 'p7', amount: 550, status: 'success', email: 'user7@example.com' },
  { id: 'p8', amount: 450, status: 'processing', email: 'user8@example.com' },
  { id: 'p9', amount: 300, status: 'pending', email: 'user9@example.com' },
  { id: 'p10', amount: 999, status: 'success', email: 'user10@example.com' },
  { id: 'p11', amount: 125, status: 'failed', email: 'user11@example.com' },
  { id: 'p12', amount: 680, status: 'success', email: 'user12@example.com' },
];

const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      return <div className="font-medium">${amount.toFixed(2)}</div>;
    },
  },
];

export const Default: Story = {
  args: {} as React.ComponentProps<typeof DataTable>,
  render: () => <DataTable columns={columns} data={payments} />,
};

export const Empty: Story = {
  args: {} as React.ComponentProps<typeof DataTable>,
  render: () => <DataTable columns={columns} data={[]} />,
};

function DataTableWithToolbarAndPagination() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 5 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey="email"
        searchPlaceholder="Filter emails..."
      />
      <DataTable columns={columns} data={payments} />
      <DataTablePagination table={table} />
    </div>
  );
}

export const WithToolbarAndPagination: Story = {
  args: {} as React.ComponentProps<typeof DataTable>,
  render: () => <DataTableWithToolbarAndPagination />,
};

const expandableColumns: ColumnDef<Payment>[] = [
  {
    id: 'expand',
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-muted-foreground"
        onClick={row.getToggleExpandedHandler()}
        aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
      >
        {row.getIsExpanded() ? '−' : '+'}
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

export const ExpandableRows: Story = {
  args: {} as React.ComponentProps<typeof DataTable>,
  render: () => (
    <DataTable
      columns={expandableColumns}
      data={payments}
      getRowCanExpand={() => true}
      renderExpandedRow={(row) => (
        <div className="text-sm text-muted-foreground">
          Detailed payment information for{' '}
          <span className="font-medium text-foreground">{row.original.id}</span>
          : amount ${row.original.amount.toFixed(2)} via {row.original.email}
        </div>
      )}
    />
  ),
};

export const ExpandableRowsToggled: Story = {
  args: ExpandableRows.args,
  tags: ['visual-expandable-toggle'],
  parameters: {
    snapshot: { animationDelay: 100 },
  },
  render: ExpandableRows.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [firstExpandButton] = await canvas.findAllByRole('button', {
      name: 'Expand row',
    });
    await userEvent.click(firstExpandButton);
    await waitFor(
      () => {
        canvas.getByText((_, element) => {
          if (element?.tagName !== 'DIV') {
            return false;
          }
          const text = element?.textContent?.replace(/\s+/g, ' ').trim();
          return (
            text ===
            'Detailed payment information for p1: amount $316.00 via ken99@example.com'
          );
        });
      },
      { timeout: 1500 }
    );
  },
};
