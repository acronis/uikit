import { useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
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
import { ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../table';
import {
  FilterSearch,
  FilterSearchFilters,
  useFilterSearchFilters,
} from '../../filter-search';
import { InputSearch } from '../../input-search';
import {
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '../../input-select';
import { DateRangePicker, type DateRange } from '../../date-range-picker';
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
            className="flex size-4 cursor-pointer items-center justify-center text-muted-foreground [&_svg]:size-4"
          >
            <ChevronDownIcon
              className={`transition-transform ${
                row.getIsExpanded() ? '' : 'ltr:-rotate-90 rtl:rotate-90'
              }`}
            />
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
  {
    id: 'p3',
    amount: 837,
    status: 'processing',
    email: 'monserrat@example.com',
  },
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
                      className="flex cursor-pointer items-center gap-1 font-semibold [&_svg]:size-4"
                    >
                      <ChevronDownIcon
                        className={`transition-transform ${
                          row.getIsExpanded()
                            ? ''
                            : 'ltr:-rotate-90 rtl:rotate-90'
                        }`}
                      />
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
    // `Table` already renders its own `overflow-auto` wrapper (for horizontal
    // scroll); nesting a SECOND `overflow-auto` div around it — the more
    // obvious-looking approach — would give `position: sticky` two candidate
    // scrolling ancestors. It locks onto the nearest one, the inner,
    // Table-owned wrapper, which never scrolls itself (sized to fit its
    // content), so the header wouldn't stick. Instead, get a ref to the
    // `<table>` itself and reach one level up to ITS wrapper — the outer div
    // below sizes/scrolls THAT wrapper directly via a child-selector utility
    // (`[&>div]:...`), so there's only one scrolling ancestor, and the
    // virtualizer measures/listens on that same element.
    const tableRef = useRef<HTMLTableElement>(null);
    const table = useReactTable({
      data: manyRows,
      columns: virtualColumns,
      getCoreRowModel: getCoreRowModel(),
    });
    const rows = table.getRowModel().rows;
    const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => tableRef.current?.parentElement ?? null,
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
      <div
        className={`${wrapperClass} [&>div]:h-[360px] [&>div]:overflow-auto`}
      >
        <Table ref={tableRef}>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  // `sticky top-0` on each header CELL (not the `<tr>`) keeps it
                  // pinned to the scroll container (this div, not the page)
                  // while the virtualized body scrolls underneath — browsers
                  // don't reliably support `position: sticky` on `<tr>`/`<thead>`
                  // itself, only on the cells (the same reason `DataTable`'s
                  // horizontal column pinning targets `<th>`/`<td>`, not `<tr>`).
                  // `bg-background` makes it opaque — the row's own idle
                  // background token is transparent by design, so an unfilled
                  // sticky header would let scrolling rows show through it.
                  <TableHead
                    key={h.id}
                    className="sticky top-0 z-10 bg-background"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {before > 0 && (
              <tr>
                <td
                  colSpan={virtualColumns.length}
                  style={{ height: before }}
                />
              </tr>
            )}
            {items.map((vi) => {
              const row = rows[vi.index];
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      setDragged(h.column.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
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

/* ------------------------------------------------------ Toolbar + date range */

const STATUS_OPTIONS = {
  all: 'All',
  success: 'Success',
  processing: 'Processing',
  failed: 'Failed',
} as const;

// A Status select filter field, wired to the FilterSearchFilters draft via the
// context hook — a plain sibling of the date-range field inside the popup.
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

// A date-range filter field — opening its calendar renders a second Popover on
// top of the already-open Filters popup (popover-over-popover).
function PeriodFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <DateRangePicker
      label="Period"
      placeholder="Select a date range"
      value={(filters.period as DateRange | undefined) ?? {}}
      onValueChange={(range) =>
        setFilter('period', range.from ? range : undefined)
      }
      className="w-64"
    />
  );
}

// A toolbar row above the table with a free-text search plus a Filters popup
// (Filters button → popover) holding a Status select and a DateRangePicker
// period field — mirroring the "Alerts" screen from the design brief, where the
// date-range filter lives as one field inside the filters popup, not standalone
// in the toolbar row. The table's data/columns are unchanged from the
// `RowGroups` recipe; the search narrows by email and the applied Status filter
// narrows by status.
function DateRangeRecipeDemo() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({
    period: {
      from: new Date(2026, 6, 1),
      to: new Date(2026, 6, 15),
    } satisfies DateRange,
  });
  const status = filters.status as string | undefined;
  // `data` MUST be a stable reference across renders that don't actually
  // change the rows: TanStack `useReactTable` resets internal state when
  // `data` changes identity, and once the applied `filters` commit re-renders
  // this story, a fresh `.filter(...)` array each render feeds that reset back
  // into the open Filters popover's Base UI positioner as an unbounded
  // synchronous re-render loop (a hard tab freeze). Memoizing on the actual
  // inputs keeps the reference stable. See TanStack's "give the table a stable
  // data reference" guidance.
  const data = useMemo(
    () =>
      payments.filter(
        (row) =>
          row.email.toLowerCase().includes(query.toLowerCase()) &&
          (!status || row.status === status)
      ),
    [query, status]
  );
  const table = useReactTable({
    data,
    columns: groupColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="space-y-4">
      <FilterSearch>
        <InputSearch
          placeholder="Filter by email…"
          aria-label="Filter by email"
          className="w-56"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <FilterSearchFilters
          value={filters}
          onValueChange={setFilters}
          label="Filters"
        >
          <StatusFilterField />
          <PeriodFilterField />
        </FilterSearchFilters>
      </FilterSearch>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={groupColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const WithDateRangeFilter: Story = {
  name: 'With date-range filter',
  render: () => <DateRangeRecipeDemo />,
};

// Same composition as above, but the `play` opens the Filters popover AND the
// Period field's calendar so the popover-over-popover state is captured for VR —
// the initial (closed) render above never exercises the nested overlay. `fullPage`
// is required because both popovers portal outside `#storybook-root`.
export const WithDateRangeFilterOpen: Story = {
  name: 'With date-range filter (open)',
  parameters: { snapshot: { fullPage: true, animationDelay: 400 } },
  render: () => <DateRangeRecipeDemo />,
  play: async () => {
    const body = within(document.body);
    await userEvent.click(await body.findByRole('button', { name: 'Filters' }));
    await userEvent.click(await body.findByRole('button', { name: 'Period' }));
    // Wait for the dual-month calendar (two grids) to paint inside the nested popover.
    await body.findAllByRole('grid');
  },
};
