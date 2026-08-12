import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enUS, es } from 'react-day-picker/locale';
import { describe, expect, it, vi } from 'vitest';

import { CalendarPanel } from '../calendar-panel';

const JULY_2026 = new Date(2026, 6, 1);

describe('CalendarPanel', () => {
  it.each(['single', 'multiple', 'range'] as const)(
    'renders the %s variant',
    (variant) => {
      render(<CalendarPanel variant={variant} defaultMonth={JULY_2026} />);
      expect(screen.getAllByRole('grid').length).toBeGreaterThan(0);
    }
  );

  it('renders one month for single/multiple and two for range', () => {
    const { unmount } = render(
      <CalendarPanel variant="single" defaultMonth={JULY_2026} />
    );
    expect(screen.getAllByRole('grid')).toHaveLength(1);
    unmount();

    const multiple = render(
      <CalendarPanel variant="multiple" defaultMonth={JULY_2026} />
    );
    expect(screen.getAllByRole('grid')).toHaveLength(1);
    multiple.unmount();

    render(<CalendarPanel variant="range" defaultMonth={JULY_2026} />);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('defaults the week to a Monday start', () => {
    render(<CalendarPanel defaultMonth={JULY_2026} />);
    const headers = Array.from(
      screen.getAllByRole('grid')[0].querySelectorAll('thead th')
    ).map((header) => header.textContent);
    expect(headers[0]).toBe('Mo');
    expect(headers[headers.length - 1]).toBe('Su');
  });

  it('renders the month and year dropdowns in the header', () => {
    render(<CalendarPanel defaultMonth={JULY_2026} />);
    expect(screen.getByRole('combobox', { name: 'Month' })).toHaveTextContent(
      'July'
    );
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveTextContent(
      '2026'
    );
  });

  it('navigates through the dropdowns only (no prev/next chevrons)', () => {
    render(<CalendarPanel defaultMonth={JULY_2026} />);
    expect(screen.queryByRole('button', { name: /previous month/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /next month/i })).toBeNull();
  });

  it('changes the displayed month from the year dropdown', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <CalendarPanel defaultMonth={JULY_2026} onMonthChange={onMonthChange} />
    );

    await user.click(screen.getByRole('combobox', { name: 'Year' }));
    await user.click(screen.getByRole('option', { name: '2027' }));

    expect(onMonthChange).toHaveBeenCalled();
    const [next] = onMonthChange.mock.calls[0];
    expect((next as Date).getFullYear()).toBe(2027);
    expect((next as Date).getMonth()).toBe(6);
  });

  it('keeps the second range column column-scoped when its month dropdown is used', async () => {
    const user = userEvent.setup();
    render(<CalendarPanel variant="range" defaultMonth={JULY_2026} />);

    const monthDropdowns = screen.getAllByRole('combobox', { name: 'Month' });
    expect(monthDropdowns).toHaveLength(2);
    expect(monthDropdowns[0]).toHaveTextContent('July');
    expect(monthDropdowns[1]).toHaveTextContent('August');

    await user.click(monthDropdowns[1]);
    await user.click(screen.getByRole('option', { name: 'September' }));

    const updated = screen.getAllByRole('combobox', { name: 'Month' });
    expect(updated[0]).toHaveTextContent('August');
    expect(updated[1]).toHaveTextContent('September');
  });

  it('keeps the second range column column-scoped when its year dropdown is used', async () => {
    const user = userEvent.setup();
    render(<CalendarPanel variant="range" defaultMonth={JULY_2026} />);

    const yearDropdowns = screen.getAllByRole('combobox', { name: 'Year' });
    expect(yearDropdowns).toHaveLength(2);
    expect(yearDropdowns[0]).toHaveTextContent('2026');
    expect(yearDropdowns[1]).toHaveTextContent('2026');

    await user.click(yearDropdowns[1]);
    await user.click(screen.getByRole('option', { name: '2027' }));

    const monthDropdowns = screen.getAllByRole('combobox', { name: 'Month' });
    const updatedYears = screen.getAllByRole('combobox', { name: 'Year' });
    // The columns are always adjacent (first, first+1), so asking the second
    // column for 2027 shifts both — but each column keeps its own month
    // (July / August), which is what the bug broke: unfixed, the second
    // column's request would move the *first* column to August 2027 and
    // derive a third, October 2027 month for the second.
    expect(monthDropdowns[0]).toHaveTextContent('July');
    expect(updatedYears[0]).toHaveTextContent('2027');
    expect(monthDropdowns[1]).toHaveTextContent('August');
    expect(updatedYears[1]).toHaveTextContent('2027');
  });

  it('does not render a footer for the single variant', () => {
    render(<CalendarPanel variant="single" defaultMonth={JULY_2026} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
  });

  it.each(['multiple', 'range'] as const)(
    'renders the footer actions for the %s variant',
    (variant) => {
      render(<CalendarPanel variant={variant} defaultMonth={JULY_2026} />);
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    }
  );

  it('overrides the footer labels', () => {
    render(
      <CalendarPanel
        variant="multiple"
        defaultMonth={JULY_2026}
        cancelLabel="Отмена"
        applyLabel="Применить"
      />
    );
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Применить' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('localizes weekday abbreviations via `locale`', () => {
    render(<CalendarPanel defaultMonth={JULY_2026} locale={es} />);
    const headers = Array.from(
      screen.getAllByRole('grid')[0].querySelectorAll('thead th')
    ).map((header) => header.textContent);
    expect(headers[0]).toBe('lu');
    expect(headers[headers.length - 1]).toBe('do');
  });

  it("defaults the week start to the `locale`'s own convention", () => {
    render(<CalendarPanel defaultMonth={JULY_2026} locale={enUS} />);
    const headers = Array.from(
      screen.getAllByRole('grid')[0].querySelectorAll('thead th')
    ).map((header) => header.textContent);
    expect(headers[0]).toBe('Su');
    expect(headers[headers.length - 1]).toBe('Sa');
  });

  it('lets an explicit `weekStartsOn` override the `locale` default', () => {
    render(
      <CalendarPanel defaultMonth={JULY_2026} locale={enUS} weekStartsOn={1} />
    );
    const headers = Array.from(
      screen.getAllByRole('grid')[0].querySelectorAll('thead th')
    ).map((header) => header.textContent);
    expect(headers[0]).toBe('Mo');
    expect(headers[headers.length - 1]).toBe('Su');
  });

  it('honors an explicit `weekStartsOn={0}` over a `locale` that starts on Monday', () => {
    render(
      <CalendarPanel defaultMonth={JULY_2026} locale={es} weekStartsOn={0} />
    );
    const headers = Array.from(
      screen.getAllByRole('grid')[0].querySelectorAll('thead th')
    ).map((header) => header.textContent);
    expect(headers[0]).toBe('do');
    expect(headers[headers.length - 1]).toBe('sá');
  });

  it('overrides the dropdown accessible names', () => {
    render(
      <CalendarPanel
        defaultMonth={JULY_2026}
        monthLabel="Mois"
        yearLabel="Année"
      />
    );
    expect(screen.getByRole('combobox', { name: 'Mois' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Année' })).toBeInTheDocument();
  });

  it('fires onSelect with the clicked day (single)', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CalendarPanel
        defaultMonth={JULY_2026}
        showOutsideDays={false}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('9'));

    expect(onSelect).toHaveBeenCalled();
    const [selected] = onSelect.mock.calls[0];
    expect(selected).toBeInstanceOf(Date);
    expect((selected as Date).getDate()).toBe(9);
  });

  it('accumulates days in the multiple variant', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    // `onSelect` makes `selected` controlled (react-day-picker's contract), so the
    // consumer owns the accumulated array.
    function Controlled() {
      const [days, setDays] = React.useState<Date[]>([]);
      return (
        <CalendarPanel
          variant="multiple"
          defaultMonth={JULY_2026}
          showOutsideDays={false}
          selected={days}
          onSelect={(next, triggerDate) => {
            onSelect(next, triggerDate);
            setDays((next as Date[] | undefined) ?? []);
          }}
        />
      );
    }
    render(<Controlled />);

    await user.click(screen.getByText('9'));
    await user.click(screen.getByText('10'));

    const [last] = onSelect.mock.calls[onSelect.mock.calls.length - 1];
    expect(Array.isArray(last)).toBe(true);
    expect((last as Date[]).map((date) => date.getDate())).toEqual([9, 10]);
  });

  it('marks the selected day active and the in-range days as range middles', () => {
    render(
      <CalendarPanel
        variant="range"
        defaultMonth={JULY_2026}
        showOutsideDays={false}
        selected={{ from: new Date(2026, 6, 9), to: new Date(2026, 6, 12) }}
      />
    );

    const day = (label: string) =>
      screen.getAllByRole('gridcell').flatMap((cell) => {
        const button = cell.querySelector('button');
        return button && button.textContent === label ? [button] : [];
      })[0];

    expect(day('9')).toHaveAttribute('data-active', 'true');
    expect(day('12')).toHaveAttribute('data-active', 'true');
    expect(day('10')).toHaveAttribute('data-range-middle', 'true');
    expect(day('10')).toHaveAttribute('data-active', 'false');
  });

  it('fires the footer callbacks', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onApply = vi.fn();
    render(
      <CalendarPanel
        variant="multiple"
        defaultMonth={JULY_2026}
        onCancel={onCancel}
        onApply={onApply}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref to the container', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CalendarPanel ref={ref} defaultMonth={JULY_2026} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'calendar-panel');
  });

  it('merges a custom className onto the container', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <CalendarPanel ref={ref} className="custom-class" defaultMonth={JULY_2026} />
    );
    expect(ref.current).toHaveClass('custom-class');
  });

  it('flips ArrowLeft/ArrowRight day roaming when `dir="rtl"`', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPanel dir="rtl" defaultMonth={JULY_2026} showOutsideDays={false} />
    );

    const day9 = screen.getByText('9');
    await user.click(day9);
    expect(document.activeElement).toBe(day9);

    await user.keyboard('{ArrowRight}');
    // Under RTL, react-day-picker swaps the two keys' meaning — ArrowRight
    // moves to the *previous* day, not the next one.
    expect(document.activeElement).toHaveTextContent('8');

    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toHaveTextContent('9');
  });

  it('does not flip day roaming without an explicit `dir`', async () => {
    const user = userEvent.setup();
    render(<CalendarPanel defaultMonth={JULY_2026} showOutsideDays={false} />);

    const day9 = screen.getByText('9');
    await user.click(day9);
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toHaveTextContent('10');
  });

  it('backs the range pair off instead of collapsing to one month at `toYear`', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPanel
        variant="range"
        fromYear={2020}
        toYear={2030}
        defaultMonth={JULY_2026}
      />
    );

    await user.click(screen.getAllByRole('combobox', { name: 'Year' })[0]);
    await user.click(screen.getByRole('option', { name: '2030' }));
    await user.click(screen.getAllByRole('combobox', { name: 'Month' })[0]);
    await user.click(screen.getByRole('option', { name: 'December' }));

    // Requesting December 2030 (= `toYear`'s last month) as the first column
    // would leave the second column at January 2031, past `endMonth` — rather
    // than dropping it, the pair slides back to November/December.
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    const monthDropdowns = screen.getAllByRole('combobox', { name: 'Month' });
    expect(monthDropdowns[0]).toHaveTextContent('November');
    expect(monthDropdowns[1]).toHaveTextContent('December');
  });

  it('clamps navigation to the `fromYear`/`toYear` window', () => {
    render(
      <CalendarPanel
        fromYear={2020}
        toYear={2030}
        month={new Date(2035, 0, 1)}
        onMonthChange={() => {}}
      />
    );

    // A controlled `month` outside the window is clamped by react-day-picker's
    // own `startMonth`/`endMonth` handling once those are wired from
    // `fromYear`/`toYear` — the grid renders the window's last month, not 2035.
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveTextContent(
      '2030'
    );
    expect(screen.getByRole('combobox', { name: 'Month' })).toHaveTextContent(
      'December'
    );
  });
});
