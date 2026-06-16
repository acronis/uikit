import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '../dialog';

describe('Dialog', () => {
  it('preserves the exit end-state while closing', () => {
    const { rerender } = render(
      <Dialog open>
        <DialogPortal keepMounted>
          <DialogContent portal={false}>
            <DialogTitle>Dialog title</DialogTitle>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    const overlaySelector = '.bg-black\\/80';

    expect(screen.getByRole('dialog')).toHaveClass(
      'data-[closed]:fill-mode-forwards'
    );

    const overlayOpen = document.querySelector<HTMLDivElement>(overlaySelector);
    expect(overlayOpen).not.toBeNull();
    expect(overlayOpen!).toHaveClass('data-[closed]:fill-mode-forwards');

    // Trigger the close transition so Base UI applies `data-closed`.
    rerender(
      <Dialog open={false}>
        <DialogPortal keepMounted>
          <DialogContent portal={false}>
            <DialogTitle>Dialog title</DialogTitle>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute(
      'data-closed'
    );

    const overlayClosed =
      document.querySelector<HTMLDivElement>(overlaySelector);
    expect(overlayClosed).not.toBeNull();
    expect(overlayClosed!).toHaveAttribute('data-closed');
  });

  it('uses the primary text token for the close button color', () => {
    render(
      <Dialog open>
        <DialogPortal keepMounted>
          <DialogContent portal={false}>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(closeButton).toHaveClass('text-primary');
    expect(closeButton).not.toHaveClass('text-[#2668C5]');
  });
});
