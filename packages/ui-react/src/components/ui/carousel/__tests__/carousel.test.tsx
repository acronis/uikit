import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '../carousel';

function BasicCarousel(props: React.ComponentProps<typeof Carousel> = {}) {
  return (
    <Carousel {...props}>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

describe('Carousel', () => {
  it('renders as a region describing itself as a carousel, with its slides', () => {
    render(<BasicCarousel />);
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    const slides = screen.getAllByRole('group');
    expect(slides).toHaveLength(3);
    slides.forEach((slide) => expect(slide).toHaveAttribute('aria-roledescription', 'slide'));
  });

  it('renders accessible previous/next controls', () => {
    render(<BasicCarousel />);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
  });

  it('disables the previous control on the first slide', () => {
    render(<BasicCarousel />);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
  });

  it('themes the nav controls through ButtonIcon, not a bespoke token', () => {
    render(<BasicCarousel />);
    // No --ui-carousel-* tier exists — the nav buttons reuse the already
    // tokenized ButtonIcon (--ui-button-icon-*) instead of inventing one.
    expect(screen.getByRole('button', { name: 'Next slide' })).toHaveClass(
      'bg-[var(--ui-button-icon-global-container-color-idle)]'
    );
  });

  it('advances to the next slide when its control is clicked', async () => {
    const user = userEvent.setup();
    const setApi = vi.fn();
    // `loop: true` so canScrollNext is true regardless of the zero-size
    // layout jsdom/happy-dom reports (no real box metrics in this environment).
    render(<BasicCarousel opts={{ loop: true }} setApi={setApi} />);
    const api = setApi.mock.calls[0][0];
    expect(api.selectedScrollSnap()).toBe(0);
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(api.selectedScrollSnap()).toBe(1);
  });

  it('throws when a part is rendered outside <Carousel />', () => {
    expect(() => render(<CarouselItem>Slide</CarouselItem>)).toThrow(
      'useCarousel must be used within a <Carousel />'
    );
  });

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Carousel ref={ref}>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('calls setApi with the embla API instance', () => {
    const setApi = vi.fn();
    render(<BasicCarousel setApi={setApi} />);
    expect(setApi).toHaveBeenCalled();
  });

  it('exposes the real slide count and selected index through context', async () => {
    const user = userEvent.setup();
    let context: { selectedIndex: number; slideCount: number } | undefined;
    function ContextProbe() {
      context = useCarousel();
      return null;
    }
    // `loop: true` for the same reason as the "advances to the next slide"
    // test above — deterministic navigation despite jsdom's zero-size layout.
    render(
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <ContextProbe />
        <CarouselNext />
      </Carousel>
    );
    expect(context?.slideCount).toBe(3);
    expect(context?.selectedIndex).toBe(0);
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(context?.selectedIndex).toBe(1);
  });
});
