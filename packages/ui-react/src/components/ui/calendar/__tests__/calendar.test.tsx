import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from '../calendar';

const JULY_2026 = new Date(2026, 6, 1);

describe('Calendar', () => {
  it('renders a month grid', () => {
    render(<Calendar defaultMonth={JULY_2026} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    // Weekday headers + the caption for the shown month.
    expect(screen.getByText(/July 2026/i)).toBeInTheDocument();
  });

  const weekdayHeaders = (): (string | null)[] =>
    Array.from(
      screen.getByRole('grid').querySelectorAll('thead th')
    ).map((h) => h.textContent);

  it('defaults the week to a Monday start', () => {
    render(<Calendar defaultMonth={JULY_2026} />);
    const headers = weekdayHeaders();
    expect(headers[0]).toBe('Mo');
    expect(headers[headers.length - 1]).toBe('Su');
  });

  it('honors an explicit `weekStartsOn` override', () => {
    render(<Calendar defaultMonth={JULY_2026} weekStartsOn={0} />);
    const headers = weekdayHeaders();
    expect(headers[0]).toBe('Su');
    expect(headers[headers.length - 1]).toBe('Sa');
  });

  it('selects a single date on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        defaultMonth={JULY_2026}
        showOutsideDays={false}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('15'));

    expect(onSelect).toHaveBeenCalled();
    const [selected] = onSelect.mock.calls[0];
    expect(selected).toBeInstanceOf(Date);
    expect((selected as Date).getDate()).toBe(15);
  });

  it('supports range selection (from then to)', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="range"
        defaultMonth={JULY_2026}
        showOutsideDays={false}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('10'));
    await user.click(screen.getByText('20'));

    expect(onSelect).toHaveBeenCalledTimes(2);
    const lastRange = onSelect.mock.calls[1][0];
    expect(lastRange.from).toBeInstanceOf(Date);
    expect(lastRange.to).toBeInstanceOf(Date);
  });

  it('disables days matched by the `disabled` matcher', () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={JULY_2026}
        showOutsideDays={false}
        disabled={[new Date(2026, 6, 15)]}
      />
    );
    expect(screen.getByText('15').closest('button')).toBeDisabled();
  });

  it('renders multiple months side by side when `numberOfMonths` > 1', () => {
    render(<Calendar defaultMonth={JULY_2026} numberOfMonths={2} />);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    expect(screen.getByText(/July 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/August 2026/i)).toBeInTheDocument();
  });

  it('renders prev/next navigation buttons', () => {
    render(<Calendar defaultMonth={JULY_2026} />);
    const nav = screen.getByRole('grid').closest('[data-slot="calendar"]');
    expect(nav).not.toBeNull();
    // Two nav buttons (previous / next) live above the month grid.
    const buttons = within(nav as HTMLElement).getAllByRole('button', {
      name: /previous|next|month/i,
    });
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  // Tailwind v4's Preflight does NOT set `cursor: pointer` on `<button>`, so the
  // day cells and nav chevrons (plain `<button>`s) must opt in explicitly, or
  // they read as non-interactive on hover.
  it('gives day cells and nav chevrons a pointer cursor', () => {
    render(
      <Calendar mode="single" defaultMonth={JULY_2026} showOutsideDays={false} />
    );
    const day = screen.getByText('15').closest('button');
    expect(day).toHaveClass('cursor-pointer');

    const root = screen.getByRole('grid').closest('[data-slot="calendar"]');
    const [prev, next] = within(root as HTMLElement).getAllByRole('button', {
      name: /previous|next|month/i,
    });
    expect(prev).toHaveClass('cursor-pointer');
    expect(next).toHaveClass('cursor-pointer');
  });
});
