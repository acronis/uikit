import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BuildingIcon } from '@acronis-platform/icons-react/stroke-mono';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useTableUrlState } from '@/hooks/use-table-url-state';

import { Checkbox } from '../../checkbox';
import { useFilterSearchFilters } from '../../filter-search';
import {
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '../../input-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';
import { Tag } from '../../tag';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableExpandTrigger,
  DataTablePagination,
  type DataTableProps,
  DataTableToolbar,
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

const TENANT_ITEMS = {
  acme: 'Acme Corp',
  globex: 'Globex Inc',
} as const;

// The leading element of the toolbar row — a tenant/scope switcher, ahead of
// search and the filters popover (matches the Figma "FilterSearch" anatomy).
// Passed as `DataTableToolbar`'s `leading` prop.
function TenantSwitcher() {
  return (
    <Select items={TENANT_ITEMS} defaultValue="acme">
      <SelectTrigger className="w-56">
        <BuildingIcon
          size={16}
          className="shrink-0 text-[var(--ui-input-select-normal-icon-expand-color-idle)]"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(TENANT_ITEMS).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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
  render: () => <DataTable columns={columns} data={payments} />,
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} />,
};

export const Striped: Story = {
  render: () => <DataTable columns={columns} data={payments} striped />,
};

export const Bordered: Story = {
  render: () => <DataTable columns={columns} data={payments} bordered striped />,
};

export const Skeleton: Story = {
  render: () => <DataTable columns={columns} data={[]} skeleton skeletonRows={5} />,
};

export const CurrentRow: Story = {
  render: () => <DataTable columns={columns} data={payments} highlightCurrentRow />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('silas22@example.com'));
  },
};

/* ----------------------------------------------------------- Column resizing */

export const Resizable: Story = {
  render: () => (
    <DataTable columns={columns} data={payments} enableColumnResizing />
  ),
};

/* ------------------------------------------------------------ Sticky columns */

// A wide grid whose first column pins left and last column pins right; the
// middle columns scroll horizontally underneath the sticky ones.
type WideRow = {
  id: string;
  name: string;
  os: string;
  ip: string;
  agent: string;
  lastSeen: string;
  status: Payment['status'];
};

const wideRows: WideRow[] = payments.map((payment, index) => ({
  id: payment.id,
  name: `Device ${index + 1}`,
  os: ['Windows 11', 'macOS 14', 'Ubuntu 22.04'][index % 3],
  ip: `10.0.${index}.${index + 20}`,
  agent: `15.0.${index + 100}`,
  lastSeen: `${index + 1}h ago`,
  status: payment.status,
}));

const wideColumns: ColumnDef<WideRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: { pin: 'left' },
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  { accessorKey: 'os', header: 'Operating system' },
  { accessorKey: 'ip', header: 'IP address' },
  { accessorKey: 'agent', header: 'Agent version' },
  { accessorKey: 'lastSeen', header: 'Last seen' },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { pin: 'right' },
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
];

export const StickyColumns: Story = {
  render: () => (
    <div className="max-w-md">
      <DataTable columns={wideColumns} data={wideRows} />
    </div>
  ),
};

/* --------------------------------------------------------- Expandable column */

const expandColumnColumns: ColumnDef<Payment>[] = [
  {
    id: 'expand',
    header: () => null,
    cell: ({ row }) => <DataTableExpandTrigger row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
];

export const ExpandableColumn: Story = {
  render: () => (
    <DataTable
      columns={expandColumnColumns}
      data={payments.slice(0, 5)}
      getRowCanExpand={() => true}
      renderExpandedRow={(row) => (
        <div className="text-sm text-muted-foreground">
          Detailed payment information for{' '}
          <span className="font-medium text-foreground">{row.original.id}</span> —
          ${row.original.amount.toFixed(2)} via {row.original.email}
        </div>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getAllByRole('button', { name: 'Expand row' })[0]
    );
  },
};

/* --------------------------------------------------------- Column filtering */

const STATUS_OPTIONS = {
  all: 'All',
  success: 'Success',
  processing: 'Processing',
  pending: 'Pending',
  failed: 'Failed',
} as const;

function StatusFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  const value = (filters.status as string) ?? 'all';
  return (
    <InputSelect
      items={STATUS_OPTIONS}
      value={value}
      onValueChange={(next) =>
        setFilter('status', next === 'all' ? undefined : next)
      }
    >
      <InputSelectField>
        <InputSelectLabel>Status</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
          <InputSelectItem key={key} value={key}>
            {label}
          </InputSelectItem>
        ))}
      </InputSelectContent>
    </InputSelect>
  );
}

const filterColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: 'equals',
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

function WithColumnFiltering() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // Shared with DataTable below via its controlled `columnVisibility` prop, so
  // the toolbar's "View" menu and the grid agree on one visibility state
  // instead of each owning an independent `useReactTable` instance's copy.
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data: payments,
    columns: filterColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnFilters, columnVisibility },
  });
  // The self-contained DataTable owns its own state, so drive its rows from the
  // toolbar's filtered row model — the toolbar is the source of truth here.
  const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        leading={<TenantSwitcher />}
        searchKey="email"
        searchPlaceholder="Filter emails…"
        filtersLabel="Filters"
        getFilterChipLabel={(key, value) => `${key}: ${String(value)}`}
      >
        <StatusFilterField />
      </DataTableToolbar>
      <DataTable
        columns={filterColumns}
        data={filteredData}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}

export const ColumnFiltering: Story = {
  render: () => <WithColumnFiltering />,
};

/* ------------------------------------------------------------- Row selection */

// Tri-state header checkbox (page-scoped, matching `toggleAllPageRowsSelected`):
// selecting some — but not all — page rows puts the header checkbox in the
// `indeterminate` (mixed) state; selecting every page row checks it.
export const RowSelection: Story = {
  render: () => <DataTable columns={columns} data={payments} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectAll = canvas.getByLabelText('Select all');
    await expect(selectAll).toHaveAttribute('aria-checked', 'false');
    // Select one row → header goes indeterminate (mixed).
    await userEvent.click(canvas.getAllByLabelText('Select row')[0]);
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
  },
};

/* --------------------------------------------------------- Wrapping columns */

type Note = {
  id: string;
  workload: string;
  detail: string;
  status: Payment['status'];
};

const notes: Note[] = [
  {
    id: 'n1',
    workload: 'web-server-01',
    detail:
      'The scheduled backup completed successfully, but two archived volumes were skipped because the target storage was temporarily unreachable during the maintenance window.',
    status: 'success',
  },
  {
    id: 'n2',
    workload: 'db-primary',
    detail:
      'Replication lag exceeded the configured threshold for several minutes; investigate the network path between the primary and the standby replica before the next backup run.',
    status: 'processing',
  },
  {
    id: 'n3',
    workload: 'mail-relay',
    detail: 'No issues detected.',
    status: 'pending',
  },
];

const wrapColumns: ColumnDef<Note>[] = [
  { accessorKey: 'workload', header: 'Workload' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Tag variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Tag>
    ),
  },
  {
    accessorKey: 'detail',
    header: 'Detail',
    // `meta.wrap` lets the long detail text wrap onto multiple lines instead of
    // being clipped to a single fixed-height row.
    meta: { wrap: true },
  },
];

export const WrapColumn: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable columns={wrapColumns} data={notes} />
    </div>
  ),
};

/* --------------------------------------------------------- Custom sortingFn */

type Incident = {
  id: string;
  host: string;
  severity: 'Critical' | 'Error' | 'Warning' | 'Running';
};

// Fixed priority rank — the meaningful order for severities, which alphabetic
// sorting (Critical, Error, Running, Warning) would get wrong.
const SEVERITY_RANK: Record<Incident['severity'], number> = {
  Critical: 0,
  Error: 1,
  Warning: 2,
  Running: 3,
};

