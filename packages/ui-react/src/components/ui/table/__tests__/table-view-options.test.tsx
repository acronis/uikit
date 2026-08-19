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
    expect(
      screen.getByRole('button', { name: /Columns/ })
    ).toBeInTheDocument();
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
