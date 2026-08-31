import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { CardWidgetCarousel } from '../card-widget-carousel';

/** Make a scroll track appear to have overflowing content. */
function makeOverflowing(track: HTMLDivElement, scrollLeft = 0) {
  Object.defineProperty(track, 'scrollWidth', { value: 900, configurable: true });
  Object.defineProperty(track, 'clientWidth', { value: 300, configurable: true });
  Object.defineProperty(track, 'scrollLeft', { value: scrollLeft, configurable: true });
}

describe('CardWidgetCarousel', () => {
  it('renders children', () => {
    render(
      <CardWidgetCarousel>
        <div>Card 1</div>
        <div>Card 2</div>
      </CardWidgetCarousel>
    );
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('shows Next button by default (assumes overflowing on first paint)', () => {
    render(<CardWidgetCarousel />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('renders the Next button with a custom label', () => {
    render(<CardWidgetCarousel nextLabel="Avanzar" />);
    expect(screen.getByRole('button', { name: 'Avanzar' })).toBeInTheDocument();
  });

  it('renders the Prev button with a custom label when scrolled right', async () => {
    const { container } = render(<CardWidgetCarousel prevLabel="Atrás" />);
    const track = container.querySelector<HTMLDivElement>('[class*="overflow-x-auto"]')!;
    // Simulate being scrolled partway through
    makeOverflowing(track, 304);
    track.dispatchEvent(new Event('scroll'));
    expect(await screen.findByRole('button', { name: 'Atrás' })).toBeInTheDocument();
  });

  it('hides Next button when at the end of the track', async () => {
    const { container } = render(<CardWidgetCarousel />);
    const track = container.querySelector<HTMLDivElement>('[class*="overflow-x-auto"]')!;
    // Simulate being at the very end: scrollLeft + clientWidth === scrollWidth
    makeOverflowing(track, 600);
    act(() => {
      track.dispatchEvent(new Event('scroll'));
    });
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('hides Prev button when at the start', () => {
    render(<CardWidgetCarousel />);
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
  });

  it('forwards the ref to the outer div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardWidgetCarousel ref={ref} />);
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('spreads additional props onto the outer div', () => {
    render(<CardWidgetCarousel data-testid="carousel" />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('applies a custom className', () => {
    render(<CardWidgetCarousel data-testid="carousel" className="my-class" />);
    expect(screen.getByTestId('carousel')).toHaveClass('my-class');
  });

  it('clicking Next calls scrollBy on the scroll track', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CardWidgetCarousel>
        <div>Card 1</div>
      </CardWidgetCarousel>
    );
    const track = container.querySelector<HTMLDivElement>('[class*="overflow-x-auto"]')!;
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(scrollBySpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
  });

  it('clicking Prev calls scrollBy with negative left', async () => {
    const user = userEvent.setup();
    const { container } = render(<CardWidgetCarousel />);
    const track = container.querySelector<HTMLDivElement>('[class*="overflow-x-auto"]')!;
    makeOverflowing(track, 304);
    track.dispatchEvent(new Event('scroll'));

    const prevBtn = await screen.findByRole('button', { name: 'Previous' });
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;

    await user.click(prevBtn);
    expect(scrollBySpy).toHaveBeenCalledWith(expect.objectContaining({ left: -304, behavior: 'smooth' }));
  });
});
