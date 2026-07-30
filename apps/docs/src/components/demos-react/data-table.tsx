'use client';

import { type ReactNode, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Checkbox,
  DataTable,
  DataTableColumnHeader,
  DataTableExpandTrigger,
  DataTablePagination,
  DataTableToolbar,
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
  { id: 'p6', amount: 100, status: 'pending', email: 'test@example.com' },
  { id: 'p7', amount: 455, status: 'processing', email: 'jamal@example.com' },
  { id: 'p8', amount: 98, status: 'failed', email: 'nadia@example.com' },
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
    size: 44,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'expand',
    header: () => null,
    cell: ({ row }) => <DataTableExpandTrigger row={row} />,
    size: 44,
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

// One `useReactTable` instance drives the toolbar, the grid (via DataTable's
// `table` prop) and the pagination — so searching, sorting, selection and
// paging all agree. Passing `columns`/`data` instead would give DataTable its
// own instance, and the toolbar/pagination would then act on a different one.
function PagedGridDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    initialState: { pagination: { pageSize: 5 } },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchKey="email"
        searchPlaceholder="Filter emails…"
      />
      <DataTable
        table={table}
        renderExpandedRow={(row) => (
          <div className="text-sm text-muted-foreground">
            Payment {row.original.id} — ${row.original.amount.toFixed(2)} from{' '}
            <span className="font-medium text-foreground">
              {row.original.email}
            </span>
          </div>
        )}
      />
      <DataTablePagination table={table} pageSizeOptions={[5, 10, 20]} />
    </div>
  );
}

type Device = {
  id: string;
  name: string;
  os: string;
  ip: string;
  agent: string;
  note: string;
  status: Payment['status'];
};

const devices: Device[] = payments.slice(0, 6).map((payment, index) => ({
  id: payment.id,
  name: `Device ${index + 1}`,
  os: ['Windows 11', 'macOS 14', 'Ubuntu 22.04'][index % 3],
  ip: `10.0.${index}.${index + 20}`,
  agent: `15.0.${index + 100}`,
  note:
    index % 3 === 0
      ? 'Last backup finished with warnings; one volume was skipped because the destination storage was briefly unreachable.'
      : 'Healthy.',
  status: payment.status,
}));

// `meta.pin` pins a column to an edge (sticky while the grid scrolls
// horizontally); `meta.wrap` lets a long column wrap instead of clipping.
// `enableColumnResizing` needs deterministic widths, hence the explicit `size`
// on every column.
const deviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { pin: 'left' },
    size: 150,
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  // Placed early so its wrapped text stays readable before the right-pinned
  // Status column starts overlaying the columns scrolling under it.
  { accessorKey: 'note', header: 'Note', meta: { wrap: true }, size: 260 },
  { accessorKey: 'os', header: 'Operating system', size: 150 },
  { accessorKey: 'ip', header: 'IP address', size: 140 },
  { accessorKey: 'agent', header: 'Agent version', size: 140 },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { pin: 'right' },
    size: 120,
    enableResizing: false,
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
];

type Policy = {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
};

const POLICY_PAGE_SIZE = 8;

const allPolicies: Policy[] = Array.from({ length: 24 }, (_, index) => ({
  id: `policy-${index + 1}`,
  name: `Backup policy ${index + 1}`,
  status: (['active', 'paused', 'error'] as const)[index % 3],
  lastRun: `${(index % 12) + 1}h ago`,
}));

// Stands in for a server request: applies the requested sort, then returns one
// page. A real consumer maps `sorting` to query params and refetches instead.
function fetchPolicyPage(sorting: SortingState, pageIndex: number): Policy[] {
  const [sort] = sorting;
  const rows = sort
    ? [...allPolicies].sort((a, b) => {
        const factor = sort.desc ? -1 : 1;
        return (
          String(a[sort.id as keyof Policy]).localeCompare(
            String(b[sort.id as keyof Policy]),
            undefined,
            { numeric: true }
          ) * factor
        );
      })
    : allPolicies;
  const start = pageIndex * POLICY_PAGE_SIZE;
  return rows.slice(start, start + POLICY_PAGE_SIZE);
}

const policyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Policy" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <div className="capitalize">{row.original.status}</div>,
  },
  {
    accessorKey: 'lastRun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last run" />
    ),
  },
];

// Server-driven: `manualSorting` (DataTable reports the sort but never reorders
// rows itself) plus `paginationMode="infinite"` (a sentinel row calls
// `onLoadMore` as it scrolls into view; the caller accumulates `data`).
function ServerDrivenDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [rows, setRows] = useState<Policy[]>(() => fetchPolicyPage([], 0));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasNextPage = rows.length < allPolicies.length;

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(next);
    setPageIndex(0);
    setRows(fetchPolicyPage(next, 0));
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      const nextPageIndex = pageIndex + 1;
      setRows((current) => [
        ...current,
        ...fetchPolicyPage(sorting, nextPageIndex),
      ]);
      setPageIndex(nextPageIndex);
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {rows.length} of {allPolicies.length} policies loaded — scroll the grid
        to load more.
      </p>
      <div className="max-h-80 overflow-auto">
        <DataTable
          columns={policyColumns}
          data={rows}
          manualSorting
          sorting={sorting}
          onSortingChange={handleSortingChange}
          paginationMode="infinite"
          onLoadMore={handleLoadMore}
          loadMoreRootMargin="200px"
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
        />
      </div>
    </div>
  );
}

function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function DataTableDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      <DemoSection
        title="Toolbar, sorting, selection, expansion, pagination"
        description="One table instance shared by the toolbar, the grid and the pagination."
      >
        <PagedGridDemo />
      </DemoSection>
      <DemoSection
        title="Resizable, sticky and wrapping columns"
        description="Drag a header edge to resize (or focus it and use Arrow keys). Scroll horizontally — Name stays pinned left, Status pinned right, and Note wraps."
      >
        <DataTable
          columns={deviceColumns}
          data={devices}
          enableColumnResizing
        />
      </DemoSection>
      <DemoSection
        title="Server-driven: manual sorting + infinite scroll"
        description="Sorting is reported to the caller (which refetches); scrolling to the bottom loads the next page."
      >
        <ServerDrivenDemo />
      </DemoSection>
    </div>
  );
}
