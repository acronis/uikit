import { Profiler, type ReactElement, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../checkbox';
import { useFilterSearchFilters } from '../../filter-search';
import { getResizeKeyboardStep, reorderColumn } from '../data-table';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableExpandTrigger,
  DataTablePagination,
  DataTableToolbar,
  getColumnSizeStyle,
} from '../index';

type Row = { id: string; email: string; amount: number };

const data: Row[] = Array.from({ length: 12 }, (_, i) => ({
  id: `r${i + 1}`,
  email: `user${i + 1}@example.com`,
  amount: (i + 1) * 100,
}));

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

describe('DataTable', () => {
  it('renders the column headers and rows', () => {
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
  });

  it('shows an empty state with no data', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('sorts a DataTableColumnHeader column in a single click', async () => {
    const sortable: ColumnDef<Row>[] = [
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => <span>{row.original.amount}</span>,
      },
    ];
    render(
      <DataTable columns={sortable} data={data.slice(0, 3)} hideActionColumn />
    );
    const cellsBefore = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsBefore).toEqual(['100', '200', '300']);

    // One click sorts ascending (already ascending → flips to descending here).
    await userEvent.click(
      screen.getByRole('button', { name: 'Sort by Amount' })
    );
    const cellsAfter = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsAfter).not.toEqual(cellsBefore);
  });

  it('lets sortLabel override the default accessible name of the sort button', () => {
    const sortable: ColumnDef<Row>[] = [
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Amount"
            sortLabel={(title) => `Nach ${title} sortieren`}
          />
        ),
        cell: ({ row }) => <span>{row.original.amount}</span>,
      },
    ];
    render(<DataTable columns={sortable} data={data.slice(0, 3)} />);
    expect(
      screen.getByRole('button', { name: 'Nach Amount sortieren' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Sort by Amount' })
    ).not.toBeInTheDocument();
  });

  it('hides sort buttons when enableSorting={false}', () => {
    const sortable: ColumnDef<Row>[] = [
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => <span>{row.original.amount}</span>,
      },
    ];
    render(
      <DataTable
        columns={sortable}
        data={data.slice(0, 3)}
        enableSorting={false}
        hideActionColumn
      />
    );
    expect(
      screen.queryByRole('button', { name: /sort/i })
    ).not.toBeInTheDocument();
  });

  it('renders expanded content for an expanded row', async () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          >
            {row.getIsExpanded() ? '-' : '+'}
          </button>
        ),
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <span>Details for {row.original.id}</span>}
      />
    );
    expect(screen.queryByText('Details for r1')).not.toBeInTheDocument();
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Expand row' })[0]
    );
    expect(screen.getByText('Details for r1')).toBeInTheDocument();
  });

  it('root div always has overflow-auto', () => {
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    const root = document.querySelector(
      '[data-slot="data-table"]'
    ) as HTMLElement;
    expect(root).toHaveClass('overflow-auto');
  });

  it('stickyHeader adds sticky classes to the header', () => {
    render(
      <DataTable columns={columns} data={data.slice(0, 3)} stickyHeader />
    );
    const root = document.querySelector(
      '[data-slot="data-table"]'
    ) as HTMLElement;
    expect(root).toHaveClass('h-full');
    const thead = document.querySelector('thead') as HTMLElement;
    expect(thead).toHaveClass('sticky', 'top-0', 'z-10', 'bg-background');
  });

  it('stickyHeader defaults to false — no sticky header classes, no h-full', () => {
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    const root = document.querySelector(
      '[data-slot="data-table"]'
    ) as HTMLElement;
    expect(root).not.toHaveClass('h-full');
    const thead = document.querySelector('thead') as HTMLElement;
    expect(thead).not.toHaveClass('sticky');
  });
});

describe('DataTable external table instance', () => {
  function ExternalTableHarness({ rows }: { rows: Row[] }) {
    const table = useReactTable({
      data: rows,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
    return <DataTable columns={columns} data={rows} table={table} />;
  }

  it('renders from an externally-built table instance like the internal one', () => {
    render(<ExternalTableHarness rows={data.slice(0, 3)} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
  });

  it('treats enableColumnResizing as a no-op when an external table is passed', () => {
    // Regression guard: ColumnSizing is a built-in TanStack feature present on
    // any table instance, so reading the raw `enableColumnResizing` prop
    // against the merged `table` (rather than gating on `externalTable`)
    // would still render live resize handles that mutate the caller's own
    // external instance — contradicting the `table` prop's own no-op list.
    function ExternalResizableHarness() {
      const table = useReactTable({
        data: data.slice(0, 2),
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
      });
      return (
        <DataTable
          columns={columns}
          data={data.slice(0, 2)}
          table={table}
          enableColumnResizing
        />
      );
    }
    render(<ExternalResizableHarness />);
    expect(
      screen.queryByRole('separator', { name: 'Resize column' })
    ).not.toBeInTheDocument();
    // No fixed total-size width style either (only applied when resizing is
    // actually enabled).
    expect(screen.getByRole('table').style.width).toBe('');
  });
});

describe('DataTable manualSorting', () => {
  it('does not reorder rows itself but still fires onSortingChange', async () => {
    const handleSortingChange = vi.fn();
    const sortable: ColumnDef<Row>[] = [
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => <span>{row.original.amount}</span>,
      },
    ];
    render(
      <DataTable
        columns={sortable}
        data={data.slice(0, 3)}
        manualSorting
        sorting={[]}
        onSortingChange={handleSortingChange}
      />
    );
    const cellsBefore = screen.getAllByRole('cell').map((c) => c.textContent);

    await userEvent.click(
      screen.getByRole('button', { name: 'Sort by Amount' })
    );

    // Controlled `sorting` never changed, so DataTable's own comparator (which
    // manualSorting disables anyway) never runs — the row order is untouched.
    const cellsAfter = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsAfter).toEqual(cellsBefore);
    expect(handleSortingChange).toHaveBeenCalledTimes(1);
  });
});

describe('DataTable renderRow', () => {
  it('calls renderRow instead of the default per-cell path, with the right row and rowIndex', () => {
    const renderRow = vi.fn((row: Row, rowIndex: number) => (
      <tr key={row.id} data-testid={`custom-row-${rowIndex}`}>
        <td>{row.email}</td>
      </tr>
    ));
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        renderRow={(row, rowIndex) => renderRow(row.original, rowIndex)}
      />
    );
    // The pinning effect re-renders once after mount (pre-existing behavior,
    // unrelated to renderRow), so assert pairing rather than call count.
    expect(
      renderRow.mock.calls.some(
        ([row, rowIndex]) => row.id === 'r1' && rowIndex === 0
      )
    ).toBe(true);
    expect(
      renderRow.mock.calls.some(
        ([row, rowIndex]) => row.id === 'r2' && rowIndex === 1
      )
    ).toBe(true);
    expect(screen.getByTestId('custom-row-0')).toHaveTextContent(
      'user1@example.com'
    );
    expect(screen.getByTestId('custom-row-1')).toHaveTextContent(
      'user2@example.com'
    );
    // The default per-cell `flexRender` path (which would render the amount
    // column's value) is bypassed entirely.
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  it('does not append an expanded-content row when combined with getRowCanExpand/renderExpandedRow', async () => {
    // Documents an intentional limitation (see the prop's tsdoc): `renderRow`
    // takes over a row's entire markup, so DataTable's own expanded-row
    // insertion is skipped too — the caller must read `row.getIsExpanded()`
    // and render any expanded content itself inside `renderRow`.
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <span>Details for {row.original.id}</span>}
        renderRow={(row, rowIndex) => (
          <tr key={row.id} data-testid={`custom-row-${rowIndex}`}>
            <td>
              <button onClick={row.getToggleExpandedHandler()}>toggle</button>
            </td>
          </tr>
        )}
      />
    );
    await userEvent.click(screen.getAllByRole('button', { name: 'toggle' })[0]);
    expect(screen.queryByText('Details for r1')).not.toBeInTheDocument();
  });
});

describe('DataTable getRowId', () => {
  // A row's own uncontrolled state (here, a toggle) — the thing that should
  // follow the row's DATA identity across a reorder, not the array slot it
  // happened to render into.
  function ToggleCell({ label }: { label: string }) {
    const [on, setOn] = useState(false);
    return (
      <button onClick={() => setOn(!on)}>
        {label}: {on ? 'on' : 'off'}
      </button>
    );
  }

  const rowIdColumns: ColumnDef<Row>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <ToggleCell label={row.original.id} />,
    },
  ];

  it("keeps a row's own state attached to its data across a reorder", async () => {
    const [r1, r2, r3] = data.slice(0, 3);
    const { rerender } = render(
      <DataTable
        columns={rowIdColumns}
        data={[r1, r2, r3]}
        getRowId={(row) => row.id}
        hideActionColumn
      />
    );

    await userEvent.click(screen.getByText('r1: off'));
    expect(screen.getByText('r1: on')).toBeInTheDocument();

    // Same row objects, r1 moved from index 0 to index 2.
    rerender(
      <DataTable
        columns={rowIdColumns}
        data={[r2, r3, r1]}
        getRowId={(row) => row.id}
        hideActionColumn
      />
    );

    expect(screen.getByText('r1: on')).toBeInTheDocument();
    expect(screen.getByText('r2: off')).toBeInTheDocument();
  });

  it("without it, a row's state stays with its array slot instead of following the data", async () => {
    const [r1, r2, r3] = data.slice(0, 3);
    const { rerender } = render(
      <DataTable columns={rowIdColumns} data={[r1, r2, r3]} hideActionColumn />
    );

    await userEvent.click(screen.getByText('r1: off'));
    expect(screen.getByText('r1: on')).toBeInTheDocument();

    // Same reorder as above, but no getRowId this time.
    rerender(
      <DataTable columns={rowIdColumns} data={[r2, r3, r1]} hideActionColumn />
    );

    // The default index-based id means slot 0 (now r2) inherits the "on"
    // state r1 left behind there, instead of r1 keeping it.
    expect(screen.getByText('r2: on')).toBeInTheDocument();
    expect(screen.getByText('r1: off')).toBeInTheDocument();
  });
});

