import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Toolbar,
  ToolbarActions,
  ToolbarActionList,
  computeVisibleActionCount,
  measureNaturalWidth,
  type ToolbarActionListItem,
} from '../toolbar';
import { Button } from '../../button';

// happy-dom's layout metrics are always 0, so every action/trigger measures
// as 0-width and the collapse math trivially decides "everything fits" —
// mock the prototype getters to simulate real geometry.
function mockGeometry({
  itemWidth,
  clientWidth,
}: {
  itemWidth: number;
  clientWidth: number;
}) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: itemWidth,
    height: 32,
    top: 0,
    left: 0,
    right: itemWidth,
    bottom: 32,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRect);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
    clientWidth
  );
}

// A controllable stand-in for `ResizeObserver` — happy-dom's real
// implementation never fires without genuine layout changes, so this lets
// tests trigger a "resize" deterministically via `trigger()`.
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }

  trigger() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

const THREE_ACTIONS: ToolbarActionListItem[] = [
  { key: 'a', label: 'First action' },
  { key: 'b', label: 'Second action' },
  { key: 'c', label: 'Third action' },
];

describe('Toolbar', () => {
  it('renders a fieldset with default flex layout', () => {
    render(<Toolbar data-testid="root" />);
    const el = screen.getByTestId('root');
    expect(el.tagName).toBe('FIELDSET');
    expect(el.className).toContain('flex');
    expect(el.className).toContain('gap-4');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLFieldSetElement | null>;
    render(<Toolbar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it('merges custom className', () => {
    render(<Toolbar data-testid="root" className="my-class" />);
    expect(screen.getByTestId('root').className).toContain('my-class');
  });

  it('renders children', () => {
    render(
      <Toolbar>
        <Button>First action</Button>
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument();
  });

  it('spreads native HTML attributes', () => {
    render(<Toolbar data-testid="root" aria-label="Bulk actions" />);
    expect(screen.getByTestId('root')).toHaveAttribute(
      'aria-label',
      'Bulk actions'
    );
  });

  it('disables every nested control when disabled', () => {
    render(
      <Toolbar disabled>
        <Button>First action</Button>
        <Button>Second action</Button>
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Second action' })).toBeDisabled();
  });

  it('leaves nested controls enabled by default', () => {
    render(
      <Toolbar>
        <Button>First action</Button>
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).not.toBeDisabled();
  });
});

describe('ToolbarActions', () => {
  it('renders a div that grows but never shrinks, right-aligned', () => {
    render(<ToolbarActions data-testid="actions" />);
    const el = screen.getByTestId('actions');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('grow');
    expect(el.className).toContain('shrink-0');
    expect(el.className).toContain('justify-end');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<ToolbarActions ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('disables nested controls when its parent Toolbar is disabled', () => {
    render(
      <Toolbar disabled>
        <ToolbarActions>
          <Button>Deselect</Button>
        </ToolbarActions>
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'Deselect' })).toBeDisabled();
  });
});

describe('computeVisibleActionCount', () => {
  it('shows every item when they all fit', () => {
    expect(computeVisibleActionCount([100, 100, 100], 100, 16, 400)).toBe(3);
  });

  it('reserves room for the overflow trigger once items no longer fit', () => {
    // 3×100 + 2×16 gaps = 332, doesn't fit 250 → falls back to the
    // trigger-reserved branch: 100 (trigger) + 100 (item) + 16 (gap) = 216 ≤ 250,
    // but a second item would push it to 332 > 250.
    expect(computeVisibleActionCount([100, 100, 100], 100, 16, 250)).toBe(1);
  });

  it('shows only the trigger when nothing fits alongside it', () => {
    expect(computeVisibleActionCount([100, 100, 100], 100, 16, 200)).toBe(0);
  });

  it('returns 0 for an empty item list', () => {
    expect(computeVisibleActionCount([], 100, 16, 400)).toBe(0);
  });
});

describe('measureNaturalWidth', () => {
  function stubWidth(el: Element, width: number) {
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width,
      height: 32,
      top: 0,
      left: 0,
      right: width,
      bottom: 32,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
  }

  it('falls back to the element itself when it has no children', () => {
    const el = document.createElement('div');
    stubWidth(el, 42);
    expect(measureNaturalWidth(el)).toBe(42);
  });

  it('sums a single child with no gap term', () => {
    const el = document.createElement('div');
    const child = document.createElement('span');
    el.appendChild(child);
    stubWidth(child, 60);
    expect(measureNaturalWidth(el)).toBe(60);
  });

  it('falls back to a 0 gap when columnGap is unresolvable (e.g. "normal")', () => {
    // getComputedStyle().columnGap on an element with no explicit gap set
    // resolves to the keyword "normal", not a length — parseFloat('normal')
    // is NaN, so the `|| 0` fallback is what keeps the sum from becoming NaN.
    const el = document.createElement('div');
    const a = document.createElement('span');
    const b = document.createElement('button');
    el.append(a, b);
    stubWidth(a, 60);
    stubWidth(b, 90);
    document.body.appendChild(el);
    try {
      expect(measureNaturalWidth(el)).toBe(60 + 90);
    } finally {
      el.remove();
    }
  });

  it('sums multiple children plus the inter-child gap, ignoring its own grown box', () => {
    const el = document.createElement('div');
    el.style.columnGap = '8px';
    stubWidth(el, 999); // the element's own (flex-grown) box must be ignored
    const a = document.createElement('span');
    const b = document.createElement('button');
    el.append(a, b);
    stubWidth(a, 60);
    stubWidth(b, 90);
    // getComputedStyle only resolves inline style once the element is
    // connected to the document.
    document.body.appendChild(el);
    try {
      expect(measureNaturalWidth(el)).toBe(60 + 90 + 8);
    } finally {
      el.remove();
    }
  });

  it('measures a bare text child via a Range instead of falling back to the self-referential box', () => {
    // `<ToolbarActions>25 selected</ToolbarActions>` with no wrapping
    // element renders as a Text node, not an Element — `el.children` alone
    // would miss it and read the grown box instead.
    const el = document.createElement('div');
    el.textContent = '25 selected';
    stubWidth(el, 999); // the element's own (flex-grown) box must be ignored
    vi.spyOn(Range.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 70,
      height: 16,
      top: 0,
      left: 0,
      right: 70,
      bottom: 16,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
    expect(measureNaturalWidth(el)).toBe(70);
  });

  it('falls back to the element itself when it only has whitespace text', () => {
    const el = document.createElement('div');
    el.textContent = '   ';
    stubWidth(el, 42);
    expect(measureNaturalWidth(el)).toBe(42);
  });

  it("adds the element's own padding and border on top of its children's widths", () => {
    // Padding/border are a fixed part of the box that flex-grow doesn't
    // touch (only the free space between content and box edge grows), so —
    // unlike the box's own `getBoundingClientRect()` — they're safe to add
    // back on top of the content sum without becoming self-referential.
    const el = document.createElement('div');
    el.style.columnGap = '8px';
    el.style.paddingLeft = '4px';
    el.style.paddingRight = '6px';
    el.style.borderLeft = '1px solid black';
    el.style.borderRight = '2px solid black';
    const a = document.createElement('span');
    const b = document.createElement('button');
    el.append(a, b);
    stubWidth(a, 60);
    stubWidth(b, 90);
    document.body.appendChild(el);
    try {
      expect(measureNaturalWidth(el)).toBe(60 + 90 + 8 + 4 + 6 + 1 + 2);
    } finally {
      el.remove();
    }
  });
});

describe('ToolbarActionList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    FakeResizeObserver.instances = [];
  });

  it('renders every action inline when they all fit', () => {
    mockGeometry({ itemWidth: 100, clientWidth: 400 });
    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Third action' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'More actions' })
    ).not.toBeInTheDocument();
  });

  it('collapses trailing actions into the overflow menu once they no longer fit', () => {
    mockGeometry({ itemWidth: 100, clientWidth: 250 });
    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Second action' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Third action' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });

  it('accounts for a sibling ToolbarActions when measuring available width', () => {
    // Without subtracting the sibling's width + gap, 300 would fit 1 item;
    // with it correctly subtracted, nothing fits alongside the trigger.
    mockGeometry({ itemWidth: 100, clientWidth: 300 });
    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
        <ToolbarActions>
          <span>Status</span>
        </ToolbarActions>
      </Toolbar>
    );
    expect(
      screen.queryByRole('button', { name: 'First action' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });

  it('re-expands hidden actions once the row widens again, with a sibling ToolbarActions present', () => {
    // Regression: ToolbarActions is `grow shrink-0`, so once the row narrows
    // and the action list collapses, the sibling grows to absorb the freed
    // space. Measuring the sibling's own (grown) rect would make "available
    // width" self-referential — it'd always equal the list's own current
    // width — so the row would never re-measure enough space to re-expand.
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    let clientWidth = 250;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          width: 100,
          height: 32,
          top: 0,
          left: 0,
          right: 100,
          bottom: 32,
          x: 0,
          y: 0,
          toJSON: () => {},
        }) as DOMRect
    );
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
      () => clientWidth
    );

    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
        <ToolbarActions>
          <span>Status</span>
        </ToolbarActions>
      </Toolbar>
    );
    expect(
      screen.queryByRole('button', { name: 'First action' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();

    clientWidth = 460;
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });

    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Third action' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'More actions' })
    ).not.toBeInTheDocument();
  });

  it('re-collapses when a sibling ToolbarActions counter grows, even though the parent Toolbar itself never resizes', () => {
    // Regression: a dynamic counter (e.g. "6 items selected") widens
    // ToolbarActions' own border-box (it's `shrink-0`) without the parent
    // fieldset's own box changing at all. A ResizeObserver bound only to
    // the parent would never fire for this — the observer must also watch
    // the sibling directly.
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    let siblingWidth = 50;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const width = this.tagName === 'SPAN' ? siblingWidth : 100;
        return {
          width,
          height: 32,
          top: 0,
          left: 0,
          right: width,
          bottom: 32,
          x: 0,
          y: 0,
          toJSON: () => {},
        } as DOMRect;
      }
    );
    // The parent's own clientWidth is fixed for the whole test — only the
    // sibling's content grows.
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);

    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
        <ToolbarActions>
          <span>Status</span>
        </ToolbarActions>
      </Toolbar>
    );

    expect(screen.getByRole('button', { name: 'Third action' })).toBeInTheDocument();

    // The observer must be bound to the sibling itself, not just the parent
    // — otherwise the growth below would never be observed in a real browser.
    const statusEl = screen.getByText('Status').parentElement;
    expect(FakeResizeObserver.instances[0].observe).toHaveBeenCalledWith(statusEl);

    siblingWidth = 300;
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });

    expect(
      screen.queryByRole('button', { name: 'Third action' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });

  it('closes the overflow menu and disables its items once the ancestor Toolbar becomes disabled while it is open', async () => {
    // Regression: the overflow menu renders in a portal, outside the
    // <fieldset>'s DOM subtree, so the native disabled cascade never
    // reaches items already open there when the toolbar is disabled mid-session.
    mockGeometry({ itemWidth: 100, clientWidth: 250 });
    const { rerender } = render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(
      await screen.findByRole('menuitem', { name: 'Second action' })
    ).toBeInTheDocument();

    rerender(
      <Toolbar disabled>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('menuitem', { name: 'Second action' })
      ).not.toBeInTheDocument();
    });
  });

  it('keeps the overflow menu closed after the Toolbar is re-enabled', async () => {
    // The disabled state gates the menu's `open` prop, so the stored open
    // state has to be cleared too — otherwise re-enabling the toolbar pops
    // the menu back open on its own, with no user interaction.
    mockGeometry({ itemWidth: 100, clientWidth: 250 });
    const { rerender } = render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(
      await screen.findByRole('menuitem', { name: 'Second action' })
    ).toBeInTheDocument();

    rerender(
      <Toolbar disabled>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    await waitFor(() => {
      expect(
        screen.queryByRole('menuitem', { name: 'Second action' })
      ).not.toBeInTheDocument();
    });

    rerender(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );

    expect(
      screen.queryByRole('menuitem', { name: 'Second action' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('re-measures correctly when actions shrinks, without stale phantom widths', () => {
    // Regression for a bug where the invisible clones' width refs (keyed by
    // array index) kept stale trailing entries once `actions` shrank, adding
    // phantom width+gap to the collapse math. 3×100 + 2×16 gaps = 332 ≤ 350,
    // so all three should fit; the stale-array bug inflated this to 364,
    // spuriously hiding the third action.
    mockGeometry({ itemWidth: 100, clientWidth: 350 });
    const FIVE_ACTIONS: ToolbarActionListItem[] = [
      ...THREE_ACTIONS,
      { key: 'd', label: 'Fourth action' },
      { key: 'e', label: 'Fifth action' },
    ];
    const { rerender } = render(
      <Toolbar>
        <ToolbarActionList actions={FIVE_ACTIONS} />
      </Toolbar>
    );

    rerender(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );

    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Third action' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'More actions' })
    ).not.toBeInTheDocument();
  });

  it('opens the overflow menu and fires onSelect for a hidden action', async () => {
    // Same 3-item/250px shape as the collapse test above: 1 visible, 2 hidden.
    const onSelect = vi.fn();
    mockGeometry({ itemWidth: 100, clientWidth: 250 });
    render(
      <Toolbar>
        <ToolbarActionList
          actions={[
            { key: 'a', label: 'First action' },
            { key: 'b', label: 'Second action' },
            { key: 'c', label: 'Third action', onSelect },
          ]}
        />
      </Toolbar>
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const item = await screen.findByRole('menuitem', { name: 'Third action' });
    await userEvent.click(item);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('fires onSelect for a visible action', async () => {
    const onSelect = vi.fn();
    mockGeometry({ itemWidth: 100, clientWidth: 400 });
    render(
      <Toolbar>
        <ToolbarActionList
          actions={[{ key: 'a', label: 'First action', onSelect }]}
        />
      </Toolbar>
    );
    await userEvent.click(screen.getByRole('button', { name: 'First action' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('disables a visible action independently of the others', () => {
    mockGeometry({ itemWidth: 100, clientWidth: 400 });
    render(
      <Toolbar>
        <ToolbarActionList
          actions={[
            { key: 'a', label: 'First action', disabled: true },
            { key: 'b', label: 'Second action' },
          ]}
        />
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Second action' })).not.toBeDisabled();
  });

  it('marks a hidden action disabled in the overflow menu', async () => {
    mockGeometry({ itemWidth: 100, clientWidth: 250 });
    render(
      <Toolbar>
        <ToolbarActionList
          actions={[
            { key: 'a', label: 'First action' },
            { key: 'b', label: 'Second action' },
            { key: 'c', label: 'Third action', disabled: true },
          ]}
        />
      </Toolbar>
    );
    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const item = await screen.findByRole('menuitem', { name: 'Third action' });
    expect(item).toHaveAttribute('data-disabled');
  });

  it('is disabled entirely when its parent Toolbar is disabled', () => {
    mockGeometry({ itemWidth: 100, clientWidth: 400 });
    render(
      <Toolbar disabled>
        <ToolbarActionList actions={[{ key: 'a', label: 'First action' }]} />
      </Toolbar>
    );
    expect(screen.getByRole('button', { name: 'First action' })).toBeDisabled();
  });

  it('moves focus between visible actions with arrow keys', async () => {
    const user = userEvent.setup();
    mockGeometry({ itemWidth: 100, clientWidth: 400 });
    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    const first = screen.getByRole('button', { name: 'First action' });
    const second = screen.getByRole('button', { name: 'Second action' });
    const third = screen.getByRole('button', { name: 'Third action' });

    await user.click(first);
    expect(first).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(second).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(third).toHaveFocus();
  });

  it('moves focus into the overflow trigger with arrow keys', async () => {
    const user = userEvent.setup();
    mockGeometry({ itemWidth: 100, clientWidth: 250 });
    render(
      <Toolbar>
        <ToolbarActionList actions={THREE_ACTIONS} />
      </Toolbar>
    );
    const first = screen.getByRole('button', { name: 'First action' });
    const trigger = screen.getByRole('button', { name: 'More actions' });

    await user.click(first);
    await user.keyboard('{ArrowRight}');
    expect(trigger).toHaveFocus();
  });

});
