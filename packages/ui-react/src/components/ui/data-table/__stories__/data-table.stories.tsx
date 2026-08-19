import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { waitFor, within } from 'storybook/test';
import {
  type ColumnDef,
  type RowSelectionState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../../button';
import { ButtonIcon } from '../../button-icon';
import { Checkbox } from '../../checkbox';
import { DropdownMenuGroup, DropdownMenuItem } from '../../dropdown-menu';
import { Tag } from '../../tag';
import {
  DataTable,
  DataTableBulkActionsBar,
  DataTableColumnHeader,
  type DataTableProps,
} from '../index';

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
  { id: 'p6', amount: 100, status: 'pending', email: 'test@example.com' },
  { id: 'p7', amount: 550, status: 'success', email: 'user7@example.com' },
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
    // Tri-state header checkbox, scoped to the current page to match the
    // page-scoped `toggleAllPageRowsSelected` action: unchecked when no page row
    // is selected, `indeterminate` when some (but not all) are, checked when all
    // page rows are.
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => (
      <div className="font-medium">${row.original.amount.toFixed(2)}</div>
    ),
  },
];

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  // DataTable is generic with required `columns`/`data`; each story drives its
  // own data via `render`, so satisfy the args type with an empty cast.
  args: {} as DataTableProps<unknown, unknown>,
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={payments}
      renderRowActions={(row) => (
        <DropdownMenuGroup>
          <DropdownMenuItem>Edit {row.original.email}</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      )}
    />
  ),
};

/* ------------------------------- Header capability hints + sticky actions */

type Workload = {
  id: string;
  name: string;
  type: string;
  os: string;
  ip: string;
  agent: string;
  plan: string;
  location: string;
  owner: string;
  lastBackup: string;
  status: 'success' | 'failed' | 'pending';
};

const TOTAL_WORKLOADS = 24;
const WORKLOADS_PAGE_SIZE = 6;

function makeWorkloads(count: number): Workload[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `w${i + 1}`,
    name: `workstation-${i + 1}`,
    type: i % 2 === 0 ? 'Virtual machine' : 'Physical machine',
    os: i % 3 === 0 ? 'Windows Server 2022' : 'Ubuntu 24.04',
    ip: `10.0.${i}.24`,
    agent: `24.11.${i}`,
    plan: i % 2 === 0 ? 'Daily incremental' : 'Weekly full',
    location: i % 2 === 0 ? 'Frankfurt' : 'Singapore',
    owner: `owner${i + 1}@example.com`,
    lastBackup: `2026-08-${String(10 + (i % 20)).padStart(2, '0')} 04:15`,
    status: (['success', 'failed', 'pending'] as const)[i % 3],
  }));
}

// Every header cell shows the gestures its own column supports (sort/reorder/
// resize) in a hover tooltip; the mix below covers the combinations, including
// a column with no capability at all — which shows no tooltip.
const workloadColumns: ColumnDef<Workload>[] = [
  // Pinned, so it can't be reordered either — with sorting and resizing off
  // that leaves no capability, and the header shows no tooltip at all.
  {
    id: 'select',
    size: 48,
    meta: { pin: 'left' },
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
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
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    size: 180,
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    size: 130,
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
  // Sortable but not resizable — its tooltip drops the resize hint.
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    size: 160,
    enableResizing: false,
  },
  {
    accessorKey: 'os',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OS" />
    ),
    size: 190,
  },
  // Neither sortable nor resizable — only the reorder hint is left.
  {
    accessorKey: 'ip',
    header: 'IP address',
    size: 140,
    enableSorting: false,
    enableResizing: false,
  },
  // Plain string header, so there's no click affordance — must be non-sortable
  // or its tooltip would promise a click that does nothing.
  { accessorKey: 'agent', header: 'Agent version', size: 140, enableSorting: false },
  {
    accessorKey: 'plan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Protection plan" />
    ),
    size: 180,
  },
  // Same as `agent` — plain string header, so sorting must be disabled.
  { accessorKey: 'location', header: 'Data center', size: 140, enableSorting: false },
  {
    accessorKey: 'owner',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
    size: 200,
  },
  {
    accessorKey: 'lastBackup',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last backup" />
    ),
    size: 170,
  },
];

