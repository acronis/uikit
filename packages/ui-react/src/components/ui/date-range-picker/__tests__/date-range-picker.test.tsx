import { useReducer } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { es } from 'react-day-picker/locale';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { DateRangePicker } from '../date-range-picker';

const JULY_2026 = new Date(2026, 6, 1);

describe('DateRangePicker', () => {
  it('renders the trigger with a label and placeholder', () => {
    render(
      <DateRangePicker
        label="Period"
        placeholder="Pick a range"
        onValueChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Period' })).toBeInTheDocument();
    expect(screen.getByText('Pick a range')).toBeInTheDocument();
  });

  it('shows the applied range in the trigger (controlled)', () => {
    render(
      <DateRangePicker
        label="Period"
        value={{ from: new Date(2026, 6, 1), to: new Date(2026, 6, 5) }}
        onValueChange={() => {}}
      />
    );
    expect(screen.getByText('Jul 1, 2026')).toBeInTheDocument();
    expect(screen.getByText('Jul 5, 2026')).toBeInTheDocument();
  });

  it("translates the trigger's month name under a non-default locale, keeping the day/year order fixed", () => {
    render(
      <DateRangePicker
        label="Period"
        locale={es}
        value={{ from: new Date(2026, 6, 1), to: new Date(2026, 6, 5) }}
        onValueChange={() => {}}
      />
    );
    expect(screen.getByText('jul 1, 2026')).toBeInTheDocument();
    expect(screen.getByText('jul 5, 2026')).toBeInTheDocument();
  });

  it('opens the calendar popover from the trigger', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Period" onValueChange={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('commits the drafted range on Apply and closes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ from: JULY_2026 }}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));
    // Two months (July + August) are shown; click July 15 for the range end.
    await user.click(screen.getAllByText('15')[0]);
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const range = onValueChange.mock.calls[0][0];
    expect(range.from).toBeInstanceOf(Date);
    expect(range.to).toBeInstanceOf(Date);
    // Popover is closed.
    expect(
      screen.queryByRole('button', { name: 'Apply' })
    ).not.toBeInTheDocument();
  });

  it('reverts the draft on dismiss without committing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ from: JULY_2026 }}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));
    await user.click(screen.getAllByText('15')[0]);
    await user.keyboard('{Escape}');

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('reverts the draft and closes on Cancel without committing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ from: JULY_2026 }}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));
    await user.click(screen.getAllByText('15')[0]);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Apply' })
    ).not.toBeInTheDocument();
  });

  it('strips the popover max-width cap for the two-month calendar layout', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Period" onValueChange={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(screen.getByRole('dialog')).toHaveClass('max-w-none');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker label="Period" disabled onValueChange={() => {}} />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(
      screen.queryByRole('button', { name: 'Apply' })
    ).not.toBeInTheDocument();
  });

  it('forwards localization labels to the calendar popup', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Period"
        monthLabel="Mes"
        yearLabel="Año"
        cancelLabel="Cancelar"
        applyLabel="Aplicar"
        onValueChange={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancelar' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('combobox', { name: 'Mes' })).toHaveLength(2);
    expect(screen.getAllByRole('combobox', { name: 'Año' })).toHaveLength(2);
  });

  describe('RTL', () => {
    afterEach(() => {
      document.documentElement.dir = '';
    });

    it('forwards the ambient text direction to the calendar popup', async () => {
      document.documentElement.dir = 'rtl';
      const user = userEvent.setup();
      const { container } = render(
        <DateRangePicker label="Period" onValueChange={() => {}} />
      );

      await user.click(screen.getByRole('button', { name: 'Period' }));

      const panel = container.ownerDocument.querySelector(
        '[data-slot="calendar-panel"]'
      );
      expect(panel).toHaveAttribute('dir', 'rtl');
    });

    it('forwards ambient direction when nested inside another portaled popover', async () => {
      document.documentElement.dir = 'rtl';
      const user = userEvent.setup();
      const { container } = render(
        <Popover defaultOpen>
          <PopoverTrigger>Open filters</PopoverTrigger>
          <PopoverContent>
            <DateRangePicker label="Period" onValueChange={() => {}} />
          </PopoverContent>
        </Popover>
      );

      await user.click(screen.getByRole('button', { name: 'Period' }));

      const panel = container.ownerDocument.querySelector(
        '[data-slot="calendar-panel"]'
      );
      expect(panel).toHaveAttribute('dir', 'rtl');
    });
  });

  it('forwards disabledDays to the calendar popup', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ from: JULY_2026 }}
        disabledDays={{ before: new Date(2026, 6, 10) }}
        onValueChange={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(screen.getAllByText('5')[0].closest('button')).toBeDisabled();
  });

  // A common consumer pattern is `value={filters.period ?? {}}`, which hands the
  // component a BRAND-NEW object literal on every parent render. The component
  // must not react to `value` by reference (no effect keyed on its identity) or
  // that would ping-pong into an unbounded update loop. Hammering the parent with
  // re-renders that each pass a fresh object must stay bounded (no "Maximum
  // update depth exceeded", no hang).
  it('is robust to a new value object on every render (no update loop)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Harness() {
      const [, force] = useReducer((n: number) => n + 1, 0);
      return (
        <div>
          <button type="button" onClick={force}>
            force
          </button>
          {/* Fresh `{}` and a fresh populated object on every render. */}
          <DateRangePicker
            label="Period"
            value={{ from: new Date(2026, 6, 1), to: new Date(2026, 6, 15) }}
            onValueChange={onValueChange}
          />
        </div>
      );
    }

    render(<Harness />);
    for (let i = 0; i < 25; i++) {
      await user.click(screen.getByRole('button', { name: 'force' }));
    }

    // Survived the re-render storm: still mounted, interactive, and never
    // spuriously committed a value in response to the identity churn.
    expect(screen.getByRole('button', { name: 'Period' })).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