const SEVERITY_VARIANT = {
  Critical: 'danger',
  Error: 'danger',
  Warning: 'warning',
  Running: 'info',
} as const;

const incidents: Incident[] = [
  { id: 'i1', host: 'web-01', severity: 'Warning' },
  { id: 'i2', host: 'db-02', severity: 'Running' },
  { id: 'i3', host: 'api-03', severity: 'Critical' },
  { id: 'i4', host: 'cache-04', severity: 'Error' },
  { id: 'i5', host: 'lb-05', severity: 'Running' },
  { id: 'i6', host: 'vm-06', severity: 'Warning' },
];

const incidentColumns: ColumnDef<Incident>[] = [
  {
    accessorKey: 'host',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Host" />,
  },
  {
    accessorKey: 'severity',
    // Non-alphabetic priority order via a custom TanStack `sortingFn` — the
    // native equivalent of `useSortState`'s `comparators` override on the Table
    // primitives.
    sortingFn: (rowA, rowB) =>
      SEVERITY_RANK[rowA.original.severity] -
      SEVERITY_RANK[rowB.original.severity],
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Severity" />
    ),
    cell: ({ row }) => (
      <Tag variant={SEVERITY_VARIANT[row.original.severity]}>
        {row.original.severity}
      </Tag>
    ),
  },
];

// Kept as a literal string (not `sortingFn.toString()`) so the canvas shows
// clean, formatted source rather than the runtime's own whitespace/minification.
const SEVERITY_SORTING_FN_SOURCE = `const SEVERITY_RANK = { Critical: 0, Error: 1, Warning: 2, Running: 3 };

{
  accessorKey: 'severity',
  sortingFn: (rowA, rowB) =>
    SEVERITY_RANK[rowA.original.severity] - SEVERITY_RANK[rowB.original.severity],
}`;

function CustomSortingDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <strong>Host</strong> uses TanStack&apos;s default alphanumeric sort;{' '}
        <strong>Severity</strong> uses a custom <code>sortingFn</code> that sorts
        by priority rank (Critical &gt; Error &gt; Warning &gt; Running), not
        alphabetically — the TanStack-native equivalent of the <code>Table</code>{' '}
        primitives&apos; <code>useSortState</code> <code>comparators</code>{' '}
        override.
      </p>
      <pre className="overflow-x-auto rounded-md border border-(--ui-table-global-row-border-color) bg-muted p-3 text-xs">
        <code>{SEVERITY_SORTING_FN_SOURCE}</code>
      </pre>
      <DataTable columns={incidentColumns} data={incidents} />
    </div>
  );
}

export const CustomSorting: Story = {
  render: () => <CustomSortingDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Sort by Severity' })
    );
    const order = canvas
      .getAllByRole('row')
      .slice(1) // drop the header row
      .map((row) => row.querySelectorAll('td')[1]?.textContent);
    // Priority order leads with Critical (alphabetic would too) but puts Warning
    // *before* Running — the reverse of alphabetic — proving the override ran.
    expect(order[0]).toBe('Critical');
    expect(order.indexOf('Warning')).toBeLessThan(order.indexOf('Running'));
  },
};

/* -------------------------------------------------------------- Kitchen sink */

type Device = {
  id: string;
  name: string;
  client: string;
  severity: Incident['severity'];
  note: string;
};

const devices: Device[] = Array.from({ length: 12 }, (_, i) => {
  const severity = (['Critical', 'Error', 'Warning', 'Running'] as const)[i % 4];
  return {
    id: `d${i + 1}`,
    name: `Device ${i + 1}`,
    client: ['Apex Innovations', 'BlueSky Technologies', 'OmniData Dynamics'][
      i % 3
    ],
    severity,
    note:
      i % 3 === 0
        ? 'Last backup finished with warnings; one volume was skipped because the destination storage was briefly unreachable during the maintenance window.'
        : 'Healthy.',
  };
});

function SeverityFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  const value = (filters.severity as string) ?? 'all';
  const options = {
    all: 'All',
    Critical: 'Critical',
    Error: 'Error',
    Warning: 'Warning',
    Running: 'Running',
  } as const;
  return (
    <InputSelect
      items={options}
      value={value}
      onValueChange={(next) =>
        setFilter('severity', next === 'all' ? undefined : next)
      }
    >
      <InputSelectField>
        <InputSelectLabel>Severity</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        {Object.entries(options).map(([key, label]) => (
          <InputSelectItem key={key} value={key}>
            {label}
          </InputSelectItem>
        ))}
      </InputSelectContent>
    </InputSelect>
  );
}

// Explicit sizes so `enableColumnResizing` doesn't fall back to the 150px
// default (which would balloon the checkbox/expand columns).
const kitchenSinkColumns: ColumnDef<Device>[] = [
  {
    id: 'select',
    // Tri-state, page-scoped selection column, pinned to the left edge.
    meta: { pin: 'left' },
    size: 44,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
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
    id: 'expand',
    size: 44,
    enableResizing: false,
    enableSorting: false,
    enableHiding: false,
    header: () => null,
    cell: ({ row }) => <DataTableExpandTrigger row={row} />,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 160,
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  { accessorKey: 'client', header: 'Client', size: 180 },
  {
    accessorKey: 'note',
    header: 'Note',
    // Long free-text column that wraps rather than clipping.
    meta: { wrap: true },
    size: 320,
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    // Pinned to the right edge; filterable via the toolbar.
    meta: { pin: 'right' },
    size: 140,
    filterFn: 'equals',
    enableResizing: false,
    cell: ({ row }) => (
      <Tag variant={SEVERITY_VARIANT[row.original.severity]}>
        {row.original.severity}
      </Tag>
    ),
  },
];

function KitchenSinkDemo() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // A source-of-truth table for search + per-column filtering + view options +
  // pagination; DataTable receives the resulting page rows and owns the
  // interactive grid state (selection / expansion / resizing / pinning / wrap).
  // Headers are non-sortable here on purpose: DataTable renders headers with its
  // own instance, so wiring sort through this external table would double-manage
  // state — sorting is demonstrated in its own `CustomSorting` story.
  const table = useReactTable({
    data: devices,
    columns: kitchenSinkColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { pagination: { pageSize: 5 } },
    state: { columnFilters, columnVisibility },
  });

  const pageRows = table.getRowModel().rows.map((row) => row.original);

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        leading={<TenantSwitcher />}
        searchKey="name"
        searchPlaceholder="Filter by name…"
        getFilterChipLabel={(key, value) => `${key}: ${String(value)}`}
      >
        <SeverityFilterField />
      </DataTableToolbar>
      <div className="max-w-2xl">
        <DataTable
          columns={kitchenSinkColumns}
          data={pageRows}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          enableColumnResizing
          getRowCanExpand={() => true}
          renderExpandedRow={(row) => (
            <div className="text-sm text-muted-foreground">
              Full report for{' '}
              <span className="font-medium text-foreground">
                {row.original.name}
              </span>{' '}
              — {row.original.client}: {row.original.note}
            </div>
          )}
        />
      </div>
      <DataTablePagination table={table} pageSizeOptions={[5, 10, 20]} />
    </div>
  );
}

// Combines search + per-column filter + applied-filter chips (toolbar), column
// visibility (view options), pagination, column resizing, a sticky-pinned
// selection column (left) and severity column (right), a wrapping note column,
// tri-state selection, and an expand-trigger column.
export const KitchenSink: Story = {
  render: () => <KitchenSinkDemo />,
};

/* ------------------------------------------------------- Bookmarkable state */

