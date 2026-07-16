import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  FilterSearch,
  FilterSearchActions,
  FilterSearchAppliedFilters,
  FilterSearchFilters,
  useFilterSearchFilters,
} from '../filter-search';
import {
  DateRangePicker,
  type DateRange,
} from '../../date-range-picker/date-range-picker';

describe('FilterSearch', () => {
  it('renders a div with default flex layout', () => {
    render(<FilterSearch data-testid="root" />);
    const el = screen.getByTestId('root');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('flex');
    expect(el.className).toContain('gap-4');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<FilterSearch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    render(<FilterSearch data-testid="root" className="my-class" />);
    const el = screen.getByTestId('root');
    expect(el.className).toContain('my-class');
  });

  it('renders children', () => {
    render(
      <FilterSearch>
        <span>child</span>
      </FilterSearch>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('spreads native HTML attributes', () => {
    render(<FilterSearch data-testid="root" aria-label="Table toolbar" />);
    expect(screen.getByTestId('root')).toHaveAttribute(
      'aria-label',
      'Table toolbar'
    );
  });
});

describe('FilterSearchActions', () => {
  it('renders a div with flex-1 and right-aligned layout', () => {
    render(<FilterSearchActions data-testid="actions" />);
    const el = screen.getByTestId('actions');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('flex-1');
    expect(el.className).toContain('justify-end');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<FilterSearchActions ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders action children', () => {
    render(
      <FilterSearchActions>
        <button>Action</button>
      </FilterSearchActions>
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('FilterSearch composition', () => {
  it('renders a full toolbar layout', () => {
    render(
      <FilterSearch data-testid="toolbar">
        <input placeholder="Search" aria-label="Search" />
        <button>Table filters</button>
        <FilterSearchActions>
          <button>Export</button>
        </FilterSearchActions>
      </FilterSearch>
    );
    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar.children).toHaveLength(3);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByText('Table filters')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});

// A field child wired to the draft via the context hook, exactly as a consumer
// would wire a real field (InputSelect, Search, …) inside the popover.
function StatusField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <div>
      <span data-testid="draft-status">{String(filters.status ?? '')}</span>
      <button type="button" onClick={() => setFilter('status', 'active')}>
        Set status
      </button>
      <button type="button" onClick={() => setFilter('status', undefined)}>
        Clear status
      </button>
    </div>
  );
}

function FiltersHarness({
  initial,
  onValueChange,
  onApply,
}: {
  initial?: Record<string, unknown>;
  onValueChange?: (next: Record<string, unknown>) => void;
  onApply?: (filters: Record<string, unknown>) => void;
}) {
  const [value, setValue] = useState<Record<string, unknown>>(initial ?? {});
  return (
    <FilterSearchFilters
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      onApply={onApply}
    >
      <StatusField />
    </FilterSearchFilters>
  );
}

describe('FilterSearchFilters', () => {
  it('renders the filter trigger', () => {
    render(<FiltersHarness />);
    expect(screen.getByRole('button', { name: 'Filters' })).toBeInTheDocument();
  });

  it('opens the popover from the trigger', async () => {
    const user = userEvent.setup();
    render(<FiltersHarness />);
    expect(screen.queryByText('Set status')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByText('Set status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('applies the drafted filters on Apply', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onApply = vi.fn();
    render(<FiltersHarness onValueChange={onValueChange} onApply={onApply} />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Set status' }));
    expect(screen.getByTestId('draft-status')).toHaveTextContent('active');

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onValueChange).toHaveBeenCalledWith({ status: 'active' });
    expect(onApply).toHaveBeenCalledWith({ status: 'active' });
    expect(screen.queryByText('Set status')).not.toBeInTheDocument();
  });

  it('deletes the draft key instead of committing undefined', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FiltersHarness initial={{ status: 'active' }} onValueChange={onValueChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Clear status' }));
    expect(screen.getByTestId('draft-status')).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onValueChange).toHaveBeenCalledWith({});
  });

  it('reverts the draft on Cancel without applying', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FiltersHarness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Set status' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByTestId('draft-status')).toHaveTextContent('');
  });

  it('reverts the draft on Escape without applying', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FiltersHarness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Set status' }));
    await user.keyboard('{Escape}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Set status')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByTestId('draft-status')).toHaveTextContent('');
  });

  it('reverts the draft on an outside press without applying', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FiltersHarness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Set status' }));
    await user.click(document.body);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Set status')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByTestId('draft-status')).toHaveTextContent('');
  });

  it('disables Reset filters when nothing is drafted and clears when pressed', async () => {
    const user = userEvent.setup();
    render(<FiltersHarness initial={{ status: 'active' }} />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const reset = screen.getByRole('button', { name: 'Reset filters' });
    expect(reset).toBeEnabled();
    await user.click(reset);
    expect(screen.getByTestId('draft-status')).toHaveTextContent('');
  });

  it('disables Apply until the draft actually changes', async () => {
    const user = userEvent.setup();
    render(<FiltersHarness initial={{ status: 'active' }} />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Set status' }));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });
});

// A DateRangePicker wired as a filter field inside FilterSearchFilters — the
// real-world composition that produces a popover-over-popover: the Filters popup
// is open, and opening the date-range calendar stacks a second Popover on top.
function DateRangeField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <DateRangePicker
      label="Period"
      placeholder="Select a range"
      value={(filters.period as DateRange | undefined) ?? {}}
      onValueChange={(range) =>
        setFilter('period', range.from ? range : undefined)
      }
    />
  );
}

function NestedPopoverHarness() {
  const [value, setValue] = useState<Record<string, unknown>>({});
  return (
    <FilterSearchFilters value={value} onValueChange={setValue}>
      <DateRangeField />
    </FilterSearchFilters>
  );
}

// Open the outer Filters popup, then the inner DateRangePicker calendar.
async function openBothPopovers(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Filters' }));
  await user.click(screen.getByRole('button', { name: 'Period' }));
}

// The outer popup is identified by its Cancel button (unique to
// FilterSearchFilters); the inner popup by the calendar grids + date fields
// (unique to DateRangePicker). "Apply" is intentionally never queried while both
// are open — both popups render an Apply button.
const outerOpen = () => screen.queryByRole('button', { name: 'Cancel' }) !== null;
const innerOpen = () => screen.queryByLabelText('Start date') !== null;

describe('FilterSearchFilters nested popover (DateRangePicker field)', () => {
  it('keeps the outer Filters popup open while the inner calendar is open', async () => {
    const user = userEvent.setup();
    render(<NestedPopoverHarness />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(outerOpen()).toBe(true);
    expect(innerOpen()).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Period' }));
    // The outer popup stays mounted/visible once the inner one opens on top.
    expect(outerOpen()).toBe(true);
    expect(innerOpen()).toBe(true);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('paints the inner calendar on top of the outer popup (later in document order at equal z-index)', async () => {
    const user = userEvent.setup();
    render(<NestedPopoverHarness />);
    await openBothPopovers(user);

    // Both popups portal to document.body appended in open order; the inner
    // (opened second) is a later sibling, so at equal z-index it paints above.
    const outerMarker = screen.getByRole('button', { name: 'Cancel' });
    const innerMarker = screen.getAllByRole('grid')[0];
    expect(
      outerMarker.compareDocumentPosition(innerMarker) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('closes only the inner calendar on the first Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup();
    render(<NestedPopoverHarness />);
    await openBothPopovers(user);

    await user.keyboard('{Escape}');
    // Inner closed, outer still open.
    expect(innerOpen()).toBe(false);
    expect(outerOpen()).toBe(true);
    // Focus returns to the DateRangePicker trigger inside the outer popup.
    expect(screen.getByRole('button', { name: 'Period' })).toHaveFocus();

    // A second Escape closes the outer popup.
    await user.keyboard('{Escape}');
    expect(outerOpen()).toBe(false);
  });

  it('does not dismiss the outer popup when a day is clicked in the inner calendar', async () => {
    const user = userEvent.setup();
    render(<NestedPopoverHarness />);
    await openBothPopovers(user);

    await user.click(screen.getAllByText('15')[0]);
    // Clicking calendar content is not an outside press for either popup.
    expect(innerOpen()).toBe(true);
    expect(outerOpen()).toBe(true);
  });

  it('does not dismiss the outer popup when the inner Apply is pressed', async () => {
    const user = userEvent.setup();
    render(<NestedPopoverHarness />);
    await openBothPopovers(user);

    await user.click(screen.getAllByText('15')[0]);
    // With the inner open, the enabled Apply is the calendar's (the outer's is
    // disabled until its draft changes). Applying commits the range and closes
    // only the inner popup; the outer Filters popup stays open.
    const applyButtons = screen.getAllByRole('button', { name: 'Apply' });
    const innerApply = applyButtons.find((button) => !button.hasAttribute('disabled'));
    await user.click(innerApply!);

    expect(innerOpen()).toBe(false);
    expect(outerOpen()).toBe(true);
  });

  it('closes the inner calendar on an outside press', async () => {
    const user = userEvent.setup();
    render(<NestedPopoverHarness />);
    await openBothPopovers(user);

    await user.click(document.body);
    expect(innerOpen()).toBe(false);
  });
});

describe('FilterSearchAppliedFilters', () => {
  it('renders nothing when there are no applied filters', () => {
    render(
      <FilterSearchAppliedFilters
        data-testid="applied"
        filters={{}}
        onValueChange={() => {}}
      />
    );
    expect(screen.queryByTestId('applied')).not.toBeInTheDocument();
  });

  it('renders one removable chip per applied filter plus a Reset filters action', () => {
    render(
      <FilterSearchAppliedFilters
        filters={{ status: 'active', type: 'server' }}
        onValueChange={() => {}}
      />
    );
    expect(screen.getByText('status: active')).toBeInTheDocument();
    expect(screen.getByText('type: server')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
  });

  it('removes a single filter when its chip is removed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FilterSearchAppliedFilters
        filters={{ status: 'active', type: 'server' }}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Remove status filter' }));
    expect(onValueChange).toHaveBeenCalledWith({ type: 'server' });
  });

  it('clears all filters when Reset filters is pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FilterSearchAppliedFilters
        filters={{ status: 'active', type: 'server' }}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(onValueChange).toHaveBeenCalledWith({});
  });

  it('formats an object filter value as JSON instead of [object Object]', () => {
    render(
      <FilterSearchAppliedFilters
        filters={{ range: { min: 1, max: 10 } }}
        onValueChange={() => {}}
      />
    );
    expect(
      screen.getByText('range: {"min":1,"max":10}')
    ).toBeInTheDocument();
  });

  it('formats an array filter value as a comma-separated list', () => {
    render(
      <FilterSearchAppliedFilters
        filters={{ status: ['active', 'pending'] }}
        onValueChange={() => {}}
      />
    );
    expect(screen.getByText('status: active, pending')).toBeInTheDocument();
  });

  it('supports a custom chip label formatter', () => {
    render(
      <FilterSearchAppliedFilters
        filters={{ status: 'active' }}
        onValueChange={() => {}}
        getFilterChipLabel={(key, value) => `${key.toUpperCase()}=${value}`}
      />
    );
    expect(screen.getByText('STATUS=active')).toBeInTheDocument();
  });
});
