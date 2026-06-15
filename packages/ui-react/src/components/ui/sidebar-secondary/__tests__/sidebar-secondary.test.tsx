import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  SidebarSecondary,
  SidebarSecondaryCollapsedBreadcrumb,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuItemExtras,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
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
            <SidebarSecondaryMenuSub defaultOpen>
              <SidebarSecondaryMenuSubTrigger>
                Policies
              </SidebarSecondaryMenuSubTrigger>
              <SidebarSecondaryMenuSubContent>
                <SidebarSecondaryMenuSubItem href="/policies/backup" selected>
                  Backup
                </SidebarSecondaryMenuSubItem>
                <SidebarSecondaryMenuSubItem href="/policies/av">
                  Antivirus
                </SidebarSecondaryMenuSubItem>
              </SidebarSecondaryMenuSubContent>
            </SidebarSecondaryMenuSub>
          </SidebarSecondaryMenu>
        </SidebarSecondarySection>
      </SidebarSecondaryContent>
      <SidebarSecondaryCollapsedBreadcrumb
        parentLabel="Protection"
        currentLabel="Dashboard"
      />
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
      'text-[var(--ui-sidebar-secondary-menu-item-global-label-color-idle)]'
    );
    expect(devices).toHaveClass(
      'text-[var(--ui-sidebar-secondary-menu-item-global-label-color-idle)]'
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

  it('indents level-2 sub-items', () => {
    render(<Panel />);
    const backup = screen.getByRole('link', { name: 'Backup' });
    expect(backup).toHaveClass(
      'pl-[var(--ui-sidebar-secondary-menu-item-global-level2-container-padding-l)]'
    );
  });

  it('wires the disclosure: trigger toggles the panel via Base UI Collapsible', async () => {
    render(
      <SidebarSecondary>
        <SidebarSecondaryMenu>
          <SidebarSecondaryMenuSub>
            <SidebarSecondaryMenuSubTrigger>
              Policies
            </SidebarSecondaryMenuSubTrigger>
            <SidebarSecondaryMenuSubContent>
              <SidebarSecondaryMenuSubItem href="/p/a">
                Backup
              </SidebarSecondaryMenuSubItem>
            </SidebarSecondaryMenuSubContent>
          </SidebarSecondaryMenuSub>
        </SidebarSecondaryMenu>
      </SidebarSecondary>
    );
    const trigger = screen.getByRole('button', { name: /Policies/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Backup' })).toBeInTheDocument();
  });

  it('opens the disclosure initially with defaultOpen', () => {
    render(<Panel />);
    const trigger = screen.getByRole('button', { name: /Policies/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
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
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(nav).toHaveAttribute('data-state', 'expanded');
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
    await userEvent.click(screen.getByRole('button', { name: 'Collapse menu' }));
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
          <SidebarSecondaryMenuItem href="/a">
            Logs
            <SidebarSecondaryMenuItemExtras variant="externalLink" />
          </SidebarSecondaryMenuItem>
          <SidebarSecondaryMenuItem href="/b">
            Search
            <SidebarSecondaryMenuItemExtras variant="shortcut" shortcut="⌘F" />
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
