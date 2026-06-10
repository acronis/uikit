import { createRef, type ComponentRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '../switch';

describe('Switch', () => {
  it('renders with the switch role', () => {
    render(<Switch aria-label="Notifications" />);
    expect(
      screen.getByRole('switch', { name: 'Notifications' })
    ).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Switch aria-label="Notifications" />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('toggles checked state on click and reports it', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />
    );
    const toggle = screen.getByRole('switch');
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('respects the defaultChecked prop', () => {
    render(<Switch aria-label="Notifications" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Notifications"
        disabled
        onCheckedChange={onCheckedChange}
      />
    );
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('wires the track to the --ui-switch-* token tier', () => {
    render(<Switch aria-label="Notifications" />);
    expect(screen.getByRole('switch')).toHaveClass(
      'data-[unchecked]:bg-[var(--ui-switch-background-inactive)]',
      'data-[checked]:bg-[var(--ui-switch-background-active)]'
    );
  });

  it('forwards the ref to the underlying switch element', () => {
    const ref = createRef<ComponentRef<typeof Switch>>();
    render(<Switch ref={ref} aria-label="Notifications" />);
    expect(ref.current).toBe(screen.getByRole('switch'));
  });
});
