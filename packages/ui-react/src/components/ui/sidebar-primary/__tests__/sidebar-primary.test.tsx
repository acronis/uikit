import { createRef, useRef } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TooltipProvider } from '../../tooltip';
import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
  useIsOverflowing,
} from '../sidebar-primary';

// happy-dom's layout metrics are always 0, so `useIsOverflowing`'s
// `scrollWidth > clientWidth` check never trips on its own — mock the
// prototype getters to simulate a clipped (or not) label.
function mockOverflow(overflowing: boolean) {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
    overflowing ? 200 : 100
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
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

function OverflowProbe({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isOverflowing = useIsOverflowing(ref, { enabled });
  return <div ref={ref}>{isOverflowing ? 'overflowing' : 'not-overflowing'}</div>;
}

function Rail(props: React.ComponentProps<typeof SidebarPrimary>) {
  return (
    <SidebarPrimary {...props}>
      <SidebarPrimaryHeader>
        <svg data-testid="logo" />
      </SidebarPrimaryHeader>
      <SidebarPrimaryContent>
        <SidebarPrimarySection>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="/assets" icon={<svg />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="/clients" icon={<svg />}>
              Clients
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimarySection>
      </SidebarPrimaryContent>
      <SidebarPrimaryFooter>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="/help" icon={<svg />}>
            Help
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimaryFooter>
    </SidebarPrimary>
  );
}

describe('SidebarPrimary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the composed rail without error', () => {
    render(<Rail />);
    expect(
      screen.getByRole('navigation', { name: 'Primary' })
    ).toBeInTheDocument();
  });

  it('exposes a distinguishing nav landmark label', () => {
    render(<Rail aria-label="Workspace" />);
    expect(
      screen.getByRole('navigation', { name: 'Workspace' })
    ).toBeInTheDocument();
  });

  it('renders menus as lists of link items', () => {
    render(<Rail />);
    const lists = screen.getAllByRole('list');
    expect(lists.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Assets' })).toHaveAttribute(
      'href',
      '/assets'
    );
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3);
  });

  it('marks the selected item with aria-current="page" and the unselected one without', () => {
    render(<Rail />);
    expect(screen.getByRole('link', { name: 'Assets' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Clients' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('applies the selected vs unselected container token classes', () => {
    render(<Rail />);
    expect(screen.getByRole('link', { name: 'Assets' })).toHaveClass(
      'bg-[var(--ui-sidebar-primary-menu-item-selected-container-color-idle)]'
    );
    expect(screen.getByRole('link', { name: 'Clients' })).toHaveClass(
      'bg-[var(--ui-sidebar-primary-menu-item-unselected-container-color-idle)]'
    );
  });

  it('defaults to the expanded state', () => {
    render(<Rail />);
    expect(
      screen.getByRole('navigation', { name: 'Primary' })
    ).toHaveAttribute('data-state', 'expanded');
  });

  it('reflects a controlled collapsed state and keeps labels accessible', () => {
    render(<Rail expanded={false} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveAttribute('data-state', 'collapsed');
    // Labels stay in the DOM (sr-only) when collapsed, so the icon-only rows
    // keep an accessible name.
    expect(screen.getByRole('link', { name: 'Assets' })).toBeInTheDocument();
  });

  it('uncontrolled: defaultExpanded initializes and the collapse trigger toggles the width/state', async () => {
    render(
      <SidebarPrimary defaultExpanded>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    );
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveAttribute('data-state', 'expanded');
    const trigger = screen.getByRole('button', { name: 'Collapse menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    expect(nav).toHaveAttribute('data-state', 'collapsed');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(nav).toHaveAttribute('data-state', 'expanded');
  });

  it('controlled: the collapse trigger calls onExpandedChange with the next value and the prop drives state', async () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <SidebarPrimary expanded onExpandedChange={onExpandedChange}>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    );
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveAttribute('data-state', 'expanded');
    await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
    // Controlled: the callback fires with the next value, but the internal state
    // does NOT change — the prop continues to drive it.
    expect(onExpandedChange).toHaveBeenCalledWith(false);
    expect(nav).toHaveAttribute('data-state', 'expanded');
    // Consumer applies the new value → the rail collapses.
    rerender(
      <SidebarPrimary expanded={false} onExpandedChange={onExpandedChange}>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    );
    expect(nav).toHaveAttribute('data-state', 'collapsed');
  });

  describe('SidebarPrimaryHeader logo/collapsedLogo', () => {
    it('renders logo when expanded and collapsedLogo when collapsed', () => {
      const { rerender } = render(
        <SidebarPrimary expanded>
          <SidebarPrimaryHeader
            logo={<span data-testid="expanded-logo" />}
            collapsedLogo={<span data-testid="collapsed-logo" />}
          />
        </SidebarPrimary>
      );
      expect(screen.getByTestId('expanded-logo')).toBeInTheDocument();
      expect(screen.queryByTestId('collapsed-logo')).not.toBeInTheDocument();

      rerender(
        <SidebarPrimary expanded={false}>
          <SidebarPrimaryHeader
            logo={<span data-testid="expanded-logo" />}
            collapsedLogo={<span data-testid="collapsed-logo" />}
          />
        </SidebarPrimary>
      );
      expect(screen.getByTestId('collapsed-logo')).toBeInTheDocument();
      expect(screen.queryByTestId('expanded-logo')).not.toBeInTheDocument();
    });

    it('falls back to logo when collapsedLogo is omitted, and vice versa', () => {
      const { rerender } = render(
        <SidebarPrimary expanded={false}>
          <SidebarPrimaryHeader logo={<span data-testid="only-logo" />} />
        </SidebarPrimary>
      );
      expect(screen.getByTestId('only-logo')).toBeInTheDocument();

      rerender(
        <SidebarPrimary expanded>
          <SidebarPrimaryHeader
            collapsedLogo={<span data-testid="only-collapsed-logo" />}
          />
        </SidebarPrimary>
      );
      expect(screen.getByTestId('only-collapsed-logo')).toBeInTheDocument();
    });

    it('renders children in both states when neither logo nor collapsedLogo is given', () => {
      const { rerender } = render(
        <SidebarPrimary expanded>
          <SidebarPrimaryHeader>
            <span data-testid="single-logo" />
          </SidebarPrimaryHeader>
        </SidebarPrimary>
      );
      expect(screen.getByTestId('single-logo')).toBeInTheDocument();

      rerender(
        <SidebarPrimary expanded={false}>
          <SidebarPrimaryHeader>
            <span data-testid="single-logo" />
          </SidebarPrimaryHeader>
        </SidebarPrimary>
      );
      expect(screen.getByTestId('single-logo')).toBeInTheDocument();
    });
  });

  it('forwards refs to the underlying nav and anchor', () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLAnchorElement>();
    render(
      <SidebarPrimary ref={navRef}>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem ref={itemRef} href="/x" noIcon>
            X
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimary>
    );
    expect(navRef.current?.tagName).toBe('NAV');
    expect(itemRef.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('composes a menu item with another element via the render prop', async () => {
    const onClick = vi.fn();
    render(
      <SidebarPrimaryMenu>
        <SidebarPrimaryMenuItem
          render={<button type="button" data-test onClick={onClick} />}
          noIcon
        >
          Toggle
        </SidebarPrimaryMenuItem>
      </SidebarPrimaryMenu>
    );
    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button).toHaveAttribute('data-test');
    expect(button).toHaveClass(
      'bg-[var(--ui-sidebar-primary-menu-item-unselected-container-color-idle)]'
    );
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders each extras variant with the right affordance', () => {
    render(
      <SidebarPrimary>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem
            href="/a"
            noIcon
            extras={<SidebarPrimaryMenuItemExtras variant="externalLink" />}
          >
            Inbox
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem
            href="/b"
            noIcon
            extras={
              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />
            }
          >
            Home
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimary>
    );
    const inbox = screen.getByRole('link', { name: /Inbox/ });
    expect(inbox.querySelector('svg')).toBeInTheDocument();
    const home = screen.getByRole('link', { name: /Home/ });
    expect(within(home).getByText('⌘H')).toBeInTheDocument();
  });

  it('renders extras as a sibling of the label, not nested inside its truncating span', () => {
    render(
      <SidebarPrimary>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem
            href="/a"
            noIcon
            extras={<SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />}
          >
            Home
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimary>
    );
    const link = screen.getByRole('link', { name: /Home/ });
    const labelSpan = screen.getByText('Home');
    // The shortcut text must NOT be inside the truncating label span — it's a
    // flex sibling so it gets the row's gap instead of being crammed against
    // the label text (see sidebar-primary.tsx SidebarPrimaryMenuItem `extras`).
    expect(labelSpan).toHaveClass('truncate');
    expect(within(labelSpan).queryByText('⌘H')).not.toBeInTheDocument();
    expect(within(link).getByText('⌘H')).toBeInTheDocument();
  });

  it('hides a raw (non-SidebarPrimaryMenuItemExtras) extras node in collapsed/rail mode', () => {
    render(
      <SidebarPrimary expanded={false}>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="/a" noIcon extras={<span>99+</span>}>
            Inbox
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger extras={<span>99+</span>}>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    );
    const [itemExtras, triggerExtras] = screen.getAllByText('99+');
    expect(itemExtras.parentElement).toHaveClass('hidden');
    expect(triggerExtras.parentElement).toHaveClass('hidden');
  });

  it('gives the footer collapse trigger a shortcut extras slot as well', () => {
    render(
      <SidebarPrimary>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger
              extras={
                <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />
              }
            >
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    );
    const trigger = screen.getByRole('button', { name: /Collapse menu/ });
    expect(within(trigger).getByText('⌘H')).toBeInTheDocument();
  });

  describe('truncation tooltip', () => {
    it('keeps min-w-0 alongside truncate on the label so it actually clips in a flex row', () => {
      render(
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="/a" noIcon>
            Protection management console
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      );
      expect(screen.getByText('Protection management console')).toHaveClass(
        'min-w-0',
        'truncate'
      );
    });

    it('does not open the tooltip when the label is not clipped', async () => {
      mockOverflow(false);
      render(
        <TooltipProvider delay={0}>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="/a" noIcon>
              Assets
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </TooltipProvider>
      );
      await userEvent.hover(screen.getByText('Assets'));
      expect(screen.getAllByText('Assets')).toHaveLength(1);
    });

    it('opens a tooltip with the full label when it is clipped', async () => {
      mockOverflow(true);
      render(
        <TooltipProvider delay={0}>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem href="/a" noIcon>
              Protection management console
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </TooltipProvider>
      );
      await userEvent.hover(
        screen.getByText('Protection management console')
      );
      expect(
        await screen.findAllByText('Protection management console')
      ).toHaveLength(2);
    });

    it('does not open the tooltip when hovering the icon or the extras, only the label', async () => {
      mockOverflow(true);
      render(
        <TooltipProvider delay={0}>
          <SidebarPrimaryMenu>
            <SidebarPrimaryMenuItem
              href="/a"
              icon={<svg data-testid="icon" />}
              extras={
                <SidebarPrimaryMenuItemExtras
                  variant="shortcut"
                  shortcut="⌘H"
                />
              }
            >
              Protection management console
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </TooltipProvider>
      );
      await userEvent.hover(screen.getByTestId('icon'));
      await userEvent.hover(screen.getByText('⌘H'));
      expect(
        screen.getAllByText('Protection management console')
      ).toHaveLength(1);
    });

    it('always opens the tooltip in collapsed/rail mode, regardless of overflow, since the label is sr-only', async () => {
      mockOverflow(false);
      render(
        <TooltipProvider delay={0}>
          <SidebarPrimary expanded={false}>
            <SidebarPrimaryMenu>
              <SidebarPrimaryMenuItem href="/a" icon={<svg data-testid="icon" />}>
                Assets
              </SidebarPrimaryMenuItem>
            </SidebarPrimaryMenu>
          </SidebarPrimary>
        </TooltipProvider>
      );
      // The label is `sr-only` while collapsed, so it can never receive the
      // hover that would open its own inner tooltip — hovering the (only
      // visible) icon must still surface the full label as a tooltip.
      await userEvent.hover(screen.getByTestId('icon'));
      expect(await screen.findAllByText('Assets')).toHaveLength(2);
    });

    it('applies the same clipped-only tooltip behavior to the collapse trigger label', async () => {
      mockOverflow(true);
      render(
        <TooltipProvider delay={0}>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger>
              Collapse this very long navigation menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </TooltipProvider>
      );
      await userEvent.hover(
        screen.getByText('Collapse this very long navigation menu')
      );
      expect(
        await screen.findAllByText('Collapse this very long navigation menu')
      ).toHaveLength(2);
    });
  });
});

describe('SidebarPrimary — required icon (noIcon escape hatch)', () => {
  it('renders the icon wrapper when icon is given', () => {
    render(
      <SidebarPrimaryMenu>
        <SidebarPrimaryMenuItem href="/a" icon={<svg data-testid="icon" />}>
          Assets
        </SidebarPrimaryMenuItem>
      </SidebarPrimaryMenu>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders no icon wrapper when noIcon is set', () => {
    render(
      <SidebarPrimaryMenu>
        <SidebarPrimaryMenuItem href="/a" noIcon>
          General settings
        </SidebarPrimaryMenuItem>
      </SidebarPrimaryMenu>
    );
    const link = screen.getByRole('link', { name: 'General settings' });
    expect(link.querySelector('svg')).not.toBeInTheDocument();
  });
});

describe('SidebarPrimary — collapse trigger cursor and icon rotation', () => {
  it('gives the collapse trigger button a pointer cursor', () => {
    render(
      <SidebarPrimaryMenu>
        <SidebarPrimaryCollapseTrigger icon={<svg data-testid="chevron" />}>
          Collapse menu
        </SidebarPrimaryCollapseTrigger>
      </SidebarPrimaryMenu>
    );
    expect(screen.getByRole('button', { name: 'Collapse menu' })).toHaveClass(
      'cursor-pointer'
    );
  });

  it('rotates the same icon element between expanded and collapsed instead of swapping icons', async () => {
    render(
      <SidebarPrimary defaultExpanded>
        <SidebarPrimaryFooter>
          <SidebarPrimaryMenu>
            <SidebarPrimaryCollapseTrigger icon={<svg data-testid="chevron" />}>
              Collapse menu
            </SidebarPrimaryCollapseTrigger>
          </SidebarPrimaryMenu>
        </SidebarPrimaryFooter>
      </SidebarPrimary>
    );
    const icon = screen.getByTestId('chevron');
    const wrapper = icon.parentElement!;
    expect(wrapper).toHaveClass('rtl:rotate-180');
    await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
    // Same icon node stays mounted — only the rotation class flips.
    expect(screen.getByTestId('chevron')).toBe(icon);
    expect(wrapper).toHaveClass('ltr:rotate-180');
  });
});

describe('SidebarPrimary — header transition sync (no jump between logo sizes)', () => {
  it('transitions header padding and logo height alongside the rail width transition', () => {
    render(
      <SidebarPrimary>
        <SidebarPrimaryHeader>
          <svg data-testid="logo" />
        </SidebarPrimaryHeader>
      </SidebarPrimary>
    );
    const header = screen.getByTestId('logo').parentElement!;
    expect(header).toHaveClass('transition-[padding]');
    expect(header).toHaveClass(
      '[&_:where(img,svg)]:transition-[height]'
    );
  });
});

describe('SidebarPrimary — tooltip placement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens the truncation tooltip on the right', async () => {
    mockOverflow(true);
    render(
      <TooltipProvider delay={0}>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem href="/a" noIcon>
            Protection management console
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </TooltipProvider>
    );
    await userEvent.hover(
      screen.getByText('Protection management console')
    );
    const [, tooltip] = await screen.findAllByText(
      'Protection management console'
    );
    expect(tooltip.closest('[data-side]')).toHaveAttribute('data-side', 'right');
  });
});

describe('SidebarPrimary — Space key activation', () => {
  it('activates a focused menu item anchor on Space', async () => {
    const onClick = vi.fn();
    render(
      <SidebarPrimaryMenu>
        <SidebarPrimaryMenuItem href="/test" noIcon onClick={onClick}>
          Test item
        </SidebarPrimaryMenuItem>
      </SidebarPrimaryMenu>
    );
    const link = screen.getByRole('link', { name: 'Test item' });
    link.focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalled();
  });
});

describe('useIsOverflowing', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    FakeResizeObserver.instances = [];
  });

  it('reports false when the element does not overflow', () => {
    mockOverflow(false);
    render(<OverflowProbe enabled />);
    expect(screen.getByText('not-overflowing')).toBeInTheDocument();
  });

  it('reports true when the element overflows', () => {
    mockOverflow(true);
    render(<OverflowProbe enabled />);
    expect(screen.getByText('overflowing')).toBeInTheDocument();
  });

  it('skips measuring while disabled, even if the element would overflow', () => {
    mockOverflow(true);
    render(<OverflowProbe enabled={false} />);
    expect(screen.getByText('not-overflowing')).toBeInTheDocument();
  });

  it('starts measuring (and can flip to true) once re-enabled', () => {
    mockOverflow(true);
    const { rerender } = render(<OverflowProbe enabled={false} />);
    expect(screen.getByText('not-overflowing')).toBeInTheDocument();

    rerender(<OverflowProbe enabled />);
    expect(screen.getByText('overflowing')).toBeInTheDocument();
  });

  it('re-measures via ResizeObserver when the observed element resizes', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    mockOverflow(false);
    render(<OverflowProbe enabled />);
    expect(screen.getByText('not-overflowing')).toBeInTheDocument();

    mockOverflow(true);
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });
    expect(screen.getByText('overflowing')).toBeInTheDocument();
  });

  it('disconnects the ResizeObserver on unmount', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    mockOverflow(false);
    const { unmount } = render(<OverflowProbe enabled />);
    const observer = FakeResizeObserver.instances[0];

    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });
});
