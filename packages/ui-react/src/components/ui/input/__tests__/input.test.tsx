import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputBox } from '../input';

describe('InputBox', () => {
  it('renders a textbox with type="text" by default', () => {
    render(<InputBox aria-label="Name" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('applies the idle input token classes', () => {
    render(<InputBox aria-label="Name" />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveClass(
      'bg-[var(--ui-input-text-global-box-color-idle)]',
      'border-[var(--ui-input-text-normal-box-border-color-idle)]',
      'text-[var(--ui-input-text-global-value-color-idle)]'
    );
  });

  it('shows the placeholder', () => {
    render(<InputBox aria-label="Name" placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('fires onChange as the user types', async () => {
    const onChange = vi.fn();
    render(<InputBox aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'hi');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('hi');
  });

  it('does not accept input when disabled', async () => {
    render(<InputBox aria-label="Name" disabled />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeDisabled();
    await userEvent.type(input, 'hi');
    expect(input).toHaveValue('');
  });

  it('reflects the error state via aria-invalid', () => {
    render(<InputBox aria-label="Name" aria-invalid />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass(
      'aria-[invalid=true]:border-[var(--ui-input-text-error-msg-box-border-color-idle)]'
    );
  });

  it('honors a custom type', () => {
    render(<InputBox aria-label="Email" type="email" />);
    // type=email still exposes the textbox role.
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'type',
      'email'
    );
  });

  it('merges a custom className with the token classes', () => {
    render(<InputBox aria-label="Name" className="custom-class" />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveClass(
      'custom-class',
      'bg-[var(--ui-input-text-global-box-color-idle)]'
    );
  });

  it('forwards the ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputBox aria-label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
