import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dialog, DialogContent, DialogTitle } from '../dialog';

describe('Dialog', () => {
  it('keeps exit animation styles applied while closing', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    const overlay = Array.from(document.querySelectorAll('div')).find((node) =>
      node.className.includes('bg-black/80')
    );

    expect(dialog).toHaveClass('data-[closed]:fill-mode-forwards');
    expect(overlay).toBeTruthy();
    expect(overlay).toHaveClass('data-[closed]:fill-mode-forwards');
  });
});
