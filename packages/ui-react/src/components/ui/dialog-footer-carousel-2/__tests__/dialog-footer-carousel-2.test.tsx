import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DialogFooterCarousel2 } from '../dialog-footer-carousel-2';

describe('DialogFooterCarousel2', () => {
  it('renders the start variant without a Back button, end-aligned', () => {
    render(
      <DialogFooterCarousel2
        data-testid="footer"
        variant="start"
        slideCount={3}
        selectedIndex={0}
      />
    );
    expect(screen.getByTestId('footer')).toHaveClass('justify-end');
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('renders the middle variant with Back + Next', () => {
    render(
      <DialogFooterCarousel2
        data-testid="footer"
        variant="middle"
        slideCount={3}
        selectedIndex={1}
      />
    );
    expect(screen.getByTestId('footer')).not.toHaveClass('justify-end');
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('renders the end variant with the call-to-action label', () => {
    render(
      <DialogFooterCarousel2
        variant="end"
        slideCount={3}
        selectedIndex={2}
        primaryLabel="Get started"
      />
    );
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
  });

  it('forwards carousel callbacks through to CarouselDialog2', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onSelectIndex = vi.fn();
    render(
      <DialogFooterCarousel2
        variant="start"
        slideCount={3}
        selectedIndex={0}
        onNext={onNext}
        onSelectIndex={onSelectIndex}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Go to slide 2 of 3' }));
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onSelectIndex).toHaveBeenCalledWith(1);
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DialogFooterCarousel2 ref={ref} slideCount={1} selectedIndex={0} />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
