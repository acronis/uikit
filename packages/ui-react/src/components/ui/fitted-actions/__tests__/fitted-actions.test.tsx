import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FittedActions, computeFittedVisibleCount } from '../index';
import type { FittedAction } from '../index';

const actions: FittedAction[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'tag', label: 'Tag' },
  { id: 'export', label: 'Export' },
];

describe('computeFittedVisibleCount', () => {
  const widths = [100, 100, 100];

  it('fits every action when they all cost less than the width', () => {
    expect(
      computeFittedVisibleCount({
        containerWidth: 400,
        itemWidths: widths,
        dropdownWidth: 0,
      })
    ).toBe(3);
  });

  it('accounts for the gap between items', () => {
    // 100 + 8 + 100 = 208 <= 210; +8+100 = 316 > 210 → 2 fit.
    expect(
      computeFittedVisibleCount({
        containerWidth: 210,
        itemWidths: widths,
        dropdownWidth: 0,
        gap: 8,
      })
    ).toBe(2);
  });

  it('reserves the dropdown width', () => {
    // available = 250 - 80 = 170 → 100 fits, +8+100=208 > 170 → 1.
    expect(
      computeFittedVisibleCount({
        containerWidth: 250,
        itemWidths: widths,
        dropdownWidth: 80,
        gap: 8,
      })
    ).toBe(1);
  });

  it('returns 0 for no items', () => {
    expect(
      computeFittedVisibleCount({
        containerWidth: 500,
        itemWidths: [],
        dropdownWidth: 80,
      })
    ).toBe(0);
  });
});

describe('FittedActions', () => {
  it('renders every action inline when unmeasured (no overflow menu)', () => {
    // happy-dom reports zero widths, so nothing overflows and no menu appears.
    render(<FittedActions actions={actions} aria-label="Row actions" />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Export' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'More' })
    ).not.toBeInTheDocument();
  });

  it('omits actions whose isDisplayed is false', () => {
    render(
      <FittedActions
        actions={[
          { id: 'a', label: 'Shown' },
          { id: 'b', label: 'Hidden', isDisplayed: false },
        ]}
      />
    );
    expect(screen.getByRole('button', { name: 'Shown' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Hidden' })
    ).not.toBeInTheDocument();
  });

  it('fires onSelect and onAction when an inline action is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onAction = vi.fn();
    render(
      <FittedActions
        actions={[{ id: 'run', label: 'Run', onSelect }]}
        onAction={onAction}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'run' })
    );
  });

  it('uses a custom action renderer', () => {
    render(
      <FittedActions
        actions={actions}
        renderAction={(action) => <a href="#">{action.label}</a>}
      />
    );
    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument();
  });

  it('forwards the container ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<FittedActions ref={ref} actions={actions} />);
    expect(ref.current).toHaveAttribute('data-slot', 'fitted-actions');
  });
});
