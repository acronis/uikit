'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Button,
  Checkbox,
  DataTableBulkActionsBar,
  DataTablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@acronis-platform/ui-react';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const payments: Payment[] = [
  { id: 'p1', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'p2', amount: 242, status: 'success', email: 'abe45@example.com' },
  { id: 'p3', amount: 837, status: 'processing', email: 'monserrat@example.com' },
  { id: 'p4', amount: 874, status: 'success', email: 'silas22@example.com' },
  { id: 'p5', amount: 721, status: 'failed', email: 'carmella@example.com' },
];

const STATUS_VARIANT = {
  success: 'success',
  processing: 'info',
  pending: 'neutral',
  failed: 'danger',
} as const;

const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="font-medium">${row.original.amount.toFixed(2)}</div>
    ),
  },
];

export function DataTableBulkActionsDemo() {
  // Pre-select a single row: one selected row is already a bulk selection, so
  // the preview opens with the bar in its active state.
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    '0': true,
  });

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Always mounted: the bar owns its own threshold (one or more rows
          selected) and switches between a disabled idle state showing
          `loadedLabel` and the active selection summary. */}
      <DataTableBulkActionsBar
        table={table}
        loadedLabel={`${payments.length} items total`}
      >
        <Button variant="secondary">Export</Button>
        <Button variant="destructive">Delete</Button>
      </DataTableBulkActionsBar>

      <div className="rounded-md border border-[var(--ui-table-global-cell-border-color)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
