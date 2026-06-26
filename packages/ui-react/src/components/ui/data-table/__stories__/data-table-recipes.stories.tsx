import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type ColumnDef,
  type ColumnOrderState,
  type GroupingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../table';
import { DataTable, type DataTableProps } from '../data-table';

// Advanced TanStack recipes that compose the Table primitives directly (the
// self-contained DataTable owns its own state, so these build their own table
// instance). Each is a copy-paste example for a capability that's intentionally
// NOT a DataTable prop — keeping the published component lean.
const meta = {
  title: 'UI/DataTable/Recipes',
  component: DataTable,
  parameters: { layout: 'padded' },
  // These recipes compose their own table via `render`; satisfy DataTable's
  // required generic args with an empty cast.
  args: {} as DataTableProps<unknown, unknown>,
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperClass =
  'rounded-md border border-[var(--ui-table-global-cell-border-color)]';

/* ----------------------------------------------------------------- Tree mode */

type TreeRow = { name: string; size: string; children?: TreeRow[] };

const treeData: TreeRow[] = [
  {
    name: 'Workloads',
    size: '15 TB',
    children: [
      {
        name: 'Servers',
        size: '12 TB',
        children: [
          { name: 'db-01', size: '4 TB' },
          { name: 'db-02', size: '8 TB' },
        ],
      },
      {
        name: 'Workstations',
        size: '3 TB',
        children: [{ name: 'ws-01', size: '3 TB' }],
      },
    ],
  },
];

const treeColumns: ColumnDef<TreeRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div
        className="flex items-center gap-1"
        style={{ paddingLeft: `${row.depth * 1.25}rem` }}
      >
        {row.getCanExpand() ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? 'Collapse' : 'Expand'}
            className="flex size-4 items-center justify-center text-muted-foreground [&_svg]:size-4"
          >
            {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </button>
        ) : (
          <span className="size-4" />
        )}
        {row.original.name}
      </div>
    ),
  },
  { accessorKey: 'size', header: 'Size' },
];

export const TreeMode: Story = {
  render: () => {
    const table = useReactTable({
      data: treeData,
      columns: treeColumns,
      getSubRows: (row) => row.children,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      initialState: { expanded: true },
    });
    return (
      <div className={wrapperClass}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
    );
  },
};

/* --------------------------------------------------------------- Row groups */

type Payment = { id: string; amount: number; status: string; email: string };

const payments: Payment[] = [
  { id: 'p1', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'p2', amount: 242, status: 'success', email: 'abe45@example.com' },
  { id: 'p3', amount: 837, status: 'processing', email: 'monserrat@example.com' },
  { id: 'p4', amount: 874, status: 'processing', email: 'silas22@example.com' },
  { id: 'p5', amount: 721, status: 'failed', email: 'carmella@example.com' },
];

const groupColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

export const RowGroups: Story = {
  render: () => {
    const [grouping] = useState<GroupingState>(['status']);
    const table = useReactTable({
      data: payments,
      columns: groupColumns,
      state: { grouping },
      getCoreRowModel: getCoreRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      initialState: { expanded: true },
    });
    return (
      <div className={wrapperClass}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) =>
              row.getIsGrouped() ? (
                <TableRow
                  key={row.id}
                  className="bg-[var(--ui-background-surface-secondary)]"
                >
                  <TableCell colSpan={row.getVisibleCells().length}>
                    <button
                      onClick={row.getToggleExpandedHandler()}
                      className="flex items-center gap-1 font-semibold [&_svg]:size-4"
                    >
                      {row.getIsExpanded() ? (
                        <ChevronDownIcon />
                      ) : (
                        <ChevronRightIcon />
                      )}
                      {String(row.getValue('status'))}
                      <span className="text-muted-foreground">
                        ({row.subRows.length})
                      </span>
                    </button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    );
  },
};

/* --------------------------------------------------------- Virtual scrolling */

const manyRows: Payment[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `row-${i + 1}`,
  amount: (i % 9) * 100 + 100,
  status: ['success', 'processing', 'failed'][i % 3],
  email: `user${i + 1}@example.com`,
}));

const virtualColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

export const VirtualScrolling: Story = {
  render: () => {
    const parentRef = useRef<HTMLDivElement>(null);
    const table = useReactTable({
      data: manyRows,
      columns: virtualColumns,
      getCoreRowModel: getCoreRowModel(),
    });
    const rows = table.getRowModel().rows;
    const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 41,
      overscan: 8,
    });
    const items = virtualizer.getVirtualItems();
    // Spacer rows keep the column layout intact while only the visible window
    // of <tr>s is mounted (1000 rows, ~12 in the DOM).
    const before = items.length ? items[0].start : 0;
    const after = items.length
      ? virtualizer.getTotalSize() - items[items.length - 1].end
      : 0;
    return (
      <div ref={parentRef} className={`${wrapperClass} h-[360px] overflow-auto`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {before > 0 && (
              <tr>
                <td colSpan={virtualColumns.length} style={{ height: before }} />
              </tr>
            )}
            {items.map((vi) => {
              const row = rows[vi.index];
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {after > 0 && (
              <tr>
                <td colSpan={virtualColumns.length} style={{ height: after }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    );
  },
};

/* --------------------------------------------------------- Column reordering */

export const ColumnReorder: Story = {
  render: () => {
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
      'status',
      'email',
      'amount',
    ]);
    const [dragged, setDragged] = useState<string>();
    const table = useReactTable({
      data: payments,
      columns: groupColumns,
      state: { columnOrder },
      onColumnOrderChange: setColumnOrder,
      getCoreRowModel: getCoreRowModel(),
    });
    const reorder = (from: string, to: string) => {
      setColumnOrder((order) => {
        const next = [...order];
        next.splice(next.indexOf(to), 0, next.splice(next.indexOf(from), 1)[0]);
        return next;
      });
    };
    return (
      <div className={wrapperClass}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    draggable
                    onDragStart={() => setDragged(h.column.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dragged && reorder(dragged, h.column.id)}
                    className="cursor-grab select-none active:cursor-grabbing"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
    );
  },
};
