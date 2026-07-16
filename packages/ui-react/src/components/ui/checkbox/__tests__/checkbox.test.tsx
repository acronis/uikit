import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('renders a checkbox, unchecked by default', () => {
    render(<Checkbox aria-label="Accept" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('applies the unchecked idle box token classes', () => {
    render(<Checkbox aria-label="Accept" />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveClass(
      'bg-[var(--ui-checkbox-unchecked-box-color-idle)]',
      'border-[var(--ui-checkbox-unchecked-box-border-color-idle)]'
    );
  });

  it('applies a 3px focus-visible ring (matching Figma, not the old 2px)', () => {
    // VR can't guard this — the repo has no pseudo-states addon, so
    // :focus-visible never paints in snapshots — so the class is the guard.
    render(<Checkbox aria-label="Accept" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' });
    expect(checkbox).toHaveClass(
      'focus-visible:ring-[3px]',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
    expect(checkbox.className).not.toMatch(/focus-visible:ring-2\b/);
  });

  it('toggles checked state on click', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' });
    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects a controlled checked prop', () => {
    render(<Checkbox aria-label="Accept" checked />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('exposes the indeterminate state as aria-checked="mixed"', () => {
    render(<Checkbox aria-label="Accept" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });

  it('does not fire onCheckedChange when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Accept"
        disabled
        onCheckedChange={onCheckedChange}
      />
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Accept' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('merges a custom className with the token classes', () => {
    render(<Checkbox aria-label="Accept" className="custom-class" />);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toHaveClass(
      'custom-class',
      'bg-[var(--ui-checkbox-unchecked-box-color-idle)]'
    );
  });

  it('names the control from the label prop and toggles on label click', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toBeInTheDocument();
    await userEvent.click(screen.getByText('Accept terms'));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('associates the description via aria-describedby', () => {
    render(<Checkbox label="Notify" description="Send me emails" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Notify' });
    const describedby = checkbox.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    expect(document.getElementById(describedby as string)).toHaveTextContent(
      'Send me emails'
    );
  });

  it('forwards the ref to the underlying control', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Checkbox aria-label="Accept" ref={ref} />);
    // Base UI's Checkbox.Root renders a focusable <span role="checkbox">.
    expect(ref.current?.getAttribute('role')).toBe('checkbox');
  });
});
