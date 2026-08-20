import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../index';

function Field({
  defaultValue = 5,
  min,
  max,
  disabled,
}: {
  defaultValue?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <NumberField defaultValue={defaultValue} min={min} max={max} disabled={disabled}>
      <NumberFieldGroup>
        <NumberFieldDecrement aria-label="Decrease" />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement aria-label="Increase" />
      </NumberFieldGroup>
    </NumberField>
  );
}

const input = () => screen.getByLabelText('Quantity') as HTMLInputElement;

describe('NumberField', () => {
  it('renders the input with the default value', () => {
    render(<Field />);
    expect(input().value).toBe('5');
  });

  it('increments and decrements via the steppers', async () => {
    render(<Field />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input().value).toBe('6');
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(input().value).toBe('4');
  });

  it('clamps to the max', async () => {
    render(<Field defaultValue={9} max={10} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input().value).toBe('10');
  });

  it('disables the input and steppers when disabled', () => {
    render(<Field disabled />);
    expect(input()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('does not force the group to full width, so it can shrink in a constrained flex/grid ancestor', () => {
    render(<Field />);
    const group = input().closest('div');
    expect(group).not.toHaveClass('w-full');
    expect(group).toHaveClass('min-w-0');
  });

  it('lets a consumer shrink the group via className inside a narrow flex cell', () => {
    render(
      <div style={{ display: 'flex', width: 200 }}>
        <NumberField defaultValue={5}>
          <NumberFieldGroup className="w-24">
            <NumberFieldDecrement aria-label="Decrease" />
            <NumberFieldInput aria-label="Quantity" />
            <NumberFieldIncrement aria-label="Increase" />
          </NumberFieldGroup>
        </NumberField>
      </div>
    );
    const group = input().closest('div');
    expect(group).toHaveClass('w-24');
    expect(group).not.toHaveClass('w-full');
  });
});