describe('DataTable renderEmptyState', () => {
  it('receives hasFilters=false for an empty, unfiltered table', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        renderEmptyState={({ hasFilters }) => (
          <span>{hasFilters ? 'No matches' : 'Nothing here'}</span>
        )}
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  function FilteredEmptyHarness() {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
      { id: 'email', value: 'nonexistent' },
    ]);
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      state: { columnFilters },
    });
    return (
      <DataTable
        columns={columns}
        data={data}
        table={table}
        renderEmptyState={({ hasFilters }) => (
          <span>{hasFilters ? 'No matches' : 'Nothing here'}</span>
        )}
      />
    );
  }

  it('receives hasFilters=true when a column filter is applied (via an external table)', () => {
    render(<FilteredEmptyHarness />);
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('lets emptyLabel override the default empty-state text', () => {
    render(
      <DataTable columns={columns} data={[]} emptyLabel="Keine Ergebnisse." />
    );
    expect(screen.getByText('Keine Ergebnisse.')).toBeInTheDocument();
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
  });

  it('spans only the visible columns, not hidden ones, for the default empty state', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        columnVisibility={{ amount: false }}
        onColumnVisibilityChange={() => {}}
        hideActionColumn
      />
    );
    const cell = screen.getByText('No results.').closest('td')!;
    expect(cell).toHaveAttribute('colspan', '1');
  });
});

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit
  ) {
    MockIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

describe('DataTable infinite scroll (paginationMode="infinite")', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls onLoadMore when the sentinel intersects', () => {
    const onLoadMore = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        onLoadMore={onLoadMore}
      />
    );
    const [observer] = MockIntersectionObserver.instances;
    observer.trigger(true);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('does not observe when hasNextPage is false', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        onLoadMore={() => {}}
      />
    );
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it('cannot drive the very first fetch — no sentinel/observer when data is empty', () => {
    // The sentinel only renders once rows.length > 0 (data-table.tsx), so a
    // consumer mounting empty with hasNextPage=true (expecting the sentinel
    // to trigger the first fetch) gets the default "No results." row instead
    // — onLoadMore never fires. Documented as intentional in api.yaml/
    // behavior.md; this guards that the underlying condition doesn't drift.
    const onLoadMore = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={[]}
        paginationMode="infinite"
        hasNextPage
        onLoadMore={onLoadMore}
      />
    );
    expect(MockIntersectionObserver.instances).toHaveLength(0);
    expect(screen.getByText('No results.')).toBeInTheDocument();
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('passes loadMoreRootMargin through to the observer', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        onLoadMore={() => {}}
        loadMoreRootMargin="400px"
      />
    );
    const [observer] = MockIntersectionObserver.instances;
    expect(observer.options?.rootMargin).toBe('400px');
  });

  it('does not observe while isLoadingMore, and renders a loading row', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        onLoadMore={() => {}}
      />
    );
    expect(MockIntersectionObserver.instances).toHaveLength(0);
    const loadingRows = Array.from(
      container.querySelectorAll('tbody tr')
    ).filter((row) => row.querySelector('.animate-pulse'));
    expect(loadingRows).toHaveLength(1);
  });

  it('renders one skeleton per column in the loading-more row', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        hideActionColumn
        onLoadMore={() => {}}
      />
    );
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons).toHaveLength(columns.length);
  });

  it('renders loadingMoreRows trailing loading rows', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        loadingMoreRows={3}
        onLoadMore={() => {}}
      />
    );
    const tbody = container.querySelector('tbody')!;
    const loadingRows = Array.from(tbody.querySelectorAll('tr')).filter(
      (row) => row.querySelector('[data-slot="skeleton"]')
    );
    expect(loadingRows).toHaveLength(3);
  });

  it('keeps loading-more rows as table rows, not live regions', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        loadingMoreRows={2}
        onLoadMore={() => {}}
      />
    );
    const tbody = container.querySelector('tbody')!;
    expect(tbody.querySelectorAll('[role="status"], [aria-live]')).toHaveLength(
      0
    );
    expect(within(tbody).getAllByRole('row')).toHaveLength(5);
  });

  it('announces loading more once via an sr-only loadingMoreLabel', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        loadingMoreRows={3}
        onLoadMore={() => {}}
      />
    );
    const labels = screen.getAllByText('Loading more rows…');
    expect(labels).toHaveLength(1);
    expect(labels[0]).toHaveClass('sr-only');
  });

  it('renders no skeletons and no label when loadingMoreRows is 0', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        loadingMoreRows={0}
        onLoadMore={() => {}}
      />
    );
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(
      0
    );
    expect(screen.queryByText('Loading more rows…')).not.toBeInTheDocument();
  });

  it('lets loadingMoreLabel override the announcement text', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        paginationMode="infinite"
        hasNextPage
        isLoadingMore
        loadingMoreLabel="Weitere Zeilen werden geladen…"
        onLoadMore={() => {}}
      />
    );
    expect(screen.getByText('Weitere Zeilen werden geladen…')).toHaveClass(
      'sr-only'
    );
    expect(screen.queryByText('Loading more rows…')).not.toBeInTheDocument();
  });
});

describe('getColumnSizeStyle', () => {
  it('emits only floor/ceiling (no width) for a column with only minSize/maxSize', () => {
    const { result } = renderHook(() =>
      useReactTable<Row>({
        data: [],
        columns: [
          { accessorKey: 'email', header: 'Email', minSize: 120, maxSize: 300 },
        ],
        getCoreRowModel: getCoreRowModel(),
      })
    );
    const style = getColumnSizeStyle(result.current.getColumn('email')!, false);
    expect(style).toEqual({ minWidth: 120, maxWidth: 300 });
    expect(style).not.toHaveProperty('width');
  });

  it('strictly fixes a column with an explicit size', () => {
    const { result } = renderHook(() =>
      useReactTable<Row>({
        data: [],
        columns: [{ accessorKey: 'email', header: 'Email', size: 200 }],
        getCoreRowModel: getCoreRowModel(),
      })
    );
    expect(
      getColumnSizeStyle(result.current.getColumn('email')!, false)
    ).toEqual({ width: 200, minWidth: 200, maxWidth: 200 });
  });

  it('strictly fixes a column whose explicit size equals the TanStack default (150)', () => {
    const { result } = renderHook(() =>
      useReactTable<Row>({
        data: [],
        columns: [{ accessorKey: 'email', header: 'Email', size: 150 }],
        defaultColumn: { size: undefined, minSize: undefined, maxSize: undefined },
        getCoreRowModel: getCoreRowModel(),
      })
    );
    const table = result.current;
    expect(
      getColumnSizeStyle(
        table.getColumn('email')!,
        false,
        table._getDefaultColumnDef()
      )
    ).toEqual({ width: 150, minWidth: 150, maxWidth: 150 });
  });
});

describe('DataTable column resizing', () => {
  it('lets resizeColumnLabel override the default accessible name', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnResizing
        resizeColumnLabel="Spaltengröße ändern"
      />
    );
    expect(
      screen.getAllByRole('separator', { name: 'Spaltengröße ändern' })
    ).toHaveLength(columns.length);
    expect(
      screen.queryByRole('separator', { name: 'Resize column' })
    ).not.toBeInTheDocument();
  });

  it('renders a resize handle on resizable headers when enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnResizing
      />
    );
    expect(
      screen.getAllByRole('separator', { name: 'Resize column' })
    ).toHaveLength(columns.length);
  });

  it('renders no resize handles by default', () => {
    render(<DataTable columns={columns} data={data.slice(0, 2)} />);
    expect(
      screen.queryByRole('separator', { name: 'Resize column' })
    ).not.toBeInTheDocument();
  });

  it('resizes the column when the handle is focused and used', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnResizing
      />
    );
    const handle = screen.getAllByRole('separator', {
      name: 'Resize column',
    })[0];
    const initialSize = Number(handle.getAttribute('aria-valuenow'));

    handle.focus();
    await user.keyboard('{ArrowRight}');
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(initialSize + 10);

    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(initialSize + 60);

    await user.keyboard('{ArrowLeft}');
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(initialSize + 50);
  });

  it('ignores Arrow keys held with Ctrl/Alt/Meta so it does not hijack browser shortcuts', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnResizing
      />
    );
    const handle = screen.getAllByRole('separator', {
      name: 'Resize column',
    })[0];
    const initialSize = Number(handle.getAttribute('aria-valuenow'));

    handle.focus();
    await user.keyboard('{Control>}{ArrowRight}{/Control}');
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
    await user.keyboard('{Meta>}{ArrowRight}{/Meta}');
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(initialSize);
  });

  it('forces a select-id column to a fixed 48px width and never gives it a resize handle', () => {
    const selectColumns: ColumnDef<Row>[] = [
      {
        id: 'select',
        header: () => <Checkbox aria-label="Select all" />,
        cell: () => <Checkbox aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];
    render(
      <DataTable
        columns={selectColumns}
        data={data.slice(0, 2)}
        enableColumnResizing
      />
    );

    const selectHeader = screen.getByLabelText('Select all').closest('th')!;
    expect(selectHeader.style.width).toBe('48px');
    expect(
      within(selectHeader).queryByRole('separator')
    ).not.toBeInTheDocument();

    // The other columns are unaffected and still get their resize handles.
    expect(
      screen.getAllByRole('separator', { name: 'Resize column' })
    ).toHaveLength(columns.length);
  });

  it('honours a consumer-authored size: 150 on the select column', () => {
    const selectColumns: ColumnDef<Row>[] = [
      {
        id: 'select',
        size: 150,
        header: () => <Checkbox aria-label="Select all" />,
        cell: () => <Checkbox aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];
    render(<DataTable columns={selectColumns} data={data.slice(0, 2)} />);

    const selectHeader = screen.getByLabelText('Select all').closest('th')!;
    expect(selectHeader.style.width).toBe('150px');
    expect(selectHeader.style.minWidth).toBe('150px');
    expect(selectHeader.style.maxWidth).toBe('150px');
  });

  it('captures the pointer on the handle instead of flagging the document root', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnResizing
      />
    );
    const handle = screen.getAllByRole('separator', {
      name: 'Resize column',
    })[0];
    const setPointerCapture = vi.fn();
    handle.setPointerCapture = setPointerCapture;

    fireEvent.pointerDown(handle, { pointerId: 7 });
    fireEvent.mouseDown(handle, { clientX: 100 });

    expect(setPointerCapture).toHaveBeenCalledWith(7);
    expect(document.documentElement).not.toHaveAttribute(
      'data-ui-column-resizing'
    );
    fireEvent.mouseUp(document);
  });
});

