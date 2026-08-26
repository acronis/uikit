import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputNumPicker } from '../index';

describe('InputNumPicker', () => {
  it('renders the input with the default value', () => {
    render(<InputNumPicker defaultValue={5} label="Quantity" />);
    expect(screen.getByLabelText('Quantity')).toHaveValue('5');
  });

  it('renders the label with a required marker', () => {
    render(<InputNumPicker label="Quantity" required />);
    const label = screen.getByText('Quantity').closest('label');
    expect(label).toHaveTextContent('Quantity*');
  });

  it('renders no label element when label is omitted', () => {
    render(<InputNumPicker />);
    expect(document.querySelector('label')).not.toBeInTheDocument();
  });

  it('increments and decrements via the steppers', async () => {
    render(<InputNumPicker defaultValue={5} label="Quantity" />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByLabelText('Quantity')).toHaveValue('6');
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(screen.getByLabelText('Quantity')).toHaveValue('4');
  });

  it('supports custom stepper labels', () => {
    render(
      <InputNumPicker
        label="Quantity"
        decrementLabel="Remove one"
        incrementLabel="Add one"
      />
    );
    expect(screen.getByRole('button', { name: 'Remove one' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add one' })).toBeInTheDocument();
  });

  it('disables the input and steppers when disabled', () => {
    render(<InputNumPicker label="Quantity" disabled />);
    expect(screen.getByLabelText('Quantity')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });

  it('clamps to the max', async () => {
    render(<InputNumPicker label="Quantity" defaultValue={9} max={10} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByLabelText('Quantity')).toHaveValue('10');
  });

  it('calls onValueChange when the value changes', async () => {
    const onValueChange = vi.fn();
    render(
      <InputNumPicker
        label="Quantity"
        defaultValue={1}
        onValueChange={onValueChange}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenCalledWith(2, expect.anything());
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<InputNumPicker label="Quantity" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