// Storybook's manager forwards unknown query params DOWN to the preview iframe
// on load (pasting `tbl_page=2&...` onto the outer address bar and reloading
// does restore state), but the other direction never reaches the visible
// address bar — `history.pushState` inside a story only updates the iframe's
// own `window.location`, a separate browsing context from the manager's.
// Mirror this demo's `tbl_*` params up to the parent frame (when actually
// embedded in one) after every render, so a real interaction is reflected in
// the address bar the user is looking at, not just the iframe's.
function useSyncUrlToParentFrame() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.top || window.top === window.self)
      return;
    try {
      const iframeUrl = new URL(window.location.href);
      const topUrl = new URL(window.top.location.href);
      let changed = false;
      for (const [key, value] of iframeUrl.searchParams.entries()) {
        if (key.startsWith('tbl_') && topUrl.searchParams.get(key) !== value) {
          topUrl.searchParams.set(key, value);
          changed = true;
        }
      }
      for (const key of Array.from(topUrl.searchParams.keys())) {
        if (key.startsWith('tbl_') && !iframeUrl.searchParams.has(key)) {
          topUrl.searchParams.delete(key);
          changed = true;
        }
      }
      // `URLSearchParams.toString()` percent-encodes every value it
      // serializes, including Storybook's own unrelated `path=/story/...`
      // param — `/` never needs escaping in a query string, so unescape it
      // back for a readable URL.
      if (changed) {
        window.top.history.replaceState(
          null,
          '',
          topUrl.toString().replace(/%2F/g, '/')
        );
      }
    } catch {
      // Cross-origin parent (e.g. an unrelated embed) — nothing to sync.
    }
  });
}

const urlStateColumns: ColumnDef<Device>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'client', header: 'Client' },
  {
    accessorKey: 'severity',
    filterFn: 'equals',
    header: 'Severity',
    cell: ({ row }) => (
      <Tag variant={SEVERITY_VARIANT[row.original.severity]}>
        {row.original.severity}
      </Tag>
    ),
  },
];

// Pagination + a `severity` column filter mirrored to the URL (namespaced
// `tbl_*` keys) via `useTableUrlState`, so the view is bookmarkable — the same
// hook the `Table` primitives use, bridged here to an external `useReactTable`
// instance since `DataTable` owns its sorting/selection/expansion state
// internally and only takes plain `data`. Sorting isn't bookmarked for the same
// reason the `KitchenSink` toolbar leaves it uncontrolled: `DataTable` renders
// its own headers off its own table instance, so an *external* sort would only
// ever reorder the page handed to it, not the header's own affordance.
function UrlStateDemo() {
  useSyncUrlToParentFrame();
  const { state, setPagination, setColumnFilters } = useTableUrlState({
    defaultPageSize: 5,
  });
  // Not bookmarked (unlike pagination/filters above) — shared with DataTable
  // below purely so the toolbar's "View" menu and the grid agree on one
  // visibility state instead of each owning an independent copy.
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: devices,
    columns: urlStateColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: (updater) =>
      setColumnFilters((current) => {
        const next =
          typeof updater === 'function'
            ? updater(current.map((f) => ({ id: f.id, value: f.value })))
            : updater;
        return next.map((f) => ({ id: f.id, value: String(f.value) }));
      }),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination: state.pagination,
      columnFilters: state.columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Page and the Severity filter are mirrored to the URL query string
        (namespaced <code>tbl_*</code> keys) so the view is bookmarkable. Append{' '}
        <code>tbl_page=2&amp;tbl_filter=severity:Critical</code> to the preview
        URL to load page 2 filtered to Critical devices.
      </p>
      <DataTableToolbar
        table={table}
        leading={<TenantSwitcher />}
        filtersLabel="Filters"
      >
        <SeverityFilterField />
      </DataTableToolbar>
      <DataTable
        columns={urlStateColumns}
        data={table.getRowModel().rows.map((row) => row.original)}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
      <DataTablePagination table={table} />
    </div>
  );
}

export const UrlState: Story = {
  render: () => <UrlStateDemo />,
};