describe('DataTable column reordering', () => {
  const headerTexts = () =>
    Array.from(screen.getAllByRole('columnheader')).map(
      (cell) => cell.textContent
    );

  // Drives the real handlers the way the browser does: dragStart on the source
  // header, dragOver + drop on the target. `dataTransfer` is supplied because
  // happy-dom's DragEvent doesn't create one.
  const dragHeaderOnto = (from: HTMLElement, to: HTMLElement) => {
    const dataTransfer = { effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(from, { dataTransfer });
    fireEvent.dragOver(to, { dataTransfer });
    fireEvent.drop(to, { dataTransfer });
  };

  it('makes header cells draggable only when enabled', () => {
    const { unmount } = render(
      <DataTable columns={columns} data={data.slice(0, 2)} hideActionColumn />
    );
    expect(
      screen
        .getAllByRole('columnheader')
        .map((cell) => cell.getAttribute('draggable'))
    ).toEqual([null, null]);
    unmount();

    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    expect(
      screen
        .getAllByRole('columnheader')
        .map((cell) => cell.getAttribute('draggable'))
    ).toEqual(['true', 'true']);
  });

  it('reorders the columns when a header is dragged onto another', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    expect(headerTexts()).toEqual(['Email', 'Amount']);

    const [email, amount] = screen.getAllByRole('columnheader');
    dragHeaderOnto(amount, email);

    expect(headerTexts()).toEqual(['Amount', 'Email']);
    // The body cells follow the header order.
    expect(
      within(screen.getAllByRole('row')[1])
        .getAllByRole('cell')
        .map((cell) => cell.textContent)
    ).toEqual(['100', 'user1@example.com']);
  });

  it('reports the new order through onColumnOrderChange', () => {
    const onColumnOrderChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        onColumnOrderChange={onColumnOrderChange}
        hideActionColumn
      />
    );

    const [email, amount] = screen.getAllByRole('columnheader');
    dragHeaderOnto(amount, email);

    expect(onColumnOrderChange).toHaveBeenCalledWith(['amount', 'email']);
  });

  it('honors a controlled columnOrder', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        columnOrder={['amount', 'email']}
        onColumnOrderChange={() => {}}
        hideActionColumn
      />
    );
    expect(headerTexts()).toEqual(['Amount', 'Email']);
  });

  it('leaves pinned columns undraggable', () => {
    const pinnedColumns: ColumnDef<Row>[] = [
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'amount', header: 'Amount', meta: { pin: 'right' } },
    ];
    render(
      <DataTable
        columns={pinnedColumns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const draggable = Object.fromEntries(
      screen
        .getAllByRole('columnheader')
        .map((cell) => [cell.textContent, cell.getAttribute('draggable')])
    );
    expect(draggable).toEqual({ Email: 'true', Amount: null });
  });

  // The browser fires `dragend` on the source even when the drop is cancelled
  // or lands off-target, so that's the only chance to clear the drag visuals.
  it('resets the drag visuals on dragend without a drop', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );

    const [email] = screen.getAllByRole('columnheader');
    const dataTransfer = { effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(email, { dataTransfer });

    expect(email).not.toHaveClass('opacity-50');
    // The capability tooltip stays disabled while a drag is in flight.
    await user.hover(email);
    expect(screen.queryByText('Reorder column:')).not.toBeInTheDocument();

    fireEvent.dragEnd(email, { dataTransfer });

    expect(email).not.toHaveClass('opacity-50');
    await user.unhover(email);
    await user.hover(email);
    expect(await screen.findByText('Reorder column:')).toBeInTheDocument();
  });

  it('marks the header under the pointer as the drop target during dragover', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const [email, amount] = screen.getAllByRole('columnheader');
    const dataTransfer = { effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(amount, { dataTransfer });
    fireEvent.dragOver(email, { dataTransfer });

    expect(email).toHaveAttribute('data-reorder-target');
  });

  it('clears every drop-target marker on dragend without a drop', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const [email, amount] = screen.getAllByRole('columnheader');
    const dataTransfer = { effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(amount, { dataTransfer });
    fireEvent.dragOver(email, { dataTransfer });
    fireEvent.dragOver(amount, { dataTransfer });
    fireEvent.dragEnd(amount, { dataTransfer });

    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
  });

  it('leaves no data-reorder-target on any table after dragend', () => {
    const { container: first } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const { container: second } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const firstHead = first.querySelector('thead') as HTMLElement;
    const secondHead = second.querySelector('thead') as HTMLElement;
    const [email, amount] = within(firstHead).getAllByRole('columnheader');
    const dataTransfer = { effectAllowed: '', dropEffect: '' };

    fireEvent.dragStart(amount, { dataTransfer });
    fireEvent.dragOver(email, { dataTransfer });
    expect(email).toHaveAttribute('data-reorder-target');
    fireEvent.dragEnd(amount, { dataTransfer });

    // Shadow-root scoping of the sweep cannot be verified in jsdom; the
    // `theadRef` approach is verified by code inspection and the comment in
    // endColumnDrag.
    expect(firstHead.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
    expect(secondHead.querySelectorAll('[data-reorder-target]')).toHaveLength(
      0
    );
  });

  it('does not mark a drop target for a drag that started elsewhere', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const [email] = screen.getAllByRole('columnheader');
    fireEvent.dragOver(email, {
      dataTransfer: { effectAllowed: '', dropEffect: '' },
    });

    expect(email).not.toHaveAttribute('data-reorder-target');
  });

  it('clears every drop-target marker on drop', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const [email, amount] = screen.getAllByRole('columnheader');
    dragHeaderOnto(amount, email);

    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
  });

  it('shows a grab cursor on reorderable headers', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    for (const header of screen.getAllByRole('columnheader')) {
      expect(header).toHaveClass('cursor-grab', 'active:cursor-grabbing');
    }
  });

  it('treats enableColumnReordering as a no-op when an external table is passed', () => {
    function Harness() {
      const table = useReactTable({
        data: data.slice(0, 2),
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTable table={table} enableColumnReordering />;
    }
    render(<Harness />);
    expect(
      screen
        .getAllByRole('columnheader')
        .map((cell) => cell.getAttribute('draggable'))
    ).toEqual([null, null]);
  });
});

describe('reorderColumn', () => {
  it('moves a column to the target position', () => {
    expect(reorderColumn(['a', 'b', 'c'], 'c', 'a')).toEqual(['c', 'a', 'b']);
    expect(reorderColumn(['a', 'b', 'c'], 'a', 'c')).toEqual(['b', 'c', 'a']);
  });

  it('returns the order untouched for an unknown or identical id', () => {
    const order = ['a', 'b', 'c'];
    expect(reorderColumn(order, 'z', 'a')).toBe(order);
    expect(reorderColumn(order, 'a', 'z')).toBe(order);
    expect(reorderColumn(order, 'b', 'b')).toBe(order);
  });
});

describe('getResizeKeyboardStep', () => {
  const bounds = { shiftKey: false, min: 20, max: 500 };

  it('steps by 10 on ArrowRight and 10 on ArrowLeft', () => {
    expect(getResizeKeyboardStep('ArrowRight', 100, bounds)).toBe(110);
    expect(getResizeKeyboardStep('ArrowLeft', 100, bounds)).toBe(90);
  });

  it('steps by 50 when shiftKey is held', () => {
    expect(
      getResizeKeyboardStep('ArrowRight', 100, { ...bounds, shiftKey: true })
    ).toBe(150);
    expect(
      getResizeKeyboardStep('ArrowLeft', 100, { ...bounds, shiftKey: true })
    ).toBe(50);
  });

  it('clamps to min on ArrowLeft', () => {
    expect(getResizeKeyboardStep('ArrowLeft', 25, bounds)).toBe(20);
  });

  it('clamps to max on ArrowRight', () => {
    expect(getResizeKeyboardStep('ArrowRight', 495, bounds)).toBe(500);
  });

  it('snaps up to min on ArrowRight when currentSize already started below min', () => {
    // Guards a one-sided-clamp regression: each branch must clamp to the full
    // [min, max] range, not just the bound its own direction moves toward.
    expect(getResizeKeyboardStep('ArrowRight', 5, bounds)).toBe(20);
  });

  it('snaps down to max on ArrowLeft when currentSize already started above max', () => {
    expect(getResizeKeyboardStep('ArrowLeft', 600, bounds)).toBe(500);
  });

  it('returns undefined for any other key', () => {
    expect(getResizeKeyboardStep('Enter', 100, bounds)).toBeUndefined();
    expect(getResizeKeyboardStep('ArrowUp', 100, bounds)).toBeUndefined();
  });
});

