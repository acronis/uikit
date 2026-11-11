import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../button';
import { ButtonMenu } from '../../button-menu';
import { Tag } from '../../tag';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderDescriptionRow,
  PageHeaderRow,
  PageHeaderTags,
  PageHeaderTitle,
} from '../index';
import { useRowOverflow } from '../page-header';

// happy-dom reports clientWidth/scrollWidth as 0 for every element (no real
// layout engine), which always reads as "fits" — the default for every test
// that doesn't call this. Mirrors `mockOverflow` in sidebar-primary.test.tsx.
function mockOverflow(overflowing: boolean) {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
    overflowing ? 500 : 100
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
}

// A controllable stand-in for `ResizeObserver` — happy-dom's real
// implementation never fires without genuine layout changes, so this lets
// tests trigger a "resize" deterministically via `trigger()`. Mirrors
// sidebar-primary.test.tsx's own copy (not shared — each component's test
// file is self-contained in this codebase).
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

// The hidden measurement clone always renders the full item set (to keep
// measuring), so a plain `getByText` also matches inside it. Scope queries to
// elements that aren't inside an `aria-hidden` ancestor.
function queryVisible(text: string) {
  return screen
    .queryAllByText(text)
    .filter((el) => !el.closest('[aria-hidden]'));
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  FakeResizeObserver.instances = [];
});

