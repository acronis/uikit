import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputText } from '../input-text';

describe('InputText', () => {
  it('renders a labelled text input associated via htmlFor/id', () => {
    render(<InputText label="Email" placeholder="you@example.com" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
  });

  it('appends a required marker and sets aria-required', () => {
    render(<InputText label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    // The `*` is aria-hidden, so the accessible name is still "Email".
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('renders a description associated via aria-describedby', () => {
    render(<InputText label="Email" description="We never share it" />);
    const input = screen.getByLabelText('Email');
    const descId = input.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(screen.getByText('We never share it')).toHaveAttribute('id', descId as string);
  });

  it('switches to the error treatment when error is set', () => {
    render(<InputText label="Email" description="hint" error="Required field" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    // Error message replaces the description.
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('hint')).not.toBeInTheDocument();
  });

  it('shows the clear button only when clearable and a value is present', () => {
    const { rerender } = render(<InputText label="Email" clearable value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();

    rerender(<InputText label="Email" clearable value="hi" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('does not show the clear button when disabled', () => {
    render(<InputText label="Email" clearable value="hi" disabled onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('fires onClear when the clear button is pressed', async () => {
    const onClear = vi.fn();
    render(
      <InputText label="Email" clearable value="hi" onClear={onClear} onChange={() => {}} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputText label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards arbitrary input props', async () => {
    const onChange = vi.fn();
    render(<InputText label="Email" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Email'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
