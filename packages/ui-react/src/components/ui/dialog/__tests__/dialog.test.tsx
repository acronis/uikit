import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

// The default portal renders the popup into document.body, which Testing
// Library's `screen` queries — Base UI requires the popup to sit in a portal.
function OpenDialog(props: { open?: boolean } = {}) {
  return (
    <Dialog open={props.open ?? true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogBody>
        <DialogFooter>Footer</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('renders the open dialog with its title, description, and footer', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete account')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders the close button as an accessible "Close" button on the muted token', () => {
    render(<OpenDialog />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    expect(close).toHaveClass('text-muted-foreground');
  });

  it('drives the popup surface from the bridged semantic tokens', () => {
    render(<OpenDialog />);
    // No `--ui-dialog-*` tier yet — the popup body resolves to surface-secondary.
    expect(screen.getByRole('dialog')).toHaveClass('bg-muted', 'text-foreground');
  });

  it('defaults to the sm size (max-w-lg / 512px)', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-lg');
  });

  it('applies a larger max-width via the size prop', () => {
    render(
      <Dialog open>
        <DialogContent size="lg">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[832px]');
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog open>
        <DialogContent ref={ref}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('opens from the trigger and closes via onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogCloseButton />
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