describe('PageHeader', () => {
  it('renders the banner with title, tags, actions, and description', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
          <PageHeaderTags>
            <span>Customer</span>
          </PageHeaderTags>
          <PageHeaderActions>
            <button>New</button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescriptionRow>
          <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
        </PageHeaderDescriptionRow>
      </PageHeader>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Reports').tagName).toBe('H1');
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByText('All scheduled reports.')).toHaveClass(
      'text-muted-foreground'
    );
  });

  it('allows an embedded header without adding a second banner landmark', () => {
    render(
      <div>
        <PageHeader>
          <PageHeaderRow>
            <PageHeaderTitle>Workspace</PageHeaderTitle>
          </PageHeaderRow>
        </PageHeader>
        <PageHeader role="none">
          <PageHeaderRow>
            <PageHeaderTitle as="h2">Activity</PageHeaderTitle>
          </PageHeaderRow>
        </PageHeader>
      </div>
    );

    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Activity' })
    ).toBeInTheDocument();
  });

  it('renders a title-only header without tags, actions, or a description', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Reports' })).toBeInTheDocument();
  });

  it('renders an H2 title with the same visual style as the default H1', () => {
    const { rerender } = render(<PageHeaderTitle>Reports</PageHeaderTitle>);
    const defaultTitle = screen.getByRole('heading', {
      level: 1,
      name: 'Reports',
    });
    const defaultClassName = defaultTitle.className;

    rerender(<PageHeaderTitle as="h2">Details</PageHeaderTitle>);

    const nestedTitle = screen.getByRole('heading', {
      level: 2,
      name: 'Details',
    });
    expect(nestedTitle.tagName).toBe('H2');
    expect(nestedTitle.className).toBe(defaultClassName);
  });

  it('renders an edit button as a sibling of the title', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Untitled dashboard</PageHeaderTitle>
          <button aria-label="Edit title">Edit</button>
        </PageHeaderRow>
      </PageHeader>
    );
    expect(screen.getByRole('button', { name: 'Edit title' })).toBeInTheDocument();
  });

  it('renders an edit button as a sibling of the description', () => {
    render(
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
        </PageHeaderRow>
        <PageHeaderDescriptionRow>
          <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
          <button aria-label="Edit description">Edit</button>
        </PageHeaderDescriptionRow>
      </PageHeader>
    );
    expect(
      screen.getByRole('button', { name: 'Edit description' })
    ).toBeInTheDocument();
  });

  it('forwards refs on the root and the title', () => {
    let rootRef: HTMLDivElement | null = null;
    let titleRef: HTMLHeadingElement | null = null;
    render(
      <PageHeader
        ref={(el) => {
          rootRef = el;
        }}
      >
        <PageHeaderRow>
          <PageHeaderTitle
            ref={(el) => {
              titleRef = el;
            }}
          >
            Reports
          </PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
    );
    expect(rootRef).toBeInstanceOf(HTMLDivElement);
    expect(titleRef).toBeInstanceOf(HTMLHeadingElement);
  });

  it('forwards refs on the tags and actions slots alongside their internal measurement ref', () => {
    let tagsRef: HTMLDivElement | null = null;
    let actionsRef: HTMLDivElement | null = null;
    render(
      <PageHeaderRow>
        <PageHeaderTags
          ref={(el) => {
            tagsRef = el;
          }}
        >
          <Tag>Customer</Tag>
        </PageHeaderTags>
        <PageHeaderActions
          ref={(el) => {
            actionsRef = el;
          }}
        >
          <Button>New</Button>
        </PageHeaderActions>
      </PageHeaderRow>
    );
    expect(tagsRef).toBeInstanceOf(HTMLDivElement);
    expect(tagsRef).toHaveAttribute('data-slot', 'page-header-tags');
    expect(actionsRef).toBeInstanceOf(HTMLDivElement);
    expect(actionsRef).toHaveAttribute('data-slot', 'page-header-actions');
  });

  describe('overflow', () => {
    it('renders every tag directly when they fit', () => {
      render(
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
      );
      expect(queryVisible('Customer')).toHaveLength(1);
      expect(queryVisible('Active')).toHaveLength(1);
      expect(queryVisible('Warning')).toHaveLength(1);
      expect(screen.queryByText('+2')).not.toBeInTheDocument();
    });

    it('collapses to the first tag + a "+#" tag when they overflow, with hidden labels in its tooltip', async () => {
      mockOverflow(true);
      render(
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
      );
      expect(queryVisible('Customer')).toHaveLength(1);
      expect(queryVisible('Active')).toHaveLength(0);
      expect(queryVisible('Warning')).toHaveLength(0);
      expect(queryVisible('+2')).toHaveLength(1);

      await userEvent.hover(screen.getByText('+2'));
      expect(await screen.findByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('renders every action directly when they fit', () => {
      render(
        <PageHeaderActions>
          <Button variant="secondary">Quick access</Button>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      expect(queryVisible('Quick access')).toHaveLength(1);
      expect(queryVisible('Add user')).toHaveLength(1);
      expect(
        screen.queryByRole('button', { name: 'More actions' })
      ).not.toBeInTheDocument();
    });

    it('collapses secondary actions under a "More" button when they overflow, leaving primary actions visible', async () => {
      mockOverflow(true);
      render(
        <PageHeaderActions>
          <Button variant="secondary">Quick access</Button>
          <Button variant="secondary">Export data</Button>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      expect(queryVisible('Quick access')).toHaveLength(0);
      expect(queryVisible('Export data')).toHaveLength(0);
      expect(queryVisible('Add user')).toHaveLength(1);

      const moreButton = screen.getByRole('button', { name: 'More actions' });
      expect(moreButton).toBeInTheDocument();

      await userEvent.click(moreButton);
      expect(
        await screen.findByRole('menuitem', { name: 'Quick access' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Export data' })
      ).toBeInTheDocument();
    });

    it('renders an empty tags slot without crashing', () => {
      const { container } = render(<PageHeaderTags />);
      expect(
        container.querySelector('[data-slot="page-header-tags"]')
      ).toBeInTheDocument();
    });

    it('never collapses a single tag, even when the row overflows', () => {
      mockOverflow(true);
      render(
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
        </PageHeaderTags>
      );
      expect(queryVisible('Customer')).toHaveLength(1);
      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
    });

    it('never shows a "More" button when there are no secondary actions, even when the row overflows', () => {
      mockOverflow(true);
      render(
        <PageHeaderActions>
          <Button>Add user</Button>
          <Button>Save</Button>
        </PageHeaderActions>
      );
      expect(queryVisible('Add user')).toHaveLength(1);
      expect(queryVisible('Save')).toHaveLength(1);
      expect(
        screen.queryByRole('button', { name: 'More actions' })
      ).not.toBeInTheDocument();
    });

    it('disables a disabled secondary action in the "More" menu', async () => {
      mockOverflow(true);
      render(
        <PageHeaderActions>
          <Button variant="secondary" disabled>
            Quick access
          </Button>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'More actions' })
      );
      expect(
        await screen.findByRole('menuitem', { name: 'Quick access' })
      ).toHaveAttribute('data-disabled');
    });

    it('forwards onClick from a folded secondary action to its "More" menu item', async () => {
      mockOverflow(true);
      const onClick = vi.fn();
      render(
        <PageHeaderActions>
          <Button variant="secondary" onClick={onClick}>
            Quick access
          </Button>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'More actions' })
      );
      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Quick access' })
      );
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('preserves a folded secondary action\'s render prop in its "More" menu item', async () => {
      mockOverflow(true);
      render(
        <PageHeaderActions>
          <Button variant="secondary" render={<a href="/export.csv" />}>
            Export data
          </Button>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'More actions' })
      );
      expect(
        await screen.findByRole('menuitem', { name: 'Export data' })
      ).toHaveAttribute('href', '/export.csv');
    });

    it('forwards native attributes like aria-label from a folded secondary action to its "More" menu item', async () => {
      mockOverflow(true);
      render(
        <PageHeaderActions>
          <Button variant="secondary" aria-label="Refresh" data-testid="refresh">
            <span aria-hidden>↻</span>
          </Button>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'More actions' })
      );
      const menuItem = await screen.findByRole('menuitem', { name: 'Refresh' });
      expect(menuItem).toHaveAttribute('data-testid', 'refresh');
    });

    it('never folds a non-Button action, even with variant="secondary"', async () => {
      mockOverflow(true);
      render(
        <PageHeaderActions>
          <Button variant="secondary">Quick access</Button>
          <ButtonMenu variant="secondary">Export data</ButtonMenu>
          <Button>Add user</Button>
        </PageHeaderActions>
      );
      expect(queryVisible('Quick access')).toHaveLength(0);
      expect(queryVisible('Export data')).toHaveLength(1);
      expect(queryVisible('Add user')).toHaveLength(1);

      await userEvent.click(
        screen.getByRole('button', { name: 'More actions' })
      );
      expect(
        await screen.findByRole('menuitem', { name: 'Quick access' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('menuitem', { name: 'Export data' })
      ).not.toBeInTheDocument();
    });

    it('re-measures and collapses when children change after mount', () => {
      mockOverflow(true);
      const { rerender } = render(
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
        </PageHeaderTags>
      );
      expect(queryVisible('Customer')).toHaveLength(1);
      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();

      rerender(
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
        </PageHeaderTags>
      );
      expect(queryVisible('Customer')).toHaveLength(1);
      expect(queryVisible('Active')).toHaveLength(0);
      expect(queryVisible('+1')).toHaveLength(1);
    });
  });
});

