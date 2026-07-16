import { useEffect, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { useSortState } from '@/hooks/use-sort-state';
import { useTableUrlState } from '@/hooks/use-table-url-state';

import { Tag } from '../../tag';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { TablePagination } from '../table-pagination';

interface Workload {
  name: string;
  type: string;
  size: number;
}

const workloads: Workload[] = Array.from({ length: 23 }, (_, i) => ({
  name: `Workload ${i + 1}`,
  type: i % 2 === 0 ? 'Server' : 'Workstation',
  size: ((i * 37) % 100) + 1,
}));

const meta = {
  title: 'UI/Table/State',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------- useSortState */

function SortStateDemo() {
  const { sortedData, getSortDirection, toggleSort } = useSortState({
    data: workloads.slice(0, 5),
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
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell className="text-end">{row.size}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const SortState: Story = {
  render: () => <SortStateDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByRole('columnheader', { name: /Name/ });
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  },
};

/* --------------------------------------------------------- useTableUrlState */

const PAGE_SIZE = 5;

// Storybook's manager forwards unknown query params DOWN to the preview iframe
// on load (pasting `tbl_page=3&...` onto the outer address bar and reloading
// does restore state), but the other direction never reaches the visible
// address bar — `history.pushState` inside a story only updates the iframe's
// own `window.location`, a separate browsing context from the manager's.
// Mirror this demo's `tbl_*` params up to the parent frame (when actually
// embedded in one) after every render, so a real interaction is reflected in
// the address bar the user is looking at, not just the iframe's.
function useSyncUrlToParentFrame() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.top ||
      window.top === window.self
    )
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

function UrlStateDemo() {
  useSyncUrlToParentFrame();
  const { state, setPagination, setSorting } = useTableUrlState({
    defaultPageSize: PAGE_SIZE,
  });
  const sort = state.sorting[0];

  const sorted = useMemo(() => {
    if (!sort) return workloads;
    const factor = sort.desc ? -1 : 1;
    return [...workloads].sort(
      (a, b) =>
        String(a[sort.id as keyof Workload]).localeCompare(
          String(b[sort.id as keyof Workload]),
          undefined,
          { numeric: true }
        ) * factor
    );
  }, [sort]);

  const { pageIndex, pageSize } = state.pagination;
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const toggleSort = (id: string) =>
    setSorting((current) => {
      const active = current[0];
      if (!active || active.id !== id) return [{ id, desc: false }];
      if (!active.desc) return [{ id, desc: true }];
      return [];
    });

  const sortDirection = (id: string) =>
    sort && sort.id === id ? (sort.desc ? 'desc' : 'asc') : (false as const);

  return (
    <div className="w-[560px] space-y-4">
      <p className="text-sm text-muted-foreground">
        Page, sort and filter state is mirrored to the URL query string
        (namespaced <code>tbl_*</code> keys) so the view is bookmarkable.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection={sortDirection('name')}
              onSort={() => toggleSort('name')}
            >
              Name
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead
              sortable
              sortDirection={sortDirection('size')}
              onSort={() => toggleSort('size')}
              className="text-end"
            >
              Size
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell className="text-end">{row.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        totalRows={sorted.length}
        onPageIndexChange={(next) =>
          setPagination((current) => ({ ...current, pageIndex: next }))
        }
        onPageSizeChange={(size) =>
          setPagination(() => ({ pageIndex: 0, pageSize: size }))
        }
      />
    </div>
  );
}

function clearTblParams() {
  const cleanup = new URLSearchParams(window.location.search);
  for (const key of Array.from(cleanup.keys())) {
    if (key.startsWith('tbl_')) cleanup.delete(key);
  }
  const query = cleanup.toString();
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}`
  );
}

// Writing state to the URL: advancing the page pushes a namespaced param.
// `beforeEach` resets any `tbl_*` params first — Storybook runs a story's
// `play` function on every normal view, not just under the test runner, so
// without this, opening this specific story via a pasted/bookmarked
// `tbl_page=N` link would have the click-next-page assertion advance from
// whatever page N was, landing on N+1 instead of the demo's expected "page 2".
// This story exists to demonstrate the *write* action deterministically, not
// to preserve arbitrary incoming state — pasting a URL to see a specific page
// restored (with nothing auto-clicked) belongs on `UrlStateLive` below.
export const UrlStateWrite: Story = {
  beforeEach: () => {
    clearTblParams();
    return clearTblParams;
  },
  render: () => <UrlStateDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Go to next page' })
    );
    await expect(canvas.getByText('Page 2 of 5')).toBeInTheDocument();
    await expect(window.location.search).toContain('tbl_page=2');
  },
};

// Restoring state from a pre-existing URL (the "arrived via bookmarked link"
// case): `beforeEach` seeds the query string before the story renders, so the
// hook reads it in its initial state. `beforeEach` runs after the test-runner's
// per-story navigation and cleans up after itself, so the seed never leaks into
// another story.
export const UrlStateRestore: Story = {
  beforeEach: () => {
    const params = new URLSearchParams(window.location.search);
    params.set('tbl_page', '3');
    params.set('tbl_sort', 'name:desc');
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${params.toString()}`
    );
    return clearTblParams;
  },
  render: () => <UrlStateDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Page 3 of 5')).toBeInTheDocument();
    const nameHeader = canvas.getByRole('columnheader', { name: /Name/ });
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  },
};

