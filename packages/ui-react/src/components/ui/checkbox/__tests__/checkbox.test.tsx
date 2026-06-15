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
      'bg-[var(--ui-checkbox-unchecked-box-idle)]',
      'border-[var(--ui-checkbox-unchecked-box-border-color-idle)]'
    );
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
      'bg-[var(--ui-checkbox-unchecked-box-idle)]'
    );
  });

  it('forwards the ref to the underlying control', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Checkbox aria-label="Accept" ref={ref} />);
    // Base UI's Checkbox.Root renders a focusable <span role="checkbox">.
    expect(ref.current?.getAttribute('role')).toBe('checkbox');
  });
});
