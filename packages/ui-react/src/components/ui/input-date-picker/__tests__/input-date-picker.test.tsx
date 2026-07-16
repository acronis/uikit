import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputDatePicker } from '../input-date-picker';

describe('InputDatePicker', () => {
  it('renders a labelled trigger button associated via htmlFor/id', () => {
    render(<InputDatePicker label="Due" placeholder="Pick a date" />);
    const trigger = screen.getByRole('button', { name: 'Due' });
    expect(trigger).toBeInstanceOf(HTMLButtonElement);
    expect(trigger).toHaveTextContent('Pick a date');
  });

  it('shows the formatted value when set', () => {
    render(<InputDatePicker label="Due" value="Jun 15, 2026" />);
    expect(screen.getByRole('button', { name: 'Due' })).toHaveTextContent(
      'Jun 15, 2026'
    );
  });

  it('renders a start–end range for pickerType="dateRange"', () => {
    render(
      <InputDatePicker
        label="Period"
        pickerType="dateRange"
        startDate="Jun 1"
        endDate="Jun 30"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Period' });
    expect(trigger).toHaveTextContent('Jun 1');
    expect(trigger).toHaveTextContent('Jun 30');
    expect(trigger).toHaveTextContent('–');
  });

  it('appends a required marker and sets aria-required', () => {
    render(<InputDatePicker label="Due" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Due' })).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('renders a description associated via aria-describedby', () => {
    render(<InputDatePicker label="Due" description="When it's due" />);
    const trigger = screen.getByRole('button', { name: 'Due' });
    const descId = trigger.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(screen.getByText("When it's due")).toHaveAttribute(
      'id',
      descId as string
    );
  });

  it('switches to the error treatment when error is set', () => {
    render(<InputDatePicker label="Due" description="hint" error="Required" />);
    const trigger = screen.getByRole('button', { name: 'Due' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveClass(
      'aria-[invalid=true]:border-[var(--ui-input-date-picker-error-box-border-color-idle)]'
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('hint')).not.toBeInTheDocument();
  });

  it('reflects the open state via aria-expanded + data-open', () => {
    render(<InputDatePicker label="Due" open />);
    const trigger = screen.getByRole('button', { name: 'Due' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('data-open');
  });

  it('fires onClick (consumer opens its calendar)', async () => {
    const onClick = vi.fn();
    render(<InputDatePicker label="Due" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Due' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<InputDatePicker label="Due" disabled onClick={onClick} />);
    const trigger = screen.getByRole('button', { name: 'Due' });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<InputDatePicker label="Due" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // Tailwind v4's Preflight does NOT set `cursor: pointer` on `<button>`; the
  // trigger opts in explicitly when enabled, and switches to `not-allowed` when
  // disabled.
  it('shows a pointer cursor when enabled and not-allowed when disabled', () => {
    const { rerender } = render(<InputDatePicker label="Due" />);
    expect(screen.getByRole('button', { name: 'Due' })).toHaveClass(
      'cursor-pointer'
    );

    rerender(<InputDatePicker label="Due" disabled />);
    expect(screen.getByRole('button', { name: 'Due' })).toHaveClass(
      'disabled:cursor-not-allowed'
    );
  });
});