// Plain, hook-free render of the same demo — for manually exploring arbitrary
// `tbl_*` query params. `UrlStateWrite`/`UrlStateRestore` above pin a specific,
// deterministic starting state (via `beforeEach`) so their `play` assertions
// are reliable — but that same hook resets/overrides whatever a human happens
// to paste into THIS story's own URL. Paste `tbl_page=4&tbl_sort=size:desc`
// onto this story's address bar (or open it in its own tab via the toolbar's
// "Open canvas in new tab" icon, then edit that tab's URL) to see it restored
// with nothing auto-clicked or reset afterward.
export const UrlStateLive: Story = {
  render: () => <UrlStateDemo />,
};

/* ----------------------------------------------- useSortState (comparators) */

type Severity = 'Critical' | 'Error' | 'Warning' | 'Running';

interface Alert {
  name: string;
  severity: Severity;
}

// Fixed priority rank — the meaningful order for severities, which the default
// alphanumeric comparator (Critical, Error, Running, Warning) would get wrong.
const SEVERITY_RANK: Record<Severity, number> = {
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

const alerts: Alert[] = [
  { name: 'Gamma', severity: 'Warning' },
  { name: 'Alpha', severity: 'Running' },
  { name: 'Delta', severity: 'Critical' },
  { name: 'Beta', severity: 'Error' },
  { name: 'Epsilon', severity: 'Running' },
];

// Kept as a literal string (not `comparator.toString()`) so the canvas shows
// clean, formatted source rather than the runtime's own whitespace/minification.
const SEVERITY_COMPARATOR_SOURCE = `const SEVERITY_RANK = { Critical: 0, Error: 1, Warning: 2, Running: 3 };

useSortState({
  data: alerts,
  comparators: {
    severity: (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  },
});`;

function CustomSorterDemo() {
  const { sortedData, getSortDirection, toggleSort } = useSortState({
    data: alerts,
    comparators: {
      severity: (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
    },
  });
  return (
    <div className="w-[520px] space-y-4">
      <p className="text-sm text-muted-foreground">
        <strong>Name</strong> uses the default alphanumeric comparator;{' '}
        <strong>Severity</strong> uses a custom comparator that sorts by
        priority rank (Critical &gt; Error &gt; Warning &gt; Running), not
        alphabetically.
      </p>
      <pre className="overflow-x-auto rounded-md border border-(--ui-table-global-cell-border-color) bg-muted p-3 text-xs">
        <code>{SEVERITY_COMPARATOR_SOURCE}</code>
      </pre>
      <Table>
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
              sortDirection={getSortDirection('severity')}
              onSort={() => toggleSort('severity')}
            >
              Severity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Tag variant={SEVERITY_VARIANT[row.severity]}>
                  {row.severity}
                </Tag>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Sorting the Severity column ascending yields Critical → Error → Warning →
// Running (priority), not the alphabetic Critical → Error → Running → Warning —
// proving the per-column `comparators` override took effect over the default.
export const CustomSorter: Story = {
  render: () => <CustomSorterDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Severity/ }));
    const order = canvas
      .getAllByRole('row')
      .slice(1) // drop the header row
      .map((row) => row.querySelectorAll('td')[1]?.textContent);
    await expect(order[0]).toBe('Critical');
    await expect(order.indexOf('Warning')).toBeLessThan(
      order.indexOf('Running')
    );
  },
};
