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

function Slide({ title = 'Feature title', description = 'Feature description.' } = {}) {
  return (
    <DialogWelcomeSlide
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
          <Slide />
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
          <Slide />
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
          <Slide />
        </DialogWelcome>
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('overrides the CTA and Close labels', () => {
      render(
        <DialogWelcome open aria-label="Welcome" primaryLabel="Get started" closeLabel="Dismiss">
          <Slide />
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
          <Slide title="Slide 1" />
          <Slide title="Slide 2" />
          <Slide title="Slide 3" />
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
          <Slide title="Slide 1" />
          <Slide title="Slide 2" />
          <Slide title="Slide 3" />
        </DialogWelcome>
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('forwards footer label overrides to DialogFooterCarousel', () => {
      render(
        <DialogWelcome open aria-label="Welcome tour" nextLabel="Suivant" positionLabel="Position">
          <Slide title="Slide 1" />
          <Slide title="Slide 2" />
        </DialogWelcome>
      );
      expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
      expect(screen.getByRole('list', { name: 'Position' })).toBeInTheDocument();
    });

    it('renders only the first 5 slides and warns when given more than 5', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DialogWelcome open aria-label="Welcome tour">
          {Array.from({ length: 7 }, (_, index) => (
            <Slide key={index} title={`Slide ${index + 1}`} />
          ))}
        </DialogWelcome>
      );
      expect(screen.getByText('Slide 5')).toBeInTheDocument();
      expect(screen.queryByText('Slide 6')).not.toBeInTheDocument();
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('expected between 1 and 5 slides, received 7')
      );
      consoleError.mockRestore();
    });
  });
});