function CoreCapabilitiesDemo() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // Infinite loading: `items` is the accumulated array the sentinel grows by
  // calling `onLoadMore` — a real integration would fetch the next page from
  // the backend here and append the response instead of slicing locally.
  const [items, setItems] = useState<Workload[]>(() =>
    makeWorkloads(WORKLOADS_PAGE_SIZE)
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasNextPage = items.length < TOTAL_WORKLOADS;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setItems(
        makeWorkloads(Math.min(items.length + WORKLOADS_PAGE_SIZE, TOTAL_WORKLOADS))
      );
      setIsLoadingMore(false);
    }, 600);
  };

  // A second, minimal `useReactTable` instance driving only the actions bar —
  // DataTable owns the actual grid rendering (resizing/reordering/pinning),
  // but sharing the same lifted `rowSelection` (via DataTable's
  // `rowSelection`/`onRowSelectionChange` props below) keeps both in sync.
  const selectionTable = useReactTable({
    data: items,
    columns: workloadColumns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    // Narrow enough that the ten columns scroll horizontally, so the trailing
    // sticky action column stays visible against the scrolling content.
    <div className="max-w-3xl flex flex-col gap-4">
      <DataTableBulkActionsBar
        table={selectionTable}
        loadedLabel={`${items.length} of ${TOTAL_WORKLOADS} items loaded`}
      >
        <Button variant="ghost" className="h-8">
          Delete
        </Button>
      </DataTableBulkActionsBar>
      {/* Fixed height + overflow-auto gives the sentinel row somewhere to
          scroll within — the IntersectionObserver still measures against the
          viewport, but the row only reaches it once this pane is scrolled. */}
      <div className="max-h-96 overflow-auto" data-testid="infinite-scroll-pane">
        <DataTable
          columns={workloadColumns}
          data={items}
          enableColumnResizing
          enableColumnReordering
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          paginationMode="infinite"
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          renderRowActions={(row) => (
            <DropdownMenuGroup>
              <DropdownMenuItem>Edit {row.original.name}</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        />
      </div>
    </div>
  );
}

export const CoreCapabilities: Story = {
  render: () => <CoreCapabilitiesDemo />,
  // Visual regression needs a fixed frame, and this demo's height changes on
  // every 600ms infinite-load round. `play` drives it to its terminal state
  // (every page loaded, sentinel unmounted, no spinner row) and scrolls back to
  // the top; `animationDelay` leaves margin for that last render to paint.
  parameters: { snapshot: { animationDelay: 600 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pane = await canvas.findByTestId('infinite-scroll-pane');
    // The sentinel only intersects once the pane is scrolled to the bottom, and
    // it moves down again after each appended page — so re-scroll on every poll
    // until the bulk-actions bar reports the full dataset as loaded.
    await waitFor(
      () => {
        pane.scrollTop = pane.scrollHeight;
        canvas.getByText(`${TOTAL_WORKLOADS} of ${TOTAL_WORKLOADS} items loaded`);
      },
      { timeout: 15000 }
    );
    pane.scrollTop = 0;
  },
};

/* -------------------------------------------- Core capabilities + pagination */

function CoreCapabilitiesWithPaginationDemo() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // The full dataset lives with the caller — DataTable only ever sees the
  // current page's slice, and pages are turned with plain prev/next buttons
  // (DataTablePagination binds to an externally-built `table`, which would
  // disable this demo's resizing/reordering — see the component's docs).
  const [allWorkloads] = useState<Workload[]>(() => makeWorkloads(TOTAL_WORKLOADS));
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.ceil(allWorkloads.length / WORKLOADS_PAGE_SIZE);
  const pageItems = allWorkloads.slice(
    pageIndex * WORKLOADS_PAGE_SIZE,
    pageIndex * WORKLOADS_PAGE_SIZE + WORKLOADS_PAGE_SIZE
  );

  // A second, minimal `useReactTable` instance driving only the actions bar,
  // scoped to the full dataset so the selection summary/count survives
  // paging — DataTable itself only renders the current page's slice.
  const selectionTable = useReactTable({
    data: allWorkloads,
    columns: workloadColumns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-3xl flex flex-col gap-4">
      <DataTableBulkActionsBar
        table={selectionTable}
        loadedLabel={`${allWorkloads.length} items total`}
      >
        <Button variant="ghost" className="h-8">
          Delete
        </Button>
      </DataTableBulkActionsBar>
      <DataTable
        columns={workloadColumns}
        data={pageItems}
        enableColumnResizing
        enableColumnReordering
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        renderRowActions={(row) => (
          <DropdownMenuGroup>
            <DropdownMenuItem>Edit {row.original.name}</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      />
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </span>
        <ButtonIcon
          variant="secondary"
          aria-label="Go to previous page"
          onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
          disabled={pageIndex === 0}
        >
          <ChevronLeftIcon />
        </ButtonIcon>
        <ButtonIcon
          variant="secondary"
          aria-label="Go to next page"
          onClick={() =>
            setPageIndex((current) => Math.min(pageCount - 1, current + 1))
          }
          disabled={pageIndex >= pageCount - 1}
        >
          <ChevronRightIcon />
        </ButtonIcon>
      </div>
    </div>
  );
}

export const CoreCapabilitiesWithPagination: Story = {
  render: () => <CoreCapabilitiesWithPaginationDemo />,
};
