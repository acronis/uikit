import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputTextArea } from '../input-text-area';

describe('InputTextArea', () => {
  it('renders a textbox', () => {
    render(<InputTextArea aria-label="Notes" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('applies the idle text-area token classes', () => {
    render(<InputTextArea aria-label="Notes" />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveClass(
      'bg-[var(--ui-input-text-area-box-color-idle)]',
      'border-[var(--ui-input-text-area-border-color-idle)]',
      'text-[var(--ui-input-text-area-value-color-idle)]'
    );
  });

  it('allows vertical resize and honors the min-height token', () => {
    render(<InputTextArea aria-label="Notes" />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveClass(
      'resize-y',
      'min-h-[var(--ui-input-text-area-box-height-min)]'
    );
  });

  it('shows the placeholder', () => {
    render(<InputTextArea aria-label="Notes" placeholder="Enter your notes" />);
    expect(screen.getByPlaceholderText('Enter your notes')).toBeInTheDocument();
  });

  it('fires onChange as the user types', async () => {
    const onChange = vi.fn();
    render(<InputTextArea aria-label="Notes" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Notes' }), 'hi');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('hi');
  });

  it('does not accept input when disabled', async () => {
    render(<InputTextArea aria-label="Notes" disabled />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toBeDisabled();
    await userEvent.type(textarea, 'hi');
    expect(textarea).toHaveValue('');
  });

  it('renders a labelled textarea associated via htmlFor/id', () => {
    render(<InputTextArea label="Bio" placeholder="About you" />);
    const textarea = screen.getByLabelText('Bio');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('placeholder', 'About you');
  });

  it('appends a required marker and sets aria-required', () => {
    render(<InputTextArea label="Bio" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    // The `*` is aria-hidden, so the accessible name is still "Bio".
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('renders a description associated via aria-describedby', () => {
    render(<InputTextArea label="Bio" description="Shown on your profile" />);
    const textarea = screen.getByLabelText('Bio');
    const descId = textarea.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(screen.getByText('Shown on your profile')).toHaveAttribute(
      'id',
      descId as string
    );
  });

  it('switches to the error treatment when error is set', () => {
    render(<InputTextArea label="Bio" description="hint" error="Required field" />);
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    // Error message replaces the description.
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('hint')).not.toBeInTheDocument();
  });

  it('reflects the error state via aria-invalid (red border + error ring)', () => {
    render(<InputTextArea aria-label="Notes" aria-invalid />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveClass(
      'aria-[invalid=true]:border-[var(--ui-input-text-area-error-msg-box-border-color-idle)]',
      'aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)]'
    );
  });

  it('merges a custom className onto the textarea', () => {
    render(<InputTextArea aria-label="Notes" className="custom-class" />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveClass(
      'custom-class',
      'bg-[var(--ui-input-text-area-box-color-idle)]'
    );
  });

  it('forwards the ref to the underlying textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<InputTextArea aria-label="Notes" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
