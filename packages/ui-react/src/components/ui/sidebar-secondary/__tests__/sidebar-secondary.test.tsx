import { createRef } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TooltipProvider } from '../../tooltip';
import {
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
} from '../sidebar-secondary';

function Panel(props: React.ComponentProps<typeof SidebarSecondary>) {
  return (
    <SidebarSecondary {...props}>
      <SidebarSecondaryHeader label="Protection" />
      <SidebarSecondaryContent>
        <SidebarSecondarySection>
          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="/dashboard" selected>
              Dashboard
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="/devices">
              Devices
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="/policies/backup" selected>
              Backup
            </SidebarSecondaryMenuItem>
            <SidebarSecondaryMenuItem href="/policies/av">
              Antivirus
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryFooter>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="/settings">
            Settings
          </SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondaryFooter>
    </SidebarSecondary>
  );
}

describe('SidebarSecondary', () => {
  it('renders the composed panel without error', () => {
    render(<Panel />);
    expect(
      screen.getByRole('navigation', { name: 'Section navigation' })
    ).toBeInTheDocument();
  });

  it('exposes a distinguishing nav landmark label', () => {
    render(<Panel aria-label="Protection nav" />);
    expect(
      screen.getByRole('navigation', { name: 'Protection nav' })
    ).toBeInTheDocument();
  });

  it('renders the header label as a heading', () => {
    render(<Panel />);
    expect(
      screen.getByRole('heading', { name: 'Protection' })
    ).toBeInTheDocument();
  });

  it('renders menus as lists of link items', () => {
    render(<Panel />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getAllByRole('list').length).toBeGreaterThan(0);
  });

  it('marks the selected item with aria-current and the right container token', () => {
    render(<Panel />);
    const dashboard = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboard).toHaveAttribute('aria-current', 'page');
    expect(dashboard).toHaveClass(
      'bg-[var(--ui-sidebar-secondary-menu-item-selected-container-color-idle)]'
    );
    const devices = screen.getByRole('link', { name: 'Devices' });
    expect(devices).not.toHaveAttribute('aria-current');
    expect(devices).toHaveClass(
      'bg-[var(--ui-sidebar-secondary-menu-item-unselected-container-color-idle)]'
    );
  });

  it('uses the shared global icon/label tokens (not per-variant)', () => {
    render(<Panel />);
    // Both selected and unselected rows carry the SAME global label color token.
    const dashboard = screen.getByRole('link', { name: 'Dashboard' });
    const devices = screen.getByRole('link', { name: 'Devices' });
    expect(dashboard).toHaveClass(
      'text-[var(--ui-sidebar-secondary-menu-item-global-label-color-color)]'
    );
    expect(devices).toHaveClass(
      'text-[var(--ui-sidebar-secondary-menu-item-global-label-color-color)]'
    );
  });

  it('defaults to expanded and reflects a controlled collapsed state', () => {
    const { rerender } = render(<Panel />);
    expect(
      screen.getByRole('navigation', { name: 'Section navigation' })
    ).toHaveAttribute('data-state', 'expanded');
    rerender(<Panel expanded={false} />);
    expect(
      screen.getByRole('navigation', { name: 'Section navigation' })
    ).toHaveAttribute('data-state', 'collapsed');
  });

  it('keeps the collapsed breadcrumb labels in the DOM', () => {
    render(<Panel expanded={false} />);
    // Both the breadcrumb parent and current page are present (toggling is CSS;
    // they stay rendered for SSR).
    expect(screen.getAllByText('Protection').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });

  it('auto-derives collapsed breadcrumb from Header label and selected MenuItem', () => {
    // CollapsedBreadcrumb with no explicit props — should pull from context.
    render(
      <SidebarSecondary expanded={false}>
        <SidebarSecondaryHeader label="Assets" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="#" selected>
                All devices
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    );
    // parentLabel auto-derived from Header
    expect(screen.getAllByText('Assets').length).toBeGreaterThanOrEqual(2); // heading + breadcrumb
    // currentLabel auto-derived from selected MenuItem
    expect(screen.getAllByText('All devices').length).toBeGreaterThanOrEqual(2); // link + breadcrumb
  });

  it('indents items inside an expandable section via extra start padding on the item (full-width hover)', () => {
    render(
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Config</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="/p">
                Policies
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    );
    const item = screen.getByRole('link', { name: 'Policies' });
    expect(item).toHaveClass(
      'ps-[calc(var(--ui-sidebar-secondary-menu-item-global-container-padding-x)+var(--ui-sidebar-secondary-section-container-header-gap)+16px)]'
    );
  });

  it('uncontrolled: defaultExpanded initializes and the collapse trigger toggles the width/state', async () => {
    render(
      <SidebarSecondary defaultExpanded>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    const nav = screen.getByRole('navigation', { name: 'Section navigation' });
    expect(nav).toHaveAttribute('data-state', 'expanded');
    const trigger = screen.getByRole('button', { name: 'Collapse menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    expect(nav).toHaveAttribute('data-state', 'collapsed');
    // Re-query: button remounts inside Tooltip wrapper when collapsed.
    const collapsedTrigger = screen.getByRole('button', {
      name: 'Collapse menu',
    });
    expect(collapsedTrigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(collapsedTrigger);
    expect(nav).toHaveAttribute('data-state', 'expanded');
  });

  it('collapse trigger renders extras and hides label when collapsed', () => {
    const { rerender } = render(
      <SidebarSecondary defaultExpanded>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger
              extras={
                <SidebarSecondaryMenuItemExtras
                  variant="shortcut"
                  shortcut="⌘J"
                />
              }
            >
              Menu Item
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    expect(screen.getByText('Menu Item')).not.toHaveClass('sr-only');
    rerender(
      <SidebarSecondary expanded={false}>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger
              extras={
                <SidebarSecondaryMenuItemExtras
                  variant="shortcut"
                  shortcut="⌘J"
                />
              }
            >
              Menu Item
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    expect(screen.getByText('Menu Item')).toHaveClass('sr-only');
  });

  it('controlled: the collapse trigger calls onExpandedChange with the next value and the prop drives state', async () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <SidebarSecondary expanded onExpandedChange={onExpandedChange}>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    const nav = screen.getByRole('navigation', { name: 'Section navigation' });
    expect(nav).toHaveAttribute('data-state', 'expanded');
    await userEvent.click(
      screen.getByRole('button', { name: 'Collapse menu' })
    );
    expect(onExpandedChange).toHaveBeenCalledWith(false);
    expect(nav).toHaveAttribute('data-state', 'expanded');
    rerender(
      <SidebarSecondary expanded={false} onExpandedChange={onExpandedChange}>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    expect(nav).toHaveAttribute('data-state', 'collapsed');
  });

  it('forwards refs to the underlying nav and anchor', () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLAnchorElement>();
    render(
      <SidebarSecondary ref={navRef}>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem ref={itemRef} href="/x">
            X
          </SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondary>
    );
    expect(navRef.current?.tagName).toBe('NAV');
    expect(itemRef.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('composes a menu item with another element via the render prop', async () => {
    const onClick = vi.fn();
    render(
      <SidebarSecondaryMenu>
        <SidebarSecondaryMenuItem
          render={<button type="button" data-test onClick={onClick} />}
        >
          Toggle
        </SidebarSecondaryMenuItem>
      </SidebarSecondaryMenu>
    );
    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button).toHaveAttribute('data-test');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders each extras variant with the right affordance', () => {
    render(
      <SidebarSecondary>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem
            href="/a"
            extras={<SidebarSecondaryMenuItemExtras variant="externalLink" />}
          >
            Logs
          </SidebarSecondaryMenuItem>
          <SidebarSecondaryMenuItem
            href="/b"
            extras={
              <SidebarSecondaryMenuItemExtras
                variant="shortcut"
                shortcut="⌘F"
              />
            }
          >
            Search
          </SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondary>
    );
    const logs = screen.getByRole('link', { name: /Logs/ });
    expect(logs.querySelector('svg')).toBeInTheDocument();
    const searchRow = screen.getByRole('link', { name: /Search/ });
    expect(within(searchRow).getByText('⌘F')).toBeInTheDocument();
  });
});

describe('SidebarSecondary — expandable section', () => {
  function ExpandableSection(
    props: React.ComponentProps<typeof SidebarSecondarySection>
  ) {
    return (
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable {...props}>
            <SidebarSecondarySectionLabel
              actions={<button type="button">Add</button>}
              unreadRollup={<span>3</span>}
            >
              Configuration
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="/policies">
                Policies
              </SidebarSecondaryMenuItem>
              <SidebarSecondaryMenuItem href="/addons">
                Add-ons
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    );
  }

  it('renders the section label as a collapsible trigger, open by default', () => {
    render(<ExpandableSection />);
    const trigger = screen.getByRole('button', { name: /Configuration/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Policies' })).toBeInTheDocument();
  });

  it('collapses and expands the whole section, hiding/showing its items', async () => {
    render(<ExpandableSection />);
    const trigger = screen.getByRole('button', { name: /Configuration/ });

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: 'Policies' })
    ).not.toBeInTheDocument();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Policies' })).toBeInTheDocument();
  });

  it('honors a controlled open state via onOpenChange', async () => {
    const onOpenChange = vi.fn();
    render(<ExpandableSection open={false} onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: /Configuration/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: 'Policies' })
    ).not.toBeInTheDocument();

    await userEvent.click(trigger);
    // Base UI calls onOpenChange with (nextOpen, eventDetails); assert the value.
    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls[0][0]).toBe(true);
    // Still closed — the consumer owns `open`.
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps header actions operable outside the toggle (no nested buttons)', async () => {
    const onAdd = vi.fn();
    render(
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel
              actions={
                <button type="button" onClick={onAdd}>
                  Add
                </button>
              }
            >
              Configuration
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="/policies">
                Policies
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    );
    const toggle = screen.getByRole('button', { name: /Configuration/ });
    const add = screen.getByRole('button', { name: 'Add' });
    // The action is a sibling of the toggle, not nested inside it.
    expect(toggle).not.toContainElement(add);
    await userEvent.click(add);
    expect(onAdd).toHaveBeenCalledTimes(1);
    // Clicking the action did not toggle the section.
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('static sections still render a plain (non-button) label', () => {
    render(
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondarySectionLabel>
              Overview
            </SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="/d">
                Dashboard
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    );
    expect(
      screen.queryByRole('button', { name: /Overview/ })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});

describe('Resize', () => {
  it('renders resize edge by default (resizable defaults to true)', () => {
    render(<Panel />);
    expect(
      screen.getByRole('separator', { name: /resize sidebar/i })
    ).toBeInTheDocument();
  });

  it('does not render resize edge when resizable is false', () => {
    render(<Panel resizable={false} />);
    expect(
      screen.queryByRole('separator', { name: /resize sidebar/i })
    ).not.toBeInTheDocument();
  });

  it('clicking the resize edge toggles expanded state (after debounce)', async () => {
    const onChange = vi.fn();
    render(<Panel resizable onExpandedChange={onChange} />);
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    await userEvent.click(edge);
    // Click is delayed 250ms to allow double-click disambiguation.
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  it('double-clicking the resize edge resets width without toggling', async () => {
    const onWidth = vi.fn();
    const onChange = vi.fn();
    render(
      <Panel resizable onWidthChange={onWidth} onExpandedChange={onChange} />
    );
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    await userEvent.dblClick(edge);
    // Double-click resets to the token-derived defaultWidth.
    await waitFor(() => {
      expect(onWidth).toHaveBeenCalled();
    });
    // Single-click should have been cancelled by the double-click.
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not apply inline width at default (CSS token drives width)', () => {
    render(<Panel resizable />);
    const nav = screen.getByRole('navigation');
    // No inline width — the CSS token --ui-sidebar-secondary-expanded-container-width drives it.
    expect(nav.style.width).toBe('');
  });

  it('applies inline width when controlled via width prop', () => {
    render(<Panel resizable width={400} />);
    const nav = screen.getByRole('navigation');
    expect(nav.style.width).toBe('400px');
  });

  it('does not apply inline width when not resizable', () => {
    render(<Panel resizable={false} />);
    const nav = screen.getByRole('navigation');
    expect(nav.style.width).toBe('');
  });

  it('resize edge has 17px hit area', () => {
    render(<Panel />);
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    expect(edge).toHaveClass('w-[17px]');
  });

  it('Space key toggles expanded state on resize edge', async () => {
    const onChange = vi.fn();
    render(<Panel resizable onExpandedChange={onChange} />);
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    edge.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('ArrowRight expands when sidebar is collapsed', async () => {
    const onChange = vi.fn();
    render(<Panel resizable expanded={false} onExpandedChange={onChange} />);
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    edge.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('SidebarSecondary — collapsible={false}', () => {
  function CollapsiblePanel(
    props: React.ComponentProps<typeof SidebarSecondary>
  ) {
    return (
      <SidebarSecondary {...props}>
        <SidebarSecondaryHeader label="Protection" />
        <SidebarSecondaryContent>
          <SidebarSecondarySection>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="/dashboard" selected>
                Dashboard
              </SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
  }

  /** Simulates a drag on the resize edge to `clientX` and releases. */
  function dragEdgeTo(edge: HTMLElement, clientX: number) {
    fireEvent.pointerDown(edge, { pointerId: 1, clientX: 256 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX });
    fireEvent.pointerUp(window, { pointerId: 1, clientX });
  }

  it('blocks click-to-collapse on the resize edge', async () => {
    const onChange = vi.fn();
    render(
      <Panel resizable collapsible={false} onExpandedChange={onChange} />
    );
    const nav = screen.getByRole('navigation');
    await userEvent.click(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(onChange).not.toHaveBeenCalled();
    expect(nav).toHaveAttribute('data-state', 'expanded');
  });

  it('blocks the double-click collapse path but still resets the width', async () => {
    const onWidth = vi.fn();
    const onChange = vi.fn();
    render(
      <Panel
        resizable
        collapsible={false}
        expanded={false}
        onWidthChange={onWidth}
        onExpandedChange={onChange}
      />
    );
    await userEvent.dblClick(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    await waitFor(() => {
      expect(onWidth).toHaveBeenCalled();
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('blocks keyboard collapse (Space) and arrow-grow while collapsed', async () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <Panel resizable collapsible={false} onExpandedChange={onChange} />
    );
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    edge.focus();
    await userEvent.keyboard(' ');
    expect(onChange).not.toHaveBeenCalled();
    unmount();

    render(
      <Panel
        resizable
        collapsible={false}
        expanded={false}
        onExpandedChange={onChange}
      />
    );
    const collapsedEdge = screen.getByRole('separator', {
      name: /resize sidebar/i,
    });
    collapsedEdge.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clamps ArrowLeft shrink to minWidth instead of collapsing', async () => {
    const onWidth = vi.fn();
    const onChange = vi.fn();
    render(
      <Panel
        resizable
        collapsible={false}
        onWidthChange={onWidth}
        onExpandedChange={onChange}
      />
    );
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    edge.focus();
    // Width starts at the 256px minimum, so a single step would drop below it.
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).not.toHaveBeenCalled();
    expect(onWidth).toHaveBeenLastCalledWith(256);
  });

  it('clamps a drag below the collapse threshold to minWidth', () => {
    const onWidth = vi.fn();
    const onChange = vi.fn();
    render(
      <Panel
        resizable
        collapsible={false}
        onWidthChange={onWidth}
        onExpandedChange={onChange}
      />
    );
    dragEdgeTo(
      screen.getByRole('separator', { name: /resize sidebar/i }),
      20
    );
    expect(onChange).not.toHaveBeenCalled();
    expect(onWidth).toHaveBeenLastCalledWith(256);
  });

  it('still resizes above the minimum while not collapsible', () => {
    const onWidth = vi.fn();
    render(<Panel resizable collapsible={false} onWidthChange={onWidth} />);
    dragEdgeTo(
      screen.getByRole('separator', { name: /resize sidebar/i }),
      400
    );
    expect(onWidth).toHaveBeenLastCalledWith(400);
  });

  it('natively disables the collapse trigger and drops aria-expanded', async () => {
    const onChange = vi.fn();
    render(
      <CollapsiblePanel collapsible={false} onExpandedChange={onChange} />
    );
    const trigger = screen.getByRole('button', { name: 'Collapse menu' });
    expect(trigger).toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-expanded');
    await userEvent.click(trigger);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders permanently collapsed with defaultExpanded={false} and no way out', async () => {
    const onChange = vi.fn();
    render(
      <CollapsiblePanel
        collapsible={false}
        defaultExpanded={false}
        onExpandedChange={onChange}
      />
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-state', 'collapsed');

    await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    await userEvent.click(edge);
    await new Promise((resolve) => setTimeout(resolve, 300));
    edge.focus();
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{Home}');
    dragEdgeTo(edge, 400);

    expect(onChange).not.toHaveBeenCalled();
    expect(nav).toHaveAttribute('data-state', 'collapsed');
  });

  it('Home still resets the stored width while collapsed and non-collapsible', async () => {
    const onWidth = vi.fn();
    render(
      <Panel
        resizable
        collapsible={false}
        defaultExpanded={false}
        onWidthChange={onWidth}
      />
    );
    const nav = screen.getByRole('navigation');
    const edge = screen.getByRole('separator', { name: /resize sidebar/i });
    edge.focus();
    fireEvent.keyDown(edge, { key: 'Home' });

    // Only the expand toggle is gated by `collapsible`; the width reset still runs.
    expect(onWidth).toHaveBeenCalledWith(256);
    expect(nav).toHaveAttribute('data-state', 'collapsed');
  });

  it('gives the disabled collapse trigger a not-allowed cursor and no hover fill', () => {
    render(<CollapsiblePanel collapsible={false} />);
    const trigger = screen.getByRole('button', { name: 'Collapse menu' });
    expect(trigger).toHaveClass('disabled:cursor-not-allowed');
    expect(trigger).toHaveClass(
      'disabled:hover:bg-[var(--ui-sidebar-secondary-menu-item-unselected-container-color-idle)]'
    );
    expect(trigger).toHaveClass(
      'disabled:text-[var(--ui-text-on-surface-disabled)]'
    );
  });

  it('keeps only "Reset size: Double click" in the collapsed tooltip when not collapsible', async () => {
    render(
      <TooltipProvider delay={0}>
        <Panel resizable collapsible={false} expanded={false} />
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    // Positive assertion first: proves the tooltip machinery actually ran, so
    // the negative assertions below can't pass vacuously.
    expect(await screen.findByText('Reset size:')).toBeInTheDocument();
    expect(screen.getByText(/Double click/)).toBeInTheDocument();
    expect(screen.queryByText('Resize:')).not.toBeInTheDocument();
    expect(screen.queryByText('Expand:')).not.toBeInTheDocument();
    expect(screen.queryByText('Collapse:')).not.toBeInTheDocument();
  });

  it('drops the "Collapse: Click" line from the expanded resize tooltip', async () => {
    render(
      <TooltipProvider delay={0}>
        <Panel resizable collapsible={false} />
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    expect(await screen.findByText('Resize:')).toBeInTheDocument();
    expect(screen.getByText('Reset size:')).toBeInTheDocument();
    expect(screen.queryByText('Collapse:')).not.toBeInTheDocument();
  });

  it('still shows "Collapse: Click" in the expanded tooltip when collapsible', async () => {
    render(
      <TooltipProvider delay={0}>
        <Panel resizable />
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    expect(await screen.findByText('Collapse:')).toBeInTheDocument();
  });

  it('honours an explicit expanded tooltip override when not collapsible', async () => {
    render(
      <TooltipProvider delay={0}>
        <Panel
          resizable
          collapsible={false}
          resizeTooltipExpanded="Ancho ajustable"
        />
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    expect(await screen.findByText('Ancho ajustable')).toBeInTheDocument();
  });

  it('still shows "Expand: Click" in the collapsed tooltip when collapsible', async () => {
    render(
      <TooltipProvider delay={0}>
        <Panel resizable expanded={false} />
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    expect(await screen.findByText('Expand:')).toBeInTheDocument();
  });

  it('honours an explicit collapsed tooltip override when not collapsible', async () => {
    render(
      <TooltipProvider delay={0}>
        <Panel
          resizable
          collapsible={false}
          expanded={false}
          resizeTooltipCollapsed="Ancho fijo"
        />
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByRole('separator', { name: /resize sidebar/i })
    );
    expect(await screen.findByText('Ancho fijo')).toBeInTheDocument();
  });

  it('defaults to collapsible: the collapse trigger stays enabled and toggles', async () => {
    const onChange = vi.fn();
    render(<CollapsiblePanel onExpandedChange={onChange} />);
    const trigger = screen.getByRole('button', { name: 'Collapse menu' });
    expect(trigger).toBeEnabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});

describe('SidebarSecondary — cursor styles', () => {
  it('menu items have cursor-pointer', () => {
    render(<Panel />);
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveClass('cursor-pointer');
  });

  it('expandable section labels have cursor-pointer', () => {
    render(
      <SidebarSecondary>
        <SidebarSecondaryContent>
          <SidebarSecondarySection expandable>
            <SidebarSecondarySectionLabel>Config</SidebarSecondarySectionLabel>
            <SidebarSecondaryMenu>
              <SidebarSecondaryMenuItem href="/p">Policies</SidebarSecondaryMenuItem>
            </SidebarSecondaryMenu>
          </SidebarSecondarySection>
        </SidebarSecondaryContent>
      </SidebarSecondary>
    );
    const trigger = screen.getByRole('button', { name: /Config/ });
    expect(trigger).toHaveClass('cursor-pointer');
  });
});

describe('SidebarSecondary — Space key on anchor items', () => {
  it('Space activates a focused menu item anchor', async () => {
    const onClick = vi.fn();
    render(
      <SidebarSecondary>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuItem href="/test" onClick={onClick}>
            Test item
          </SidebarSecondaryMenuItem>
        </SidebarSecondaryMenu>
      </SidebarSecondary>
    );
    const link = screen.getByRole('link', { name: 'Test item' });
    link.focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalled();
  });
});

describe('SidebarSecondary — collapse trigger icon rotation (unified with Primary)', () => {
  it('rotates the same icon element between expanded and collapsed instead of swapping icons', async () => {
    render(
      <SidebarSecondary defaultExpanded>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger icon={<svg data-testid="chevron" />}>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    const icon = screen.getByTestId('chevron');
    const wrapper = icon.parentElement!;
    expect(wrapper).toHaveClass('rtl:rotate-180');
    await userEvent.click(
      screen.getByRole('button', { name: 'Collapse menu' })
    );
    // Same icon node stays mounted — only the rotation class flips (no
    // `expandIcon` swap, unifying with `SidebarPrimaryCollapseTrigger`).
    expect(screen.getByTestId('chevron')).toBe(icon);
    expect(wrapper).toHaveClass('ltr:rotate-180');
  });
});

describe('SidebarSecondary — tooltip placement and collapsed-mode visibility', () => {
  it('opens the truncation tooltip on the right', async () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    render(
      <TooltipProvider delay={0}>
        <SidebarSecondary>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem href="/a">
              Protection management console
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondary>
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByText('Protection management console')
    );
    const [, tooltip] = await screen.findAllByText(
      'Protection management console'
    );
    expect(tooltip.closest('[data-side]')).toHaveAttribute(
      'data-side',
      'right'
    );
    vi.restoreAllMocks();
  });

  it('always shows the item label as a tooltip when collapsed, even though the sr-only label never overflows', async () => {
    render(
      <TooltipProvider delay={0}>
        <SidebarSecondary expanded={false}>
          <SidebarSecondaryMenu>
            <SidebarSecondaryMenuItem
              href="/a"
              icon={<svg data-testid="icon" />}
            >
              Assets
            </SidebarSecondaryMenuItem>
          </SidebarSecondaryMenu>
        </SidebarSecondary>
      </TooltipProvider>
    );
    await userEvent.hover(screen.getByTestId('icon'));
    expect(await screen.findAllByText('Assets')).toHaveLength(2);
  });
});

describe('SidebarSecondary — CollapseTrigger focus retention', () => {
  it('focus stays on collapse trigger after toggling expanded state', async () => {
    render(
      <SidebarSecondary defaultExpanded>
        <SidebarSecondaryFooter>
          <SidebarSecondaryMenu>
            <SidebarSecondaryCollapseTrigger>
              Collapse menu
            </SidebarSecondaryCollapseTrigger>
          </SidebarSecondaryMenu>
        </SidebarSecondaryFooter>
      </SidebarSecondary>
    );
    const trigger = screen.getByRole('button', { name: 'Collapse menu' });
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
    await userEvent.click(trigger);
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: 'Collapse menu' });
      expect(document.activeElement).toBe(btn);
    });
  });
});
