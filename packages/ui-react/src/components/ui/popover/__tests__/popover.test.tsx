import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';

function DemoPopover(props: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Popover defaultOpen={props.defaultOpen} onOpenChange={props.onOpenChange}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent data-testid="popup">
        <h4>Dimensions</h4>
        <p>Set the dimensions for the layer.</p>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed by default and opens from the trigger', async () => {
    const user = userEvent.setup();
    render(<DemoPopover />);
    expect(screen.queryByText('Dimensions')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('renders open with defaultOpen', () => {
    render(<DemoPopover defaultOpen />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('themes the popup from the bridged semantic tokens', () => {
    render(<DemoPopover defaultOpen />);
    // No `--ui-popover-*` tier yet — the popup surface resolves to the shared tokens.
    expect(screen.getByTestId('popup')).toHaveClass(
      'bg-background',
      'text-foreground',
      'border-border'
    );
  });

  it('fires onOpenChange and closes on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DemoPopover defaultOpen onOpenChange={onOpenChange} />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>content</PopoverContent>
      </Popover>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