describe('DataTable sticky (pinned) columns', () => {
  it('pins the built-in gear and row-actions column to the right by default', async () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        renderRowActions={() => <button>Edit</button>}
      />
    );

    await waitFor(() => {
      const settingsCell = screen
        .getByRole('button', { name: 'Column settings' })
        .closest('th')!;
      expect(settingsCell.style.position).toBe('sticky');
      expect(settingsCell.style.right).toBe('0px');

      const actionsCell = screen
        .getByRole('button', { name: 'Row actions' })
        .closest('td')!;
      expect(actionsCell.style.position).toBe('sticky');
      expect(actionsCell.style.right).toBe('0px');
    });
  });

  it('pins the action column when it is enabled after mount', async () => {
    const { rerender } = render(
      <DataTable columns={columns} data={data.slice(0, 1)} hideActionColumn />
    );
    rerender(<DataTable columns={columns} data={data.slice(0, 1)} />);

    await waitFor(() => {
      const settingsCell = screen
        .getByRole('button', { name: 'Column settings' })
        .closest('th')!;
      expect(settingsCell.style.position).toBe('sticky');
      expect(settingsCell.style.right).toBe('0px');
    });
  });

  it('auto-pins the select column to the left, ignoring meta.pin', async () => {
    const withSelect: ColumnDef<Row>[] = [
      {
        id: 'select',
        header: () => <span>Select all</span>,
        cell: () => <span>Select row</span>,
        meta: { pin: 'right' },
      },
      ...columns,
    ];
    render(
      <DataTable
        columns={withSelect}
        data={data.slice(0, 1)}
        hideActionColumn
      />
    );
    await waitFor(() => {
      const headerCell = screen.getByText('Select all').closest('th')!;
      expect(headerCell.style.position).toBe('sticky');
      expect(headerCell.style.left).toBe('0px');
      const bodyCell = screen.getByText('Select row').closest('td')!;
      expect(bodyCell.style.position).toBe('sticky');
      expect(bodyCell.style.left).toBe('0px');
    });
  });

  it('gives a second left-pinned column the correct sticky offset after select', async () => {
    const withSelectAndPin: ColumnDef<Row>[] = [
      {
        id: 'select',
        header: () => <span>Select all</span>,
        cell: () => <span>Select row</span>,
      },
      { accessorKey: 'email', header: 'Email', meta: { pin: 'left' } },
      { accessorKey: 'amount', header: 'Amount' },
    ];
    render(
      <DataTable
        columns={withSelectAndPin}
        data={data.slice(0, 1)}
        hideActionColumn
      />
    );
    await waitFor(() => {
      const emailHeader = screen.getByText('Email').closest('th')!;
      expect(emailHeader.style.position).toBe('sticky');
      // select is 48px, so Email should be at left: 48px, not 150px (TanStack default)
      expect(emailHeader.style.left).toBe('48px');
    });
  });

  it('applies position:sticky to a column pinned via meta', async () => {
    const pinned: ColumnDef<Row>[] = [
      { accessorKey: 'email', header: 'Email', meta: { pin: 'left' } },
      { accessorKey: 'amount', header: 'Amount' },
    ];
    render(<DataTable columns={pinned} data={data.slice(0, 2)} />);
    await waitFor(() => {
      const header = screen.getByText('Email').closest('th')!;
      expect(header.style.position).toBe('sticky');
      expect(header.style.left).toBe('0px');
    });
    // The unpinned column stays static.
    expect(screen.getByText('Amount').closest('th')!.style.position).toBe('');
  });

  it('un-pins a column when meta.pin is removed dynamically', async () => {
    const pinned: ColumnDef<Row>[] = [
      { accessorKey: 'email', header: 'Email', meta: { pin: 'left' } },
      { accessorKey: 'amount', header: 'Amount' },
    ];
    const unpinned: ColumnDef<Row>[] = [
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'amount', header: 'Amount' },
    ];
    const { rerender } = render(
      <DataTable columns={pinned} data={data.slice(0, 2)} />
    );
    await waitFor(() => {
      expect(screen.getByText('Email').closest('th')!.style.position).toBe(
        'sticky'
      );
    });

    // Guards a regression back to only ever calling `column.pin()` when
    // `meta.pin` is truthy, which pins but never un-pins.
    rerender(<DataTable columns={unpinned} data={data.slice(0, 2)} />);
    await waitFor(() => {
      expect(screen.getByText('Email').closest('th')!.style.position).toBe('');
    });
  });

  it("leaves an external table instance's own pinning alone", async () => {
    // Regression guard: the pinning effect used to run against `table =
    // externalTable ?? internalTable` unconditionally, forcing every leaf
    // column's pin state to `meta.pin ?? false` — silently un-pinning a
    // column the caller pinned outside of `meta.pin` (here, via TanStack's
    // own `initialState.columnPinning` — the table manages this state
    // internally since neither `state.columnPinning` nor
    // `onColumnPinningChange` is passed, so `column.pin()` calls actually
    // mutate it, unlike a fully controlled state with no `onChange`).
    function ExternalPinningHarness() {
      const table = useReactTable({
        data: data.slice(0, 2),
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: { columnPinning: { left: ['email'] } },
      });
      return (
        <DataTable columns={columns} data={data.slice(0, 2)} table={table} />
      );
    }
    render(<ExternalPinningHarness />);
    await waitFor(() => {
      expect(screen.getByText('Email').closest('th')!.style.position).toBe(
        'sticky'
      );
    });
  });

  it('hides a column when columnVisibility is controlled externally', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        columnVisibility={{}}
        onColumnVisibilityChange={() => {}}
      />
    );
    expect(screen.getByText('Email')).toBeInTheDocument();

    // Mirrors an external toolbar driving the same `columnVisibility` state
    // DataTable renders from — the bug this guards against was DataTable
    // owning its own internal copy that an external toggle never reached.
    rerender(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        columnVisibility={{ email: false }}
        onColumnVisibilityChange={() => {}}
      />
    );
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });
});

describe('DataTable action column', () => {
  it('renders the column-settings cog by default, with no explicit settings column', () => {
    render(<DataTable columns={columns} data={data.slice(0, 2)} />);
    expect(
      screen.getByRole('button', { name: 'Column settings' })
    ).toBeInTheDocument();
  });

  it('omits the action column entirely when hideActionColumn is set', () => {
    render(
      <DataTable columns={columns} data={data.slice(0, 2)} hideActionColumn />
    );
    expect(
      screen.queryByRole('button', { name: 'Column settings' })
    ).not.toBeInTheDocument();
    // Two data columns, no trailing action column.
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('reserves the action cell but renders no trigger when renderRowActions is omitted', () => {
    render(<DataTable columns={columns} data={data.slice(0, 2)} />);
    expect(
      screen.queryByRole('button', { name: 'Row actions' })
    ).not.toBeInTheDocument();
  });

  it("renders each row's ellipsis trigger with the caller's menu content", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        renderRowActions={(row) => <div>Edit {row.original.email}</div>}
      />
    );
    const triggers = screen.getAllByRole('button', { name: 'Row actions' });
    expect(triggers).toHaveLength(2);

    await user.click(triggers[0]);
    expect(screen.getByText('Edit user1@example.com')).toBeInTheDocument();
  });

  it('localizes the ellipsis and cog accessible names', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        renderRowActions={() => <div>Edit</div>}
        rowActionsLabel="Zeilenaktionen"
        columnSettingsLabel="Spalteneinstellungen"
      />
    );
    expect(
      screen.getByRole('button', { name: 'Zeilenaktionen' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Spalteneinstellungen' })
    ).toBeInTheDocument();
  });

  it('is a no-op when an external table is passed', () => {
    function Harness() {
      const table = useReactTable({
        data: data.slice(0, 2),
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTable table={table} renderRowActions={() => <div />} />;
    }
    render(<Harness />);
    expect(
      screen.queryByRole('button', { name: 'Column settings' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Row actions' })
    ).not.toBeInTheDocument();
  });
});

describe('DataTable column overflow (meta.overflow)', () => {
  const overflowColumns: ColumnDef<Row>[] = [
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'amount',
      header: 'Amount',
      meta: { overflow: 'wrap' },
      cell: ({ row }) => <span>{row.original.amount}</span>,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Identifier" />
      ),
      meta: { overflow: 'hidden' },
      size: 120,
    },
  ];

  it('wraps the header and cells of a column with meta.overflow "wrap"', () => {
    render(<DataTable columns={overflowColumns} data={data.slice(0, 1)} />);
    expect(screen.getByText('100').closest('td')).toHaveClass(
      'whitespace-normal'
    );
    expect(screen.getByText('Amount').closest('th')).toHaveClass(
      'whitespace-normal'
    );
  });

  it('clips the header and cells of a column with meta.overflow "hidden"', () => {
    render(<DataTable columns={overflowColumns} data={data.slice(0, 1)} />);
    const cell = screen.getByText('r1').closest('td');
    expect(cell).toHaveClass('max-w-0', 'overflow-hidden', 'whitespace-nowrap');
    expect(cell).not.toHaveClass('whitespace-normal');
    const header = screen.getByText('Identifier').closest('th');
    expect(header).toHaveClass(
      'max-w-0',
      'overflow-hidden',
      'whitespace-nowrap'
    );
  });

  it("defaults a column without meta.overflow to 'truncate'", () => {
    render(<DataTable columns={overflowColumns} data={data.slice(0, 1)} />);
    // Height comes from padding + line-height (no `h-*`, which Gecko/WebKit
    // inflate by the row border in border-collapse tables).
    const plainCell = screen.getByText('user1@example.com').closest('td');
    const plainHeader = screen.getByText('Email').closest('th');
    for (const el of [plainCell, plainHeader]) {
      expect(el).not.toHaveClass('whitespace-normal');
      expect(el).toHaveClass('overflow-hidden', 'whitespace-nowrap');
      expect(el).not.toHaveClass('max-w-0');
    }
    expect(plainCell).toHaveClass(
      'py-[var(--ui-table-global-cell-padding-y)]',
      'leading-6'
    );
    expect(plainCell).not.toHaveClass('truncate');
  });

  it('keeps the column-header sort button free of a fixed height and shrinkable', () => {
    render(<DataTable columns={overflowColumns} data={data.slice(0, 1)} />);
    const button = screen.getByRole('button', { name: 'Sort by Identifier' });
    expect(button).not.toHaveClass('h-8');
    expect(button).toHaveClass('min-w-0', 'max-w-full');
    expect(within(button).getByText('Identifier')).toHaveClass(
      'min-w-0',
      'overflow-hidden'
    );
  });

  describe('accessibility', () => {
    it('keeps the clipped column header named and keyboard-sortable', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={overflowColumns} data={data.slice(0, 3)} />);
      const header = screen.getByRole('columnheader', { name: /Identifier/ });
      const button = within(header).getByRole('button', {
        name: 'Sort by Identifier',
      });
      expect(button).toHaveAttribute('type', 'button');
      button.focus();
      expect(button).toHaveFocus();
      expect(button.querySelector('svg')).toHaveClass(
        'text-[var(--ui-table-header-sort-icon-color-inactive)]'
      );
      await user.keyboard('{Enter}');
      expect(button.querySelector('svg')).toHaveClass(
        'text-[var(--ui-table-header-sort-icon-color-active)]'
      );
    });
  });
});

