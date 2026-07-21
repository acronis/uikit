import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useSortState } from '@/hooks';

import { Checkbox } from '../../checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { TablePagination } from '../table-pagination';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composed parts — `TableHeader`/`TableBody`/`TableFooter` with `TableRow`, `TableHead`, `TableCell`, and an optional `TableCaption`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<table>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-end">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-end">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-end">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

type Archive = {
  id: string;
  name: string;
  created: string;
  size: number;
};

const ARCHIVE_ROWS: Archive[] = [
  { id: 'a1', name: 'Backup archive', created: '26 Jan, 2026', size: 4567890 },
  { id: 'a2', name: 'Disk image', created: '24 Jan, 2026', size: 1204050 },
];

// Sortable headers render the sort affordance (inactive ⇅ / active ↑ / active ↓),
// set `aria-sort`, and are wired to `useSortState` so clicking a header actually
// re-sorts the rows.
function SortableHeadersDemo() {
  const { sortedData, getSortDirection, toggleSort } = useSortState({
    data: ARCHIVE_ROWS,
    initialSort: { columnId: 'name', direction: 'asc' },
  });

  return (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead
            sortable
            sortDirection={getSortDirection('name')}
            onSort={() => toggleSort('name')}
          >
            Name
          </TableHead>
          <TableHead
            sortable
            sortDirection={getSortDirection('created')}
            onSort={() => toggleSort('created')}
          >
            Created
          </TableHead>
          <TableHead
            sortable
            sortDirection={getSortDirection('size')}
            onSort={() => toggleSort('size')}
            className="text-end"
          >
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.created}</TableCell>
            <TableCell className="text-end">
              {row.size.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const SortableHeaders: Story = {
  render: () => <SortableHeadersDemo />,
};

const SELECTION_ROWS = [
  { id: 'r1', name: 'web-server-01' },
  { id: 'r2', name: 'db-primary' },
  { id: 'r3', name: 'mail-relay' },
];

// Tri-state "select all" header checkbox driven by per-row selection state:
// unchecked when no rows are selected, `indeterminate` when some (but not all)
// are, checked when every row is. Toggling the header checks/unchecks all rows.
function RowSelectionStatesDemo() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedCount = SELECTION_ROWS.filter((row) => selected[row.id]).length;
  const allSelected = selectedCount === SELECTION_ROWS.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const toggleAll = () =>
    setSelected(
      allSelected
        ? {}
        : Object.fromEntries(SELECTION_ROWS.map((row) => [row.id, true]))
    );

  return (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select all"
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>Workload</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SELECTION_ROWS.map((row) => (
          <TableRow key={row.id} selected={!!selected[row.id]}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${row.name}`}
                checked={!!selected[row.id]}
                onCheckedChange={(value) =>
                  setSelected((previous) => ({ ...previous, [row.id]: !!value }))
                }
              />
            </TableCell>
            <TableCell>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const RowSelectionStates: Story = {
  render: () => <RowSelectionStatesDemo />,
};

/* --------------------------------------------------------- Scrollable body */

interface ScrollRow {
  id: string;
  name: string;
  size: number;
}

const TOTAL_ROWS = 60;
// A page deliberately holds more rows than the scroll viewport can show at
// once, so scrolling within the page is actually necessary (not just a
// pagination-sized coincidence).
const PAGE_SIZE = 20;
const SCROLL_ROWS: ScrollRow[] = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
  id: `row-${i + 1}`,
  name: `Workload ${i + 1}`,
  size: ((i * 37) % 100) + 1,
}));

// A fixed-height, vertically scrolling table body — the header and pagination
// stay put while the rows scroll underneath. `Table` already renders its own
// `overflow-auto` wrapper (for horizontal scroll); nesting a SECOND
// `overflow-auto`/`overflow-y-auto` div around it would give `position: sticky`
// two candidate scrolling ancestors, and it locks onto the nearest one — that
// inner, Table-owned wrapper, which never itself scrolls (it's sized to fit its
// content) — so the header wouldn't stick. Instead, size and scroll Table's OWN
// wrapper directly via a child-selector utility (`[&>div]:...`), so there's
// only one scrolling ancestor. `sticky top-0` goes on each header CELL, not the
// `<tr>` — browsers don't reliably support `position: sticky` on table rows.
function ScrollableBodyDemo() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const pageCount = Math.ceil(SCROLL_ROWS.length / pageSize);
  const pageRows = SCROLL_ROWS.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  return (
    <div className="w-[420px] space-y-4">
      <div className="rounded-md border border-(--ui-table-global-row-border-color) [&>div]:max-h-[220px] [&>div]:overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                Name
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-background text-end">
                Size
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-end">{row.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        totalRows={SCROLL_ROWS.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
}

export const ScrollableBody: Story = {
  render: () => <ScrollableBodyDemo />,
};
