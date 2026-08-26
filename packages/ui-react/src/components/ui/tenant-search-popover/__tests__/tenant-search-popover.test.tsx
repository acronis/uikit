import { createRef, forwardRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  TenantSearchPopover,
  TenantSearchPopoverContent,
  TenantSearchPopoverTrigger,
  type TenantSearchItem,
  type TenantSearchPopoverContentProps,
} from '../tenant-search-popover';

const items: TenantSearchItem[] = [
  { id: 'all', label: 'All clients', tenantType: 'all-clients' },
  {
    id: 'acme',
    label: 'Acme Partner',
    tenantType: 'partner',
    children: [
      { id: 'acme-folder', label: 'Acme Folder', tenantType: 'folder' },
      { id: 'acme-unit', label: 'Acme Unit', tenantType: 'unit' },
    ],
  },
  { id: 'globex', label: 'Globex Client', tenantType: 'client' },
];

const recentItems: TenantSearchItem[] = [
  { id: 'globex', label: 'Globex Client', tenantType: 'client' },
];

const Demo = forwardRef<
  HTMLDivElement,
  Partial<TenantSearchPopoverContentProps>
>((props, ref) => (
  <TenantSearchPopover defaultOpen>
    <TenantSearchPopoverTrigger>Open</TenantSearchPopoverTrigger>
    <TenantSearchPopoverContent ref={ref} items={items} {...props} />
  </TenantSearchPopover>
));
Demo.displayName = 'Demo';

/** The row element carrying the treeitem role, by its visible label. */
function row(label: string): HTMLElement {
  return screen.getByRole('treeitem', { name: label });
}