describe('DataTable resize-handle focus treatment', () => {
  it('uses an inset focus ring so the handle outline is not clipped', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        enableColumnResizing
      />
    );

    const handle = screen.getAllByRole('separator', {
      name: 'Resize column',
    })[0];
    expect(handle).toHaveClass('focus-visible:outline-none');
    expect(handle).toHaveClass('focus-visible:ring-inset');
    expect(handle).toHaveClass('focus-visible:ring-[3px]');
    expect(handle).toHaveClass('focus-visible:ring-[var(--ui-focus-primary)]');
    expect(handle).not.toHaveClass('focus-visible:outline-[3px]');
  });
});

describe('DataTable resize active header state', () => {
  it('sets data-resizing on the parent <th> while the pointer is captured', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        enableColumnResizing
      />
    );

    const handle = screen.getAllByRole('separator', {
      name: 'Resize column',
    })[0];
    const th = handle.closest('th')!;

    fireEvent.pointerDown(handle, { pointerId: 1 });
    expect(th).toHaveAttribute('data-resizing');

    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(th).not.toHaveAttribute('data-resizing');
  });

  it('removes data-resizing on pointercancel', () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        enableColumnResizing
      />
    );

    const handle = screen.getAllByRole('separator', {
      name: 'Resize column',
    })[0];
    const th = handle.closest('th')!;

    fireEvent.pointerDown(handle, { pointerId: 1 });
    expect(th).toHaveAttribute('data-resizing');

    fireEvent.pointerCancel(handle, { pointerId: 1 });
    expect(th).not.toHaveAttribute('data-resizing');
  });
});

describe('DataTableExpandTrigger', () => {
  it('lets its accessible labels be localized', async () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <DataTableExpandTrigger
            row={row}
            expandLabel="Zeile ausklappen"
            collapseLabel="Zeile einklappen"
          />
        ),
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={() => <span>detail</span>}
      />
    );
    const trigger = screen.getAllByRole('button', {
      name: 'Zeile ausklappen',
    })[0];
    await userEvent.click(trigger);
    expect(
      screen.getAllByRole('button', { name: 'Zeile einklappen' })[0]
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Expand row' })
    ).not.toBeInTheDocument();
  });

  it('toggles row expansion from a column cell', async () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => <DataTableExpandTrigger row={row} />,
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={(row) => <span>Details for {row.original.id}</span>}
      />
    );
    expect(screen.queryByText('Details for r1')).not.toBeInTheDocument();
    const trigger = screen.getAllByRole('button', { name: 'Expand row' })[0];
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(screen.getByText('Details for r1')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Collapse row' })[0]
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('rotates the chevron on expand instead of swapping icons', async () => {
    // Mirrors SidebarSecondary's section-trigger pattern: one chevron rotated
    // via CSS, not two icons swapped outright.
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => <DataTableExpandTrigger row={row} />,
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => true}
        renderExpandedRow={() => null}
      />
    );
    const trigger = screen.getAllByRole('button', { name: 'Expand row' })[0];
    expect(trigger.querySelector('svg')).toHaveClass('ltr:-rotate-90');

    await userEvent.click(trigger);
    const collapseTrigger = screen.getAllByRole('button', {
      name: 'Collapse row',
    })[0];
    expect(collapseTrigger.querySelector('svg')).not.toHaveClass(
      'ltr:-rotate-90'
    );
  });

  it('renders nothing when the row cannot expand', () => {
    const expandable: ColumnDef<Row>[] = [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => <DataTableExpandTrigger row={row} />,
      },
      { accessorKey: 'email', header: 'Email' },
    ];
    render(
      <DataTable
        columns={expandable}
        data={data.slice(0, 2)}
        getRowCanExpand={() => false}
        renderExpandedRow={() => null}
      />
    );
    expect(
      screen.queryByRole('button', { name: 'Expand row' })
    ).not.toBeInTheDocument();
  });
});

describe('DataTable presentational features', () => {
  it('stripes alternating rows', () => {
    render(<DataTable columns={columns} data={data.slice(0, 4)} striped />);
    const secondRow = screen.getByText('user2@example.com').closest('tr')!;
    const firstRow = screen.getByText('user1@example.com').closest('tr')!;
    expect(secondRow.className).toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
    expect(firstRow.className).not.toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
  });

  it('adds vertical borders when bordered', () => {
    const { container } = render(
      <DataTable columns={columns} data={data.slice(0, 2)} bordered />
    );
    const wrapper = container.querySelector(
      '[data-slot="data-table"]'
    ) as HTMLElement;
    expect(wrapper.className).toContain('[&_td:not(:last-child)]:border-e');
  });

  it('renders skeleton placeholder rows instead of data', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        skeleton
        skeletonRows={3}
        hideActionColumn
      />
    );
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    // 3 rows × 2 columns of pulse bars
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
  });

  it('renders the skeleton placeholders with the Skeleton component', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        skeleton
        skeletonRows={3}
        hideActionColumn
      />
    );
    expect(
      container.querySelectorAll('tbody [data-slot="skeleton"]')
    ).toHaveLength(6);
  });

  it('pads skeleton placeholders to the 24px line box so rows keep the 40px height', () => {
    // Cells carry no fixed height (it inflates rows in Gecko/WebKit), so a bare
    // h-4 block would collapse the row to 32px.
    const { container } = render(
      <DataTable columns={columns} data={data} skeleton skeletonRows={1} />
    );
    container
      .querySelectorAll('tbody [data-slot="skeleton"]')
      .forEach((el) => expect(el).toHaveClass('my-1', 'h-4'));
  });

  describe('renderSkeletonCell', () => {
    const selectColumns: ColumnDef<Row>[] = [
      {
        id: 'select',
        header: () => <Checkbox aria-label="Select all" />,
        cell: () => <Checkbox aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];

    const collectCalls = (spy: ReturnType<typeof vi.fn>) =>
      spy.mock.calls.map(([ctx]) => {
        const { column, rowIndex } = ctx as {
          column: { id: string };
          rowIndex: number;
        };
        return `${column.id}:${rowIndex}`;
      });

    // DataTable commits more than once on mount (the `meta.pin` sync effect
    // calls `column.pin()`, which updates state). A Profiler counts those
    // commits independently of the spy, so the spy's total can be pinned
    // exactly: one call per (row, column) pair per commit, in row-major order.
    const renderCountingCommits = (ui: ReactElement) => {
      let commits = 0;
      render(
        <Profiler id="data-table" onRender={() => (commits += 1)}>
          {ui}
        </Profiler>
      );
      return () => commits;
    };

    const expectOneCallPerCellPerCommit = (
      spy: ReturnType<typeof vi.fn>,
      expected: string[],
      commits: number
    ) => {
      const calls = collectCalls(spy);
      expect(commits).toBeGreaterThan(0);
      expect(calls).toHaveLength(expected.length * commits);
      for (let i = 0; i < commits; i++) {
        expect(
          calls.slice(i * expected.length, (i + 1) * expected.length)
        ).toEqual(expected);
      }
    };

    it('replaces the default Skeleton with the custom content in every skeleton cell', () => {
      const { container } = render(
        <DataTable
          columns={columns}
          data={data}
          skeleton
          skeletonRows={3}
          hideActionColumn
          renderSkeletonCell={() => (
            <div data-testid="custom-skel" aria-hidden="true" />
          )}
        />
      );
      const cells = container.querySelectorAll('tbody td');
      expect(cells).toHaveLength(6);
      cells.forEach((td) =>
        expect(
          td.querySelector('[data-testid="custom-skel"]')
        ).toBeInTheDocument()
      );
      expect(screen.getAllByTestId('custom-skel')).toHaveLength(6);
      expect(
        container.querySelectorAll('tbody [data-slot="skeleton"]')
      ).toHaveLength(0);
      expect(container.querySelectorAll('.animate-pulse')).toHaveLength(0);
    });

    it('is called once per visible leaf column per skeleton row, with a 0-based rowIndex', () => {
      const spy = vi.fn(() => null);
      const getCommits = renderCountingCommits(
        <DataTable
          columns={selectColumns}
          data={data}
          skeleton
          skeletonRows={2}
          renderSkeletonCell={spy}
        />
      );
      const ids = ['select', 'email', 'amount', '__actions'];
      const expected = [0, 1].flatMap((r) => ids.map((id) => `${id}:${r}`));
      expectOneCallPerCellPerCommit(spy, expected, getCommits());
    });

    it('skips the __actions column when hideActionColumn is set', () => {
      const spy = vi.fn(() => null);
      const getCommits = renderCountingCommits(
        <DataTable
          columns={columns}
          data={data}
          skeleton
          skeletonRows={2}
          hideActionColumn
          renderSkeletonCell={spy}
        />
      );
      expectOneCallPerCellPerCommit(
        spy,
        ['email:0', 'amount:0', 'email:1', 'amount:1'],
        getCommits()
      );
    });

    it('is never called for a hidden column', () => {
      const spy = vi.fn(() => null);
      const getCommits = renderCountingCommits(
        <DataTable
          columns={columns}
          data={data}
          skeleton
          skeletonRows={2}
          hideActionColumn
          columnVisibility={{ amount: false }}
          renderSkeletonCell={spy}
        />
      );
      expectOneCallPerCellPerCommit(spy, ['email:0', 'email:1'], getCommits());
      expect(collectCalls(spy).some((c) => c.startsWith('amount:'))).toBe(
        false
      );
    });

    it('is not called when skeleton is not set, and data renders', () => {
      const spy = vi.fn(() => null);
      render(
        <DataTable
          columns={columns}
          data={data.slice(0, 2)}
          renderSkeletonCell={spy}
        />
      );
      expect(spy).not.toHaveBeenCalled();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });

    it('leaves the cell empty when it returns null (no Skeleton fallback)', () => {
      const { container } = render(
        <DataTable
          columns={columns}
          data={data}
          skeleton
          skeletonRows={1}
          hideActionColumn
          renderSkeletonCell={() => null}
        />
      );
      const cells = container.querySelectorAll('tbody td');
      expect(cells).toHaveLength(2);
      cells.forEach((td) => expect(td).toBeEmptyDOMElement());
      expect(
        container.querySelectorAll('tbody [data-slot="skeleton"]')
      ).toHaveLength(0);
    });

    it("keeps the column's meta.overflow mode on its skeleton cell", () => {
      const overflowColumns: ColumnDef<Row>[] = [
        { accessorKey: 'email', header: 'Email', meta: { overflow: 'hidden' } },
        { accessorKey: 'amount', header: 'Amount' },
      ];
      const { container } = render(
        <DataTable
          columns={overflowColumns}
          data={data}
          skeleton
          skeletonRows={1}
          hideActionColumn
          renderSkeletonCell={() => <div aria-hidden="true" />}
        />
      );
      const [emailCell, amountCell] = Array.from(
        container.querySelectorAll('tbody td')
      );
      expect(emailCell).toHaveClass('max-w-0', 'overflow-hidden');
      expect(amountCell).not.toHaveClass('max-w-0');
    });
  });

  it('drops the bottom border on every header row but the last when headers are grouped', () => {
    const grouped: ColumnDef<Row>[] = [
      {
        id: 'details',
        header: 'Details',
        columns: [
          { accessorKey: 'email', header: 'Email' },
          { accessorKey: 'amount', header: 'Amount' },
        ],
      },
    ];
    const { container } = render(
      <DataTable columns={grouped} data={data.slice(0, 2)} hideActionColumn />
    );
    const headerRows = container.querySelectorAll('thead tr');
    expect(headerRows.length).toBeGreaterThan(1);
    const classes = (el: Element) => el.className.split(/\s+/);
    expect(classes(headerRows[0])).toContain('border-b-0');
    expect(classes(headerRows[headerRows.length - 1])).not.toContain(
      'border-b-0'
    );
  });

  it('keeps the bottom border on a flat (single-row) header', () => {
    const { container } = render(
      <DataTable columns={columns} data={data.slice(0, 2)} hideActionColumn />
    );
    const headerRows = container.querySelectorAll('thead tr');
    expect(headerRows).toHaveLength(1);
    expect(headerRows[0].className.split(/\s+/)).not.toContain('border-b-0');
  });

  it('highlights the clicked row when highlightCurrentRow', async () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        highlightCurrentRow
      />
    );
    const row = screen.getByText('user2@example.com').closest('tr')!;
    // Exact class token — the primitive carries `active:bg-[…row-color-active]`
    // for its pressed pseudo-state, so a substring check would collide.
    const current = 'bg-[var(--ui-table-data-row-color-active)]';
    const classes = (el: HTMLElement) => el.className.split(/\s+/);
    expect(classes(row)).not.toContain(current);
    await userEvent.click(row);
    expect(classes(row)).toContain(current);
  });
});