// `useRowOverflow` isn't part of the public API (not re-exported from
// `index.ts`) — it's exported from the source module solely so it can be
// tested directly here, the same way sidebar-primary.tsx exports
// `useIsOverflowing`. `PageHeaderTags`/`PageHeaderActions`'s own tests above
// only exercise it through the "does the render change?" lens; this suite
// tests the hook's own contract (including a genuine post-mount resize,
// which none of the tests above do — they only ever force the *initial*
// measurement).
describe('useRowOverflow', () => {
  function OverflowProbe() {
    const { containerRef, measureRef, collapsed } = useRowOverflow();
    return (
      <div ref={containerRef}>
        <div ref={measureRef} />
        {collapsed ? 'collapsed' : 'not-collapsed'}
      </div>
    );
  }

  it('reports not collapsed when the measured content fits', () => {
    mockOverflow(false);
    render(<OverflowProbe />);
    expect(screen.getByText('not-collapsed')).toBeInTheDocument();
  });

  it('reports collapsed when the measured content overflows', () => {
    mockOverflow(true);
    render(<OverflowProbe />);
    expect(screen.getByText('collapsed')).toBeInTheDocument();
  });

  it('re-measures via ResizeObserver when the container resizes', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    mockOverflow(false);
    render(<OverflowProbe />);
    expect(screen.getByText('not-collapsed')).toBeInTheDocument();

    mockOverflow(true);
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });
    expect(screen.getByText('collapsed')).toBeInTheDocument();
  });

  it('observes the container element specifically, not the measurement clone', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    mockOverflow(false);
    const { container } = render(<OverflowProbe />);
    const observer = FakeResizeObserver.instances[0];
    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(observer.observe).toHaveBeenCalledWith(container.firstChild);
  });

  it('disconnects the ResizeObserver on unmount', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    mockOverflow(false);
    const { unmount } = render(<OverflowProbe />);
    const observer = FakeResizeObserver.instances[0];

    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });
});
