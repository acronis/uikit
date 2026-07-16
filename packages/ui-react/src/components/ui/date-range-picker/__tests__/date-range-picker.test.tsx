import { useReducer } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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

  it('opens the calendar popover from the trigger', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Period" onValueChange={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    expect(screen.getByLabelText('Start date')).toBeInTheDocument();
    expect(screen.getByLabelText('End date')).toBeInTheDocument();
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

  it('enables "Reset to default" only after the draft diverges', async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ from: JULY_2026 }}
        onValueChange={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));
    const reset = screen.getByRole('button', { name: 'Reset to default' });
    expect(reset).toBeDisabled();

    await user.click(screen.getAllByText('15')[0]);
    expect(reset).toBeEnabled();

    await user.click(reset);
    expect(reset).toBeDisabled();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Period" disabled onValueChange={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Period' }));

    expect(
      screen.queryByRole('button', { name: 'Apply' })
    ).not.toBeInTheDocument();
  });

  it('updates the draft when a valid date is typed into a field', async () => {
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
    const endField = screen.getByLabelText('End date');
    await user.clear(endField);
    await user.type(endField, 'Jul 20, 2026');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const range = onValueChange.mock.calls[0][0];
    expect(range.to).toBeInstanceOf(Date);
    expect((range.to as Date).getDate()).toBe(20);
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

  it('normalizes a typed end-before-start range on Apply', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ from: new Date(2026, 6, 20) }}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Period' }));
    const endField = screen.getByLabelText('End date');
    // Type an end date earlier than the start (Jul 20).
    await user.clear(endField);
    await user.type(endField, 'Jul 5, 2026');
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const range = onValueChange.mock.calls[0][0];
    // Committed chronologically ordered: from <= to.
    expect((range.from as Date).getDate()).toBe(5);
    expect((range.to as Date).getDate()).toBe(20);
  });
});