describe('DataTable keyboard-focusable rows', () => {
  it('makes only the first row a Tab stop by default, the rest programmatically focusable', () => {
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    const rowsEls = screen.getAllByRole('row').slice(1); // drop the header row
    expect(rowsEls[0]).toHaveAttribute('tabIndex', '0');
    expect(rowsEls[1]).toHaveAttribute('tabIndex', '-1');
    expect(rowsEls[2]).toHaveAttribute('tabIndex', '-1');
  });

  it('paints the focus-ring utility classes on a row (inherited from TableRow)', () => {
    render(<DataTable columns={columns} data={data.slice(0, 2)} />);
    const row = screen.getAllByRole('row')[1];
    expect(row.className).toContain('focus-visible:ring-[3px]');
  });

  it('moves focus and the roving tabIndex to the next row on ArrowDown', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    const rowsEls = screen.getAllByRole('row').slice(1);
    rowsEls[0].focus();
    expect(rowsEls[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(rowsEls[1]).toHaveFocus();
    expect(rowsEls[1]).toHaveAttribute('tabIndex', '0');
    expect(rowsEls[0]).toHaveAttribute('tabIndex', '-1');

    await user.keyboard('{ArrowDown}');
    expect(rowsEls[2]).toHaveFocus();

    // Clamped at the last row — no wraparound.
    await user.keyboard('{ArrowDown}');
    expect(rowsEls[2]).toHaveFocus();
  });

  it('moves focus to the previous row on ArrowUp, clamped at the first row', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    const rowsEls = screen.getAllByRole('row').slice(1);
    rowsEls[2].focus();

    await user.keyboard('{ArrowUp}');
    expect(rowsEls[1]).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(rowsEls[0]).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(rowsEls[0]).toHaveFocus();
  });

  it('Tab moves focus into the row group once and out again, not row-by-row', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Before</button>
        <DataTable columns={columns} data={data.slice(0, 3)} hideActionColumn />
        <button>After</button>
      </div>
    );
    const rowsEls = screen.getAllByRole('row').slice(1);
    screen.getByRole('button', { name: 'Before' }).focus();

    await user.tab();
    expect(rowsEls[0]).toHaveFocus();

    // The row group is a single Tab stop — Tab again exits it entirely
    // (only the roving row has tabIndex 0; the rest are -1).
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('does not make skeleton placeholder rows focusable', () => {
    render(
      <DataTable columns={columns} data={data} skeleton skeletonRows={3} />
    );
    const rowsEls = screen.getAllByRole('row').slice(1);
    rowsEls.forEach((row) => {
      expect(row).not.toHaveAttribute('tabIndex');
    });
  });

  it('does not make custom skeleton rows focusable or announce their content', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        skeleton
        skeletonRows={3}
        renderSkeletonCell={() => (
          <span aria-hidden="true">
            <span role="img">Loading placeholder</span>
          </span>
        )}
      />
    );
    const rowsEls = screen.getAllByRole('row').slice(1);
    expect(rowsEls).toHaveLength(3);
    rowsEls.forEach((row) => {
      expect(row).not.toHaveAttribute('tabIndex');
    });
    const tbody = container.querySelector('tbody')!;
    expect(tbody.querySelectorAll('[role="status"], [aria-live]')).toHaveLength(
      0
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(
      within(tbody).queryByRole('img', { name: 'Loading placeholder' })
    ).not.toBeInTheDocument();
  });

  it('does not make the empty-state row focusable', () => {
    render(<DataTable columns={columns} data={[]} />);
    const emptyRow = screen.getByText('No results.').closest('tr')!;
    expect(emptyRow).not.toHaveAttribute('tabIndex');
  });

  it('keeps highlightCurrentRow selection working alongside keyboard focus', async () => {
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        highlightCurrentRow
      />
    );
    const row = screen.getByText('user2@example.com').closest('tr')!;
    const current = 'bg-[var(--ui-table-data-row-color-active)]';
    await userEvent.click(row);
    expect(row.className.split(/\s+/)).toContain(current);
    expect(row).toHaveAttribute('tabIndex', '0');
  });

  it('syncs the roving tabIndex to a row focused by mouse click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data.slice(0, 3)} />);
    const rowsEls = screen.getAllByRole('row').slice(1);
    expect(rowsEls[0]).toHaveAttribute('tabIndex', '0');

    // A tabIndex={-1} element is still focusable via a direct click/.focus().
    await user.click(rowsEls[2]);
    expect(rowsEls[2]).toHaveAttribute('tabIndex', '0');
    expect(rowsEls[0]).toHaveAttribute('tabIndex', '-1');
  });

  describe('arrow keys from a control inside a cell', () => {
    const withInput: ColumnDef<Row>[] = [
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <input
            aria-label={`amount-${row.original.id}`}
            defaultValue={row.original.amount}
            type="number"
          />
        ),
      },
    ];

    it('does not steal focus from an inner input on ArrowDown', async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          columns={withInput}
          data={data.slice(0, 3)}
          hideActionColumn
        />
      );
      const rowsEls = screen.getAllByRole('row').slice(1);
      const input = screen.getByLabelText('amount-r2');
      await user.click(input);
      expect(input).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(input).toHaveFocus();
      expect(rowsEls[2]).not.toHaveFocus();
      expect(rowsEls[2]).toHaveAttribute('tabIndex', '-1');
      // The clicked row stayed the roving row — focus never roamed.
      expect(rowsEls[1]).toHaveAttribute('tabIndex', '0');
    });

    it('does not steal focus from an inner input on ArrowUp', async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          columns={withInput}
          data={data.slice(0, 3)}
          hideActionColumn
        />
      );
      const rowsEls = screen.getAllByRole('row').slice(1);
      const input = screen.getByLabelText('amount-r2');
      await user.click(input);

      await user.keyboard('{ArrowUp}');
      expect(input).toHaveFocus();
      expect(rowsEls[0]).not.toHaveFocus();
      expect(rowsEls[0]).toHaveAttribute('tabIndex', '-1');
    });

    it('still roams when the row itself is focused in a table with inner controls', async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          columns={withInput}
          data={data.slice(0, 3)}
          hideActionColumn
        />
      );
      const rowsEls = screen.getAllByRole('row').slice(1);
      rowsEls[0].focus();

      await user.keyboard('{ArrowDown}');
      expect(rowsEls[1]).toHaveFocus();
    });
  });
});

