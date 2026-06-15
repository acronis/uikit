import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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
} from '../sidebar-primary';

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

  it('forwards refs to the underlying nav and anchor', () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLAnchorElement>();
    render(
      <SidebarPrimary ref={navRef}>
        <SidebarPrimaryMenu>
          <SidebarPrimaryMenuItem ref={itemRef} href="/x">
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
          <SidebarPrimaryMenuItem href="/a">
            Inbox
            <SidebarPrimaryMenuItemExtras variant="externalLink" />
          </SidebarPrimaryMenuItem>
          <SidebarPrimaryMenuItem href="/b">
            Home
            <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />
          </SidebarPrimaryMenuItem>
        </SidebarPrimaryMenu>
      </SidebarPrimary>
    );
    const inbox = screen.getByRole('link', { name: /Inbox/ });
    expect(inbox.querySelector('svg')).toBeInTheDocument();
    const home = screen.getByRole('link', { name: /Home/ });
    expect(within(home).getByText('⌘H')).toBeInTheDocument();
  });
});
