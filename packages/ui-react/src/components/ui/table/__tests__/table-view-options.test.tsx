import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TableViewOptions } from '../table-view-options';

const columns = [
  { id: 'name', label: 'Name', hidden: false },
  { id: 'status', label: 'Status', hidden: true },
];

describe('TableViewOptions', () => {
  it('opens the menu and exposes each column as a checkable item', async () => {
    const user = userEvent.setup();
    render(<TableViewOptions columns={columns} onToggle={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /View/ }));
    const name = screen.getByRole('menuitemcheckbox', { name: /Name/ });
    const status = screen.getByRole('menuitemcheckbox', { name: /Status/ });
    expect(name).toHaveAttribute('aria-checked', 'true');
    expect(status).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('menu')).toHaveClass(
      'bg-[var(--ui-input-select-dropdown-container-color)]',
      'max-h-[var(--available-height)]',
      'w-[300px]'
    );
    expect(
      screen.getByRole('searchbox', { name: 'Search columns' })
    ).toBeInTheDocument();
    expect(name).toHaveClass(
      'px-[var(--ui-input-select-dropdown-item-global-container-padding-x)]',
      'font-normal',
      'text-[var(--ui-input-select-dropdown-item-global-label-color)]'
    );
  });

  it('filters columns by label and renders the empty state', async () => {
    const user = userEvent.setup();
    render(<TableViewOptions columns={columns} onToggle={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /View/ }));
    const search = screen.getByRole('searchbox', { name: 'Search columns' });

    await user.type(search, 'status');
    expect(
      screen.queryByRole('menuitemcheckbox', { name: /Name/ })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('menuitemcheckbox', { name: /Status/ })
    ).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'missing');
    expect(screen.getByText('No columns found.')).toBeInTheDocument();
  });

  it('groups categorized columns and shows all hidden columns in one category', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TableViewOptions
        columns={[
          { id: 'name', label: 'Name', hidden: true, category: 'General' },
          { id: 'status', label: 'Status', hidden: true, category: 'General' },
          {
            id: 'policy',
            label: 'Policies',
            hidden: true,
            category: 'Protection',
          },
        ]}
        onToggle={onToggle}
      />
    );
    await user.click(screen.getByRole('button', { name: /View/ }));

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Protection')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'General' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Protection' })
    ).toBeInTheDocument();
    expect(screen.getByText('General').parentElement).toHaveClass('w-full');
    const showGeneral = screen.getByRole('button', {
      name: 'Show all General',
    });
    expect(showGeneral).toHaveClass('ms-auto');
    await user.click(showGeneral);
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onToggle).toHaveBeenNthCalledWith(1, 'name');
    expect(onToggle).toHaveBeenNthCalledWith(2, 'status');
  });

  it('localizes the search, category action, and empty state', async () => {
    const user = userEvent.setup();
    render(
      <TableViewOptions
        columns={[
          { id: 'name', label: 'Name', hidden: true, category: 'General' },
        ]}
        onToggle={vi.fn()}
        searchPlaceholder="Spalten suchen"
        showAllLabel="Alle zeigen"
        noResultsLabel="Keine Spalten gefunden."
      />
    );
    await user.click(screen.getByRole('button', { name: /View/ }));

    expect(
      screen.getByRole('button', { name: 'Alle zeigen General' })
    ).toBeInTheDocument();
    const search = screen.getByRole('searchbox', { name: 'Spalten suchen' });
    await user.type(search, 'missing');
    expect(screen.getByText('Keine Spalten gefunden.')).toBeInTheDocument();
  });

  it('fires onToggle with the column id and keeps the menu open', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<TableViewOptions columns={columns} onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: /View/ }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /Name/ }));
    expect(onToggle).toHaveBeenCalledWith('name');
    // Menu stays open so multiple columns can be toggled in one session.
    await user.click(screen.getByRole('menuitemcheckbox', { name: /Status/ }));
    expect(onToggle).toHaveBeenCalledWith('status');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports a custom trigger label', async () => {
    const user = userEvent.setup();
    render(
      <TableViewOptions
        columns={columns}
        onToggle={vi.fn()}
        triggerLabel="Columns"
      />
    );
    expect(screen.getByRole('button', { name: /Columns/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Columns/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders a cog-only trigger with `iconOnly`', async () => {
    const user = userEvent.setup();
    render(<TableViewOptions columns={columns} onToggle={vi.fn()} iconOnly />);
    const trigger = screen.getByRole('button', { name: 'Column settings' });
    expect(trigger).not.toHaveTextContent('View');
    await user.click(trigger);
    expect(
      screen.getByRole('menuitemcheckbox', { name: /Name/ })
    ).toBeInTheDocument();
  });

  it('names the `iconOnly` trigger from `triggerAriaLabel`', () => {
    render(
      <TableViewOptions
        columns={columns}
        onToggle={vi.fn()}
        iconOnly
        triggerAriaLabel="Spalten"
      />
    );
    expect(screen.getByRole('button', { name: 'Spalten' })).toBeInTheDocument();
  });
});