describe('TenantSearchPopover', () => {
  it('opens from the trigger and renders both section headings', async () => {
    const user = userEvent.setup();
    render(
      <TenantSearchPopover>
        <TenantSearchPopoverTrigger>Open</TenantSearchPopoverTrigger>
        <TenantSearchPopoverContent items={items} recentItems={recentItems} />
      </TenantSearchPopover>
    );

    expect(screen.queryByText('Browse')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Browse')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
  });

  it('hides the Recent section when no recent items are supplied', () => {
    render(<Demo />);
    expect(screen.queryByText('Recent')).not.toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  it('renders one labelled tree per section', () => {
    render(<Demo recentItems={recentItems} />);
    const trees = screen.getAllByRole('tree');
    expect(trees).toHaveLength(2);
    expect(trees[0]).toHaveAccessibleName('Recent');
    expect(trees[1]).toHaveAccessibleName('Browse');
  });

  it('forwards a ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Demo ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('overrides every rendered string through props (localization)', () => {
    render(
      <Demo
        recentItems={recentItems}
        recentLabel="Recientes"
        browseLabel="Explorar"
        searchPlaceholder="Buscar"
        searchLabel="Buscar inquilinos"
      />
    );
    expect(screen.getByText('Recientes')).toBeInTheDocument();
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar inquilinos')).toHaveAttribute(
      'placeholder',
      'Buscar'
    );
  });

  describe('status states', () => {
    it('renders the loading label instead of the list', () => {
      render(<Demo status="loading" />);
      expect(screen.getByRole('status')).toHaveTextContent('Data is loading…');
      expect(screen.queryByRole('tree')).not.toBeInTheDocument();
    });

    it('renders the empty copy', () => {
      render(<Demo status="empty" emptyLabel="Nothing here" />);
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
      expect(screen.queryByRole('tree')).not.toBeInTheDocument();
    });

    it('renders the error copy and calls onRetry from the action', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<Demo status="error" onRetry={onRetry} />);
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Try again' }));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('falls back to the empty state when a query matches nothing', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.type(screen.getByLabelText('Search tenants'), 'zzz');
      expect(screen.getByText('No data found')).toBeInTheDocument();
      expect(screen.queryByRole('tree')).not.toBeInTheDocument();
    });
  });

  describe('search filtering', () => {
    it('keeps matching rows and drops the rest', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.type(screen.getByLabelText('Search tenants'), 'globex');
      expect(row('Globex Client')).toBeInTheDocument();
      expect(
        screen.queryByRole('treeitem', { name: 'All clients' })
      ).not.toBeInTheDocument();
    });

    it('keeps (and auto-expands) the ancestors of a nested match', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.type(screen.getByLabelText('Search tenants'), 'Acme Unit');
      expect(row('Acme Partner')).toHaveAttribute('aria-expanded', 'true');
      expect(row('Acme Unit')).toBeInTheDocument();
      expect(
        screen.queryByRole('treeitem', { name: 'Acme Folder' })
      ).not.toBeInTheDocument();
    });

    it('supports a controlled query', async () => {
      const user = userEvent.setup();
      const onQueryChange = vi.fn();

      function Controlled() {
        const [query, setQuery] = useState('');
        return (
          <TenantSearchPopover defaultOpen>
            <TenantSearchPopoverTrigger>Open</TenantSearchPopoverTrigger>
            <TenantSearchPopoverContent
              items={items}
              query={query}
              onQueryChange={(next) => {
                onQueryChange(next);
                setQuery(next);
              }}
            />
          </TenantSearchPopover>
        );
      }

      render(<Controlled />);
      await user.type(screen.getByLabelText('Search tenants'), 'g');
      expect(onQueryChange).toHaveBeenCalledWith('g');
      expect(
        screen.queryByRole('treeitem', { name: 'All clients' })
      ).not.toBeInTheDocument();
    });
  });

  describe('expand / collapse', () => {
    it('starts collapsed and reveals children on click', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      const parent = row('Acme Partner');
      expect(parent).toHaveAttribute('aria-expanded', 'false');
      expect(
        screen.queryByRole('treeitem', { name: 'Acme Folder' })
      ).not.toBeInTheDocument();

      await user.click(parent);
      expect(row('Acme Partner')).toHaveAttribute('aria-expanded', 'true');
      expect(row('Acme Folder')).toBeInTheDocument();

      await user.click(row('Acme Partner'));
      expect(
        screen.queryByRole('treeitem', { name: 'Acme Folder' })
      ).not.toBeInTheDocument();
    });

    it('owns the child group from the expanded parent row', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.click(row('Acme Partner'));
      const groupId = row('Acme Partner').getAttribute('aria-owns');
      expect(groupId).toBeTruthy();
      const group = document.getElementById(groupId!);
      expect(group).toHaveAttribute('role', 'group');
      expect(
        within(group!).getByRole('treeitem', { name: 'Acme Unit' })
      ).toBeInTheDocument();
    });

    it('does not select when a parent row is activated', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Demo onValueChange={onValueChange} />);
      await user.click(row('Acme Partner'));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('selection', () => {
    it('emits the tenant id on click', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Demo onValueChange={onValueChange} />);
      await user.click(row('Globex Client'));
      expect(onValueChange).toHaveBeenCalledWith('globex');
    });

    it('marks the selected row with the group/item + data-selected contract', () => {
      render(<Demo value="globex" />);
      const selected = row('Globex Client');
      // `InputSelectRowContent`'s `group-data-[selected]/item:*` classes only
      // resolve when the caller's row element carries both of these.
      expect(selected.className).toContain('group/item');
      expect(selected).toHaveAttribute('data-selected');
      expect(selected).toHaveAttribute('aria-selected', 'true');

      const unselected = row('All clients');
      expect(unselected).not.toHaveAttribute('data-selected');
      expect(unselected).toHaveAttribute('aria-selected', 'false');
    });

    it('shows a trailing check only on the selected row', () => {
      render(<Demo value="globex" />);
      expect(row('Globex Client').querySelectorAll('svg')).toHaveLength(2);
      expect(row('All clients').querySelectorAll('svg')).toHaveLength(1);
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus with the arrow keys and selects with Enter', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Demo onValueChange={onValueChange} />);

      await user.click(screen.getByLabelText('Search tenants'));
      await user.keyboard('{ArrowDown}');
      expect(row('All clients')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(row('Acme Partner')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(row('All clients')).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('all');
    });

    it('expands with ArrowRight, then moves into the subtree', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.click(screen.getByLabelText('Search tenants'));
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(row('Acme Partner')).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(row('Acme Partner')).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{ArrowRight}');
      expect(row('Acme Folder')).toHaveFocus();
    });

    it('collapses with ArrowLeft, then moves to the parent', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.click(row('Acme Partner'));
      await user.click(screen.getByLabelText('Search tenants'));
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
      expect(row('Acme Unit')).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(row('Acme Partner')).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(row('Acme Partner')).toHaveAttribute('aria-expanded', 'false');
    });

    it('jumps to the first and last visible row with Home / End', async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.click(screen.getByLabelText('Search tenants'));
      await user.keyboard('{ArrowDown}{End}');
      expect(row('Globex Client')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(row('All clients')).toHaveFocus();
    });

    it('keeps exactly one row tabbable (roving tabindex)', () => {
      render(<Demo />);
      const tabbable = screen
        .getAllByRole('treeitem')
        .filter((element) => element.getAttribute('tabindex') === '0');
      expect(tabbable).toHaveLength(1);
      expect(tabbable[0]).toBe(row('All clients'));
    });

    it('selects with Space as well as Enter', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Demo onValueChange={onValueChange} />);

      await user.click(screen.getByLabelText('Search tenants'));
      await user.keyboard('{ArrowDown}');
      expect(row('All clients')).toHaveFocus();

      await user.keyboard(' ');
      expect(onValueChange).toHaveBeenCalledWith('all');
    });
  });

  // "Recent" is a subset of "Browse", so the same tenant id legitimately shows
  // up in both lists. Internal bookkeeping is keyed per section for exactly
  // this reason; the public value contract stays the bare tenant id.
  describe('a tenant listed in both Recent and Browse', () => {
    it('treats the two rows as independent for focus and roving tabindex', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Demo recentItems={recentItems} onValueChange={onValueChange} />);

      const duplicated = screen.getAllByRole('treeitem', {
        name: 'Globex Client',
      });
      expect(duplicated).toHaveLength(2);
      expect(duplicated[0]).not.toBe(duplicated[1]);

      const visualOrder = screen.getAllByRole('treeitem');
      expect(
        visualOrder.map((element) => element.getAttribute('aria-label'))
      ).toEqual([
        'Globex Client',
        'All clients',
        'Acme Partner',
        'Globex Client',
      ]);

      const tabbable = () =>
        visualOrder.filter(
          (element) => element.getAttribute('tabindex') === '0'
        );
      // The Recent copy is the first visible row, so it owns the single stop.
      expect(tabbable()).toEqual([duplicated[0]]);

      await user.click(screen.getByLabelText('Search tenants'));
      for (const expected of visualOrder) {
        await user.keyboard('{ArrowDown}');
        expect(expected).toHaveFocus();
        expect(tabbable()).toEqual([expected]);
      }

      await user.keyboard('{Home}');
      expect(visualOrder[0]).toHaveFocus();
      await user.keyboard('{End}');
      expect(visualOrder[visualOrder.length - 1]).toHaveFocus();

      // Either copy reports the plain tenant id, not the internal section key.
      await user.keyboard('{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('globex');
    });

    it('expands each copy separately and gives each its own group id', async () => {
      const user = userEvent.setup();
      // The duplicated tenant is the one *with* children this time.
      render(<Demo recentItems={[items[1]]} />);

      const parents = screen.getAllByRole('treeitem', {
        name: 'Acme Partner',
      });
      expect(parents).toHaveLength(2);

      await user.click(parents[0]);
      expect(parents[0]).toHaveAttribute('aria-expanded', 'true');
      expect(parents[1]).toHaveAttribute('aria-expanded', 'false');

      await user.click(parents[1]);
      const owns = parents.map((parent) => parent.getAttribute('aria-owns'));
      expect(owns[0]).toBeTruthy();
      expect(owns[1]).toBeTruthy();
      expect(owns[0]).not.toBe(owns[1]);

      const groups = owns.map((id) => document.getElementById(id!));
      expect(groups[0]).toHaveAttribute('role', 'group');
      expect(groups[1]).toHaveAttribute('role', 'group');
      expect(groups[0]).not.toBe(groups[1]);
    });
  });

  describe('RTL', () => {
    afterEach(() => {
      document.documentElement.dir = '';
      document.documentElement.style.direction = '';
    });

    it('swaps the ArrowLeft / ArrowRight tree keys under dir="rtl"', async () => {
      document.documentElement.dir = 'rtl';
      // happy-dom doesn't apply the UA stylesheet's `[dir] { direction }` rule,
      // so the component's computed-direction probe needs the property too.
      document.documentElement.style.direction = 'rtl';

      const user = userEvent.setup();
      render(<Demo />);

      await user.click(screen.getByLabelText('Search tenants'));
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(row('Acme Partner')).toHaveFocus();

      // RTL: ArrowLeft is "forward" — expand, then descend into the subtree.
      await user.keyboard('{ArrowLeft}');
      expect(row('Acme Partner')).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{ArrowLeft}');
      expect(row('Acme Folder')).toHaveFocus();

      // RTL: ArrowRight is "backward" — ascend to the parent, then collapse it.
      await user.keyboard('{ArrowRight}');
      expect(row('Acme Partner')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(row('Acme Partner')).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
