import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Details,
  Sheet,
  SheetBody,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../index';

// The default portal renders the popup into document.body, which Testing
// Library's `screen` queries — Base UI requires the popup to sit in a portal.
function OpenSheet(props: { side?: 'top' | 'bottom' | 'left' | 'right' } = {}) {
  return (
    <Sheet open>
      <SheetContent side={props.side}>
        <SheetHeader>
          <SheetTitle>Workload details</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <SheetBody>
          <SheetDescription>Inspect the selected workload.</SheetDescription>
        </SheetBody>
        <SheetFooter>Footer</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('renders the open sheet with its title, description, and footer', () => {
    render(<OpenSheet />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Workload details')).toBeInTheDocument();
    expect(screen.getByText('Inspect the selected workload.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('defaults to the right side', () => {
    render(<OpenSheet />);
    expect(screen.getByRole('dialog')).toHaveClass('right-0', 'inset-y-0');
  });

  it('anchors to the requested side', () => {
    render(<OpenSheet side="left" />);
    expect(screen.getByRole('dialog')).toHaveClass('left-0', 'inset-y-0');
  });

  it('drives the panel surface from the bridged semantic tokens', () => {
    render(<OpenSheet />);
    expect(screen.getByRole('dialog')).toHaveClass('bg-muted', 'text-foreground');
  });

  it('exposes an accessible Close button', () => {
    render(<OpenSheet />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    expect(close).toHaveClass('text-muted-foreground');
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Sheet open>
        <SheetContent ref={ref}>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('opens from the trigger and closes via onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Sheet onOpenChange={onOpenChange}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetCloseButton />
        </SheetContent>
      </Sheet>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('exports Details as an alias of Sheet', () => {
    expect(Details).toBe(Sheet);
  });
});
