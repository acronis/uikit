import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dialog, DialogContent, DialogPortal, DialogTitle } from '../dialog';

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
});
