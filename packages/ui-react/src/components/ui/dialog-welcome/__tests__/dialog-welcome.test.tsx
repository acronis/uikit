import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DialogWelcome, DialogWelcomeSlide } from '../dialog-welcome';

// Embla reports zero-size scroll snaps under jsdom/happy-dom (see
// DialogFooterCarousel's/CarouselDialog's own tests), so the carousel-layout
// boundary scenarios below drive DialogFooterCarousel's state through a
// mocked useCarousel(), keeping Carousel/CarouselContent/CarouselItem real —
// this exercises the actual composition, not just the footer in isolation.
const mockCarousel = {
  canScrollPrev: false,
  canScrollNext: false,
  selectedIndex: 0,
  slideCount: 3,
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
};

vi.mock('../../carousel', async () => {
  const actual = await vi.importActual<typeof import('../../carousel')>('../../carousel');
  return { ...actual, useCarousel: () => mockCarousel };
});

beforeEach(() => {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = false;
  mockCarousel.selectedIndex = 0;
  mockCarousel.slideCount = 3;
  mockCarousel.scrollPrev = vi.fn();
  mockCarousel.scrollNext = vi.fn();
});

// Called directly (not as a JSX tag) so the element it returns — a real
// <DialogWelcomeSlide> — is what actually reaches DialogWelcome's children,
// not a wrapper element whose own `type` would fail DialogWelcome's
// slide-type filter. `key` is forwarded the same way React handles it in JSX.
function Slide({
  key,
  title = 'Feature title',
  description = 'Feature description.',
}: { key?: React.Key; title?: string; description?: string } = {}) {
  return (
    <DialogWelcomeSlide
      key={key}
      image={<img alt="" src="data:," />}
      title={title}
      description={description}
    />
  );
}

describe('DialogWelcome', () => {
  describe('single layout (1 slide)', () => {
    it('renders the slide, a CTA button, and a Close link — no footer', () => {
      render(
        <DialogWelcome open aria-label="Welcome">
          {Slide()}
        </DialogWelcome>
      );
      expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();
      expect(screen.getByText('Feature title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Call to action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      expect(screen.queryByRole('list', { name: 'Slide position' })).not.toBeInTheDocument();
    });

    it('fires onPrimaryAction without closing the dialog', async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <DialogWelcome open aria-label="Welcome" onOpenChange={onOpenChange} onPrimaryAction={onPrimaryAction}>
          {Slide()}
        </DialogWelcome>
      );
      await user.click(screen.getByRole('button', { name: 'Call to action' }));
      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('closes the dialog when Close is activated', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <DialogWelcome open aria-label="Welcome" onOpenChange={onOpenChange}>
          {Slide()}
        </DialogWelcome>
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('overrides the CTA and Close labels', () => {
      render(
        <DialogWelcome open aria-label="Welcome" primaryLabel="Get started" closeLabel="Dismiss">
          {Slide()}
        </DialogWelcome>
      );
      expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });
  });

  describe('carousel layout (2+ slides)', () => {
    it('renders every slide and the carousel footer — no CTA/Close pair', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour">
          {Slide({ title: 'Slide 1' })}
          {Slide({ title: 'Slide 2' })}
          {Slide({ title: 'Slide 3' })}
        </DialogWelcome>
      );
      expect(screen.getByRole('dialog', { name: 'Welcome tour' })).toBeInTheDocument();
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
      expect(screen.getByText('Slide 3')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Call to action' })).not.toBeInTheDocument();
    });

    it('closes the dialog when Close is activated on the last slide', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      mockCarousel.canScrollPrev = true;
      mockCarousel.canScrollNext = false;
      mockCarousel.selectedIndex = 2;
      render(
        <DialogWelcome open aria-label="Welcome tour" onOpenChange={onOpenChange}>
          {Slide({ title: 'Slide 1' })}
          {Slide({ title: 'Slide 2' })}
          {Slide({ title: 'Slide 3' })}
        </DialogWelcome>
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('forwards footer label overrides to DialogFooterCarousel', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour" nextLabel="Suivant" positionLabel="Position">
          {Slide({ title: 'Slide 1' })}
          {Slide({ title: 'Slide 2' })}
        </DialogWelcome>
      );
      expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
      expect(screen.getByRole('list', { name: 'Position' })).toBeInTheDocument();
    });

    it('renders only the first 5 slides when given more than 5', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour">
          {Array.from({ length: 7 }, (_, index) =>
            Slide({ key: index, title: `Slide ${index + 1}` })
          )}
        </DialogWelcome>
      );
      expect(screen.getByText('Slide 5')).toBeInTheDocument();
      expect(screen.queryByText('Slide 6')).not.toBeInTheDocument();
    });

    it('renders all 5 slides at the upper boundary', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour">
          {Array.from({ length: 5 }, (_, index) =>
            Slide({ key: index, title: `Slide ${index + 1}` })
          )}
        </DialogWelcome>
      );
      for (let index = 1; index <= 5; index += 1) {
        expect(screen.getByText(`Slide ${index}`)).toBeInTheDocument();
      }
    });
  });

  describe('variant override', () => {
    it('forces the carousel layout for a single slide via variant="carousel"', () => {
      mockCarousel.canScrollPrev = false;
      mockCarousel.canScrollNext = false;
      mockCarousel.selectedIndex = 0;
      mockCarousel.slideCount = 1;
      render(
        <DialogWelcome open aria-label="Welcome" variant="carousel">
          {Slide()}
        </DialogWelcome>
      );
      expect(
        screen.queryByRole('button', { name: 'Call to action' })
      ).not.toBeInTheDocument();
      // Single-slide carousel resolves to DialogFooterCarousel's own 'last'
      // state: no Next, Close reachable.
      expect(
        screen.queryByRole('button', { name: 'Next' })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      expect(screen.getByRole('list', { name: 'Slide position' })).toBeInTheDocument();
    });

    it('forces the single layout via variant="single", ignoring extra slides', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour" variant="single">
          {Slide({ title: 'Slide 1' })}
          {Slide({ title: 'Slide 2' })}
        </DialogWelcome>
      );
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.queryByText('Slide 2')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Call to action' })).toBeInTheDocument();
      expect(
        screen.queryByRole('list', { name: 'Slide position' })
      ).not.toBeInTheDocument();
    });
  });

  describe('non-DialogWelcomeSlide / falsy children', () => {
    it('ignores falsy and non-DialogWelcomeSlide children when counting slides', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour">
          {null}
          {false}
          {Slide({ key: 'a', title: 'Slide 1' })}
          <div>Not a slide</div>
          {Slide({ key: 'b', title: 'Slide 2' })}
          {undefined}
          {Slide({ key: 'c', title: 'Slide 3' })}
        </DialogWelcome>
      );
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
      expect(screen.getByText('Slide 3')).toBeInTheDocument();
      expect(screen.queryByText('Not a slide')).not.toBeInTheDocument();
      // 3 real slides -> carousel layout, not the single-slide CTA/Close body.
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Call to action' })).not.toBeInTheDocument();
    });

    it('renders nothing when every child is falsy/non-slide', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour">
          {null}
          {false}
          <div>Not a slide</div>
        </DialogWelcome>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
