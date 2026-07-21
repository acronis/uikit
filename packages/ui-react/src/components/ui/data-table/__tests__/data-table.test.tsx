import { useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFilterSearchFilters } from '../../filter-search';
import { getResizeKeyboardStep } from '../data-table';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableExpandTrigger,
  DataTablePagination,
  DataTableToolbar,
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
    render(<DataTable columns={sortable} data={data.slice(0, 3)} />);
    const cellsBefore = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsBefore).toEqual(['100', '200', '300']);

    // One click sorts ascending (already ascending → flips to descending here).
    await userEvent.click(
      screen.getByRole('button', { name: 'Sort by Amount' })
    );
    const cellsAfter = screen.getAllByRole('cell').map((c) => c.textContent);
    expect(cellsAfter).not.toEqual(cellsBefore);
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

  it('spans only the visible columns, not hidden ones, for the default empty state', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        columnVisibility={{ amount: false }}
        onColumnVisibilityChange={() => {}}
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
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(1);
  });
});

describe('DataTable column resizing', () => {
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

describe('DataTable wrapping (meta.wrap) columns', () => {
  it('wraps a column flagged meta.wrap and drops the fixed row height', () => {
    const wrapped: ColumnDef<Row>[] = [
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'amount',
        header: 'Amount',
        meta: { wrap: true },
        cell: ({ row }) => <span>{row.original.amount}</span>,
      },
    ];
    render(<DataTable columns={wrapped} data={data.slice(0, 1)} />);

    // The wrap-flagged cell + header get `whitespace-normal` and lose `h-10`.
    const wrapCell = screen.getByText('100').closest('td')!;
    expect(wrapCell).toHaveClass('whitespace-normal');
    expect(wrapCell).not.toHaveClass('h-10');
    const wrapHeader = screen.getByText('Amount').closest('th')!;
    expect(wrapHeader).toHaveClass('whitespace-normal');
    expect(wrapHeader).not.toHaveClass('h-10');

    // The unflagged column keeps the default fixed height / no-wrap.
    const plainCell = screen.getByText('user1@example.com').closest('td')!;
    expect(plainCell).toHaveClass('h-10');
    expect(plainCell).not.toHaveClass('whitespace-normal');
  });
});

describe('DataTableExpandTrigger', () => {
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
    const wrapper = container.querySelector('div.rounded-md') as HTMLElement;
    expect(wrapper.className).toContain('[&_td:not(:last-child)]:border-e');
  });

  it('renders skeleton placeholder rows instead of data', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} skeleton skeletonRows={3} />
    );
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    // 3 rows × 2 columns of pulse bars
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(6);
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