describe('DataTable onRowClick and onRowActivate', () => {
  const columnsWithButton: ColumnDef<Row>[] = [
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'open',
      header: 'Open',
      cell: ({ row }) => <button type="button">Open {row.original.id}</button>,
    },
  ];

  const bodyRow = (text: string) => screen.getByText(text).closest('tr')!;

  it('onRowClick fires on row click with the clicked row', async () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        onRowClick={onRowClick}
      />
    );
    await userEvent.click(screen.getByText('user2@example.com'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    const [row, event] = onRowClick.mock.calls[0];
    expect(row.original.id).toBe('r2');
    expect(event.type).toBe('click');
  });

  it('gives rows a pointer cursor only when onRowClick is set', () => {
    const { rerender } = render(
      <DataTable columns={columns} data={data.slice(0, 1)} />
    );
    const classes = () => bodyRow('user1@example.com').className.split(/\s+/);
    expect(classes()).not.toContain('cursor-pointer');
    rerender(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        onRowClick={vi.fn()}
      />
    );
    expect(classes()).toContain('cursor-pointer');
  });

  it('onRowClick fires on the row only when the target is not an interactive descendant', async () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columnsWithButton}
        data={data.slice(0, 2)}
        onRowClick={onRowClick}
        hideActionColumn
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open r1' }));
    expect(onRowClick).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText('user1@example.com'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0].original.id).toBe('r1');
  });

  it('onRowClick does not fire on the row actions trigger', async () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        onRowClick={onRowClick}
        renderRowActions={() => <span>Edit</span>}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Row actions' }));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('onRowClick does not fire when the click originates from a portaled element', async () => {
    // A React portal renders its children outside the <tr> in the DOM, but the
    // synthetic event still bubbles through the React tree to the row's onClick.
    // The portal guard (!row.contains(target)) must catch this case.
    const onRowClick = vi.fn();
    // Render a portal button as a cell — it's in the React tree (inside the row)
    // but its DOM node lands in document.body, outside the <tr>.
    const PortalCell = () =>
      createPortal(
        <button data-testid="portal-btn">Portal action</button>,
        document.body
      );
    const columnsWithPortal: ColumnDef<Row>[] = [
      ...columns,
      { id: 'portal-col', cell: () => <PortalCell />, header: 'Portal' },
    ];
    render(
      <DataTable
        columns={columnsWithPortal}
        data={data.slice(0, 1)}
        onRowClick={onRowClick}
      />
    );
    await userEvent.click(screen.getByTestId('portal-btn'));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('onRowClick does not fire while text is selected', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        onRowClick={onRowClick}
      />
    );
    const getSelection = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue({ toString: () => 'user1' } as Selection);
    try {
      fireEvent.click(screen.getByText('user1@example.com'));
      expect(onRowClick).not.toHaveBeenCalled();
    } finally {
      getSelection.mockRestore();
    }
    fireEvent.click(screen.getByText('user1@example.com'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('onRowActivate fires on Enter on the focused row (via keyboard)', async () => {
    const user = userEvent.setup();
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        onRowActivate={onRowActivate}
      />
    );
    const rowEl = bodyRow('user2@example.com');
    rowEl.focus();
    await user.keyboard('{Enter}');
    expect(onRowActivate).toHaveBeenCalledTimes(1);
    const [row, details] = onRowActivate.mock.calls[0];
    expect(row.original.id).toBe('r2');
    expect(details.via).toBe('keyboard');
    expect(details.event.type).toBe('keydown');
    expect(details.event.key).toBe('Enter');
  });

  it('onRowActivate ignores a repeated (held) Enter', () => {
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        onRowActivate={onRowActivate}
      />
    );
    fireEvent.keyDown(bodyRow('user1@example.com'), {
      key: 'Enter',
      repeat: true,
    });
    expect(onRowActivate).not.toHaveBeenCalled();
  });

  it('onRowActivate fires on double-click (via pointer)', async () => {
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 3)}
        onRowActivate={onRowActivate}
      />
    );
    // dblClick selects the word under the pointer (as browsers do), so this
    // also covers activation not being blocked by the text-selection guard.
    await userEvent.dblClick(screen.getByText('user3@example.com'));
    expect(onRowActivate).toHaveBeenCalledTimes(1);
    const [row, details] = onRowActivate.mock.calls[0];
    expect(row.original.id).toBe('r3');
    expect(details.via).toBe('pointer');
    expect(details.event.type).toBe('dblclick');
  });

  it('onRowActivate does not fire on double-click of an interactive descendant', async () => {
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columnsWithButton}
        data={data.slice(0, 1)}
        onRowActivate={onRowActivate}
        hideActionColumn
      />
    );
    await userEvent.dblClick(screen.getByRole('button', { name: 'Open r1' }));
    expect(onRowActivate).not.toHaveBeenCalled();
  });

  it('onRowActivate does not fire on Enter from an interactive descendant', () => {
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columnsWithButton}
        data={data.slice(0, 1)}
        onRowActivate={onRowActivate}
        hideActionColumn
      />
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'Open r1' }), {
      key: 'Enter',
    });
    expect(onRowActivate).not.toHaveBeenCalled();
  });

  it('Space does not fire onRowActivate when rowSelection is enabled', async () => {
    const user = userEvent.setup();
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        rowSelection={{}}
        onRowActivate={onRowActivate}
      />
    );
    bodyRow('user1@example.com').focus();
    await user.keyboard(' ');
    expect(onRowActivate).not.toHaveBeenCalled();
  });

  it('both callbacks fire alongside highlightCurrentRow', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 2)}
        highlightCurrentRow
        onRowClick={onRowClick}
        onRowActivate={onRowActivate}
      />
    );
    const rowEl = bodyRow('user2@example.com');
    await user.click(rowEl);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(rowEl.className.split(/\s+/)).toContain(
      'bg-[var(--ui-table-data-row-color-active)]'
    );

    rowEl.focus();
    await user.keyboard('{Enter}');
    expect(onRowActivate).toHaveBeenCalledTimes(1);
    expect(onRowActivate.mock.calls[0][1].via).toBe('keyboard');
  });

  it('keeps Arrow and Tab navigation working', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <DataTable
          columns={columns}
          data={data.slice(0, 3)}
          onRowClick={vi.fn()}
          onRowActivate={vi.fn()}
          hideActionColumn
        />
        <button>After</button>
      </div>
    );
    const rowsEls = screen.getAllByRole('row').slice(1);
    rowsEls[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(rowsEls[1]).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('ignores both callbacks when renderRow is set', async () => {
    const onRowClick = vi.fn();
    const onRowActivate = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data.slice(0, 1)}
        onRowClick={onRowClick}
        onRowActivate={onRowActivate}
        renderRow={(row) => (
          <tr key={row.id}>
            <td>{row.original.email}</td>
          </tr>
        )}
      />
    );
    await userEvent.dblClick(screen.getByText('user1@example.com'));
    expect(onRowClick).not.toHaveBeenCalled();
    expect(onRowActivate).not.toHaveBeenCalled();
  });
});

function Harness() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    state: { columnFilters },
  });
  return (
    <div>
      <DataTableToolbar
        table={table}
        searchKey="email"
        searchPlaceholder="Filter emails…"
      />
      <div data-testid="page-rows">
        {table.getRowModel().rows.map((r) => (
          <span key={r.id}>{r.original.email}</span>
        ))}
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

describe('DataTableToolbar + DataTablePagination', () => {
  it('renders `leading` before the search box', () => {
    function LeadingHarness() {
      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <DataTableToolbar
          table={table}
          leading={<button>Acme Corp</button>}
          searchKey="email"
          searchPlaceholder="Filter emails…"
        />
      );
    }
    render(<LeadingHarness />);
    expect(
      screen.getByRole('button', { name: 'Acme Corp' })
    ).toBeInTheDocument();
  });

  it('filters rows via the search box', async () => {
    render(<Harness />);
    const search = screen.getByPlaceholderText('Filter emails…');
    await userEvent.type(search, 'user11');
    const rows = within(screen.getByTestId('page-rows'));
    expect(rows.getByText('user11@example.com')).toBeInTheDocument();
    expect(rows.queryByText('user1@example.com')).not.toBeInTheDocument();
  });

  it('paginates to the next page', async () => {
    render(<Harness />);
    const rows = () => within(screen.getByTestId('page-rows'));
    expect(rows().getByText('user1@example.com')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Go to next page' })
    );
    expect(rows().queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(rows().getByText('user6@example.com')).toBeInTheDocument();
  });
});

const filterColumns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount', filterFn: 'weakEquals' },
];

function AmountFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <input
      aria-label="Amount filter"
      value={(filters.amount as string) ?? ''}
      onChange={(event) => setFilter('amount', event.target.value || undefined)}
    />
  );
}

function FilterHarness() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns: filterColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  });
  return (
    <div>
      <DataTableToolbar table={table}>
        <AmountFilterField />
      </DataTableToolbar>
      <div data-testid="page-rows">
        {table.getRowModel().rows.map((r) => (
          <span key={r.id}>{r.original.email}</span>
        ))}
      </div>
    </div>
  );
}

describe('DataTableToolbar per-column filtering', () => {
  it('applies a column filter through the FilterSearchFilters popover', async () => {
    render(<FilterHarness />);
    const rows = () => within(screen.getByTestId('page-rows'));
    expect(rows().getByText('user1@example.com')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await userEvent.type(screen.getByLabelText('Amount filter'), '300');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(rows().getByText('user3@example.com')).toBeInTheDocument();
    expect(rows().queryByText('user1@example.com')).not.toBeInTheDocument();
    // The applied filter surfaces as a removable chip.
    expect(
      screen.getByRole('button', { name: 'Remove amount filter' })
    ).toBeInTheDocument();
  });
});

describe('DataTableViewOptions in the settings column', () => {
  it('hides and re-shows a column from the cog dropdown', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data.slice(0, 2)} />);
    expect(screen.getByText('Amount')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Column settings' }));
    const item = () => screen.getByRole('menuitemcheckbox', { name: 'Amount' });
    expect(item()).toHaveAttribute('aria-checked', 'true');

    await user.click(item());
    expect(
      screen.queryByRole('columnheader', { name: 'Amount' })
    ).not.toBeInTheDocument();
    expect(item()).toHaveAttribute('aria-checked', 'false');

    await user.click(item());
    expect(
      screen.getByRole('columnheader', { name: 'Amount' })
    ).toBeInTheDocument();
  });

  it('uses column metadata for visibility labels and categories', async () => {
    const categorized: ColumnDef<Row>[] = [
      {
        accessorKey: 'email',
        header: 'Email address',
        meta: { label: 'Account email', category: 'Identity' },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        meta: { category: 'Billing' },
      },
    ];
    const user = userEvent.setup();
    render(<DataTable columns={categorized} data={data.slice(0, 1)} />);
    await user.click(screen.getByRole('button', { name: 'Column settings' }));

    expect(screen.getByText('Identity')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Account email' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Amount' })
    ).toBeInTheDocument();
  });

  it('localizes the built-in column search, category action, and empty state', async () => {
    const categorized: ColumnDef<Row>[] = [
      {
        accessorKey: 'email',
        header: 'Email',
        meta: { category: 'General' },
      },
    ];
    const user = userEvent.setup();
    render(
      <DataTable
        columns={categorized}
        data={data.slice(0, 1)}
        columnSearchPlaceholder="Spalten suchen"
        showAllColumnsLabel="Alle zeigen"
        noColumnsFoundLabel="Keine Spalten gefunden."
      />
    );
    await user.click(screen.getByRole('button', { name: 'Column settings' }));

    expect(
      screen.getByRole('button', { name: 'Alle zeigen General' })
    ).toBeInTheDocument();
    const search = screen.getByRole('searchbox', { name: 'Spalten suchen' });
    await user.type(search, 'missing');
    expect(screen.getByText('Keine Spalten gefunden.')).toBeInTheDocument();
  });
});

describe('DataTableToolbar column visibility', () => {
  it('renders no column-visibility control (it lives in the settings column)', () => {
    function VisibilityHarness() {
      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTableToolbar table={table} searchKey="email" />;
    }
    render(<VisibilityHarness />);
    expect(
      screen.queryByRole('button', { name: /View/ })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Column settings' })
    ).not.toBeInTheDocument();
  });
});

describe('DataTable header capability tooltip', () => {
  const capabilityColumns: ColumnDef<Row>[] = [
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'amount',
      header: 'Amount',
      enableSorting: false,
      enableResizing: false,
    },
  ];

  it('lists one hint per enabled capability of the hovered header', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={capabilityColumns}
        data={data.slice(0, 2)}
        enableColumnResizing
        enableColumnReordering
      />
    );

    await user.hover(screen.getByRole('columnheader', { name: /Email/ }));

    expect(await screen.findByText('Sort column:')).toBeInTheDocument();
    expect(screen.getByText('Reorder column:')).toBeInTheDocument();
    expect(screen.getByText('Resize column:')).toBeInTheDocument();
  });

  it('omits the hints of capabilities the column does not have', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={capabilityColumns}
        data={data.slice(0, 2)}
        enableColumnResizing
        enableColumnReordering
      />
    );

    await user.hover(screen.getByRole('columnheader', { name: /Amount/ }));

    expect(await screen.findByText('Reorder column:')).toBeInTheDocument();
    expect(screen.queryByText('Sort column:')).not.toBeInTheDocument();
    expect(screen.queryByText('Resize column:')).not.toBeInTheDocument();
  });

  it('renders no tooltip for a header with no capabilities', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={capabilityColumns} data={data.slice(0, 2)} />);

    await user.hover(screen.getByRole('columnheader', { name: /Amount/ }));

    expect(screen.queryByText('Sort column:')).not.toBeInTheDocument();
    expect(screen.queryByText('Reorder column:')).not.toBeInTheDocument();
    expect(screen.queryByText('Resize column:')).not.toBeInTheDocument();
  });

  it('lets headerHints override the hint copy', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={capabilityColumns}
        data={data.slice(0, 2)}
        headerHints={{ sort: { label: 'Spalte sortieren', action: 'Klick' } }}
      />
    );

    await user.hover(screen.getByRole('columnheader', { name: /Email/ }));

    expect(await screen.findByText('Spalte sortieren:')).toBeInTheDocument();
    expect(screen.getByText('Klick')).toBeInTheDocument();
  });
});

describe('DataTable grouped headers', () => {
  // One group with two leaf columns — used for colSpan, non-interactive, and
  // within-group reorder tests.
  const twoLeafGroupColumns: ColumnDef<Row>[] = [
    {
      id: 'groupA',
      header: 'Group A',
      columns: [
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'amount', header: 'Amount' },
      ],
    },
  ];

  // Two groups, one leaf column each — used for cross-group reorder tests.
  const crossGroupColumns: ColumnDef<Row>[] = [
    {
      id: 'groupA',
      header: 'Group A',
      columns: [{ accessorKey: 'email', header: 'Email' }],
    },
    {
      id: 'groupB',
      header: 'Group B',
      columns: [{ accessorKey: 'amount', header: 'Amount' }],
    },
  ];

  it('group header cell has colSpan equal to the number of leaf columns', () => {
    render(
      <DataTable
        columns={twoLeafGroupColumns}
        data={data.slice(0, 2)}
        hideActionColumn
      />
    );
    const groupHeader = screen.getByRole('columnheader', { name: 'Group A' });
    // The group header spans both leaf columns.
    expect(groupHeader).toHaveAttribute('colspan', '2');
  });

  it('group row contains exactly one <th> when no pinned columns are present', () => {
    render(
      <DataTable
        columns={twoLeafGroupColumns}
        data={data.slice(0, 2)}
        hideActionColumn
      />
    );
    const groupHeader = screen.getByRole('columnheader', { name: 'Group A' });
    const groupRow = groupHeader.closest('tr')!;
    // One spanning group-label cell; no select or __actions columns are
    // present so no placeholder cells appear in this row.
    expect(within(groupRow).getAllByRole('columnheader')).toHaveLength(1);
  });

  it('group header cells are not draggable even with enableColumnReordering', () => {
    render(
      <DataTable
        columns={twoLeafGroupColumns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const groupHeader = screen.getByRole('columnheader', { name: 'Group A' });
    expect(groupHeader).not.toHaveAttribute('draggable');
    // The leaf headers are still draggable.
    expect(screen.getByRole('columnheader', { name: 'Email' })).toHaveAttribute(
      'draggable',
      'true'
    );
  });

  it('group header cells have no resize handle even with enableColumnResizing', () => {
    render(
      <DataTable
        columns={twoLeafGroupColumns}
        data={data.slice(0, 2)}
        enableColumnResizing
        hideActionColumn
      />
    );
    const groupHeader = screen.getByRole('columnheader', { name: 'Group A' });
    // No resize separator inside the group header cell.
    expect(
      within(groupHeader).queryByRole('separator', { name: 'Resize column' })
    ).not.toBeInTheDocument();
    // The two leaf columns still each get a resize handle.
    expect(
      screen.getAllByRole('separator', { name: 'Resize column' })
    ).toHaveLength(2);
  });

  it('group header cells have no interactive sort controls', () => {
    // Even when all features are enabled, the group header cell must not
    // render any buttons or sort indicators (canSort is gated by !isGroupHeader).
    render(
      <DataTable
        columns={twoLeafGroupColumns}
        data={data.slice(0, 2)}
        enableColumnReordering
        enableColumnResizing
        hideActionColumn
      />
    );
    const groupHeader = screen.getByRole('columnheader', { name: 'Group A' });
    expect(within(groupHeader).queryByRole('button')).not.toBeInTheDocument();
  });

  it('cross-group drop is rejected and the column order does not change', () => {
    render(
      <DataTable
        columns={crossGroupColumns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const emailHeader = screen.getByRole('columnheader', { name: 'Email' });
    const amountHeader = screen.getByRole('columnheader', { name: 'Amount' });

    // Record the leaf-header order before the attempted cross-group drag.
    const leafRow = emailHeader.closest('tr')!;
    const orderBefore = within(leafRow)
      .getAllByRole('columnheader')
      .map((th) => th.textContent);

    // Drag Email (Group A) onto Amount (Group B) — cross-group, rejected.
    // Note: handleColumnDragOver sets event.dataTransfer.dropEffect = 'none'
    // to show the no-drop cursor, but happy-dom's DataTransfer does not
    // reflect that mutation back to the caller's object, so we can't assert
    // it here. The order-unchanged assertion below covers the rejection path.
    const dataTransfer = { effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(emailHeader, { dataTransfer });
    fireEvent.dragOver(amountHeader, { dataTransfer });
    fireEvent.drop(amountHeader, { dataTransfer });

    const orderAfter = within(leafRow)
      .getAllByRole('columnheader')
      .map((th) => th.textContent);
    expect(orderAfter).toEqual(orderBefore);
  });

  it('within-group drop succeeds and the column order changes', () => {
    render(
      <DataTable
        columns={twoLeafGroupColumns}
        data={data.slice(0, 2)}
        enableColumnReordering
        hideActionColumn
      />
    );
    const emailHeader = screen.getByRole('columnheader', { name: 'Email' });
    const amountHeader = screen.getByRole('columnheader', { name: 'Amount' });

    // Both columns are in Group A — drag Email onto Amount, which should succeed.
    const dataTransfer = { effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(emailHeader, { dataTransfer });
    fireEvent.dragOver(amountHeader, { dataTransfer });
    fireEvent.drop(amountHeader, { dataTransfer });

    // After a valid within-group drop the order must have flipped.
    const leafRow = screen
      .getByRole('columnheader', { name: 'Amount' })
      .closest('tr')!;
    const orderAfter = within(leafRow)
      .getAllByRole('columnheader')
      .map((th) => th.textContent);
    // Amount should now come before Email.
    expect(orderAfter.indexOf('Amount')).toBeLessThan(
      orderAfter.indexOf('Email')
    );
  });

  it('lists the nested leaf columns in the visibility dropdown, not the group labels', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={twoLeafGroupColumns} data={data.slice(0, 2)} />);

    await user.click(screen.getByRole('button', { name: 'Column settings' }));

    // The dropdown must offer the real (leaf) data columns...
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Email' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Amount' })
    ).toBeInTheDocument();
    // ...and not the group column, which carries no data of its own.
    expect(
      screen.queryByRole('menuitemcheckbox', { name: 'Group A' })
    ).not.toBeInTheDocument();
    // Regression guard: getAllColumns() would filter everything out and fall
    // through to the empty state.
    expect(screen.queryByText('No columns found.')).not.toBeInTheDocument();
  });

  it('toggles a nested leaf column off from the visibility dropdown', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={twoLeafGroupColumns} data={data.slice(0, 2)} />);

    await user.click(screen.getByRole('button', { name: 'Column settings' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Amount' }));

    expect(
      screen.queryByRole('columnheader', { name: 'Amount' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Amount' })
    ).toHaveAttribute('aria-checked', 'false');
  });
});
