import { act, render, screen, waitFor } from '@testing-library/react';
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

function getTrack(container: HTMLElement) {
  return container.querySelector<HTMLDivElement>('[class*="overflow-x-auto"]')!;
}

/**
 * Override `getComputedStyle` so calls on `target` see `direction: 'rtl'`
 * while every other element still gets the real style (with getPropertyValue
 * etc. intact).
 */
function mockRtl(target: Element) {
  const real = window.getComputedStyle.bind(window);
  return vi.spyOn(window, 'getComputedStyle').mockImplementation((...args) => {
    const style = real(...args);
    if (args[0] === target) {
      return new Proxy(style, {
        get(t, prop) {
          if (prop === 'direction') return 'rtl';
          const v = Reflect.get(t, prop);
          return typeof v === 'function' ? v.bind(t) : v;
        },
      });
    }
    return style;
  });
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

  it('shows Next button enabled by default (assumes overflowing on first paint)', () => {
    render(<CardWidgetCarousel />);
    const next = screen.getByRole('button', { name: 'Next' });
    expect(next).toBeInTheDocument();
    expect(next).not.toHaveAttribute('aria-disabled');
  });

  it('renders the Next button with a custom label', () => {
    render(<CardWidgetCarousel nextLabel="Avanzar" />);
    expect(screen.getByRole('button', { name: 'Avanzar' })).toBeInTheDocument();
  });

  it('renders the Prev button enabled when scrolled right', async () => {
    const { container } = render(<CardWidgetCarousel prevLabel="Atrás" />);
    const track = getTrack(container);
    makeOverflowing(track, 304);
    track.dispatchEvent(new Event('scroll'));
    const prev = await screen.findByRole('button', { name: 'Atrás' });
    expect(prev).not.toHaveAttribute('aria-disabled');
  });

  it('disables Next button when at the end of the track', () => {
    const { container } = render(<CardWidgetCarousel />);
    const track = getTrack(container);
    makeOverflowing(track, 600);
    act(() => {
      track.dispatchEvent(new Event('scroll'));
    });
    const next = screen.getByRole('button', { name: 'Next' });
    expect(next).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables Prev button when at the start', () => {
    render(<CardWidgetCarousel />);
    const prev = screen.getByRole('button', { name: 'Previous' });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not fire scroll when clicking a disabled button', async () => {
    const user = userEvent.setup();
    const { container } = render(<CardWidgetCarousel />);
    const track = getTrack(container);
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;
    // Prev is disabled at the start
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(scrollBySpy).not.toHaveBeenCalled();
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

  it('clicking Next calls scrollBy with left=304 (LTR)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CardWidgetCarousel>
        <div>Card 1</div>
      </CardWidgetCarousel>
    );
    const track = getTrack(container);
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 304, behavior: 'smooth' });
  });

  it('clicking Prev calls scrollBy with left=-304 (LTR)', async () => {
    const user = userEvent.setup();
    const { container } = render(<CardWidgetCarousel />);
    const track = getTrack(container);
    makeOverflowing(track, 304);
    track.dispatchEvent(new Event('scroll'));

    const prevBtn = await screen.findByRole('button', { name: 'Previous' });
    expect(prevBtn).not.toHaveAttribute('aria-disabled');
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;

    await user.click(prevBtn);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -304, behavior: 'smooth' });
  });

  it('clicking Next in RTL calls scrollBy with left=-304', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CardWidgetCarousel>
        <div>Card 1</div>
      </CardWidgetCarousel>
    );
    const track = getTrack(container);
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;
    const spy = mockRtl(track);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -304, behavior: 'smooth' });

    spy.mockRestore();
  });

  it('clicking Prev in RTL calls scrollBy with left=304', async () => {
    const user = userEvent.setup();
    const { container } = render(<CardWidgetCarousel />);
    const track = getTrack(container);
    makeOverflowing(track, -304);
    act(() => {
      track.dispatchEvent(new Event('scroll'));
    });

    const prevBtn = screen.getByRole('button', { name: 'Previous' });
    expect(prevBtn).not.toHaveAttribute('aria-disabled');
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;
    const spy = mockRtl(track);

    await user.click(prevBtn);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 304, behavior: 'smooth' });

    spy.mockRestore();
  });

  it('updates button state when children are added (MutationObserver)', async () => {
    const { container, rerender } = render(
      <CardWidgetCarousel>
        <div>Card 1</div>
      </CardWidgetCarousel>
    );
    const track = getTrack(container);
    // Start with non-overflowing content
    Object.defineProperty(track, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(track, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(track, 'scrollLeft', { value: 0, configurable: true });
    act(() => {
      track.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByRole('button', { name: 'Next' })).toHaveAttribute('aria-disabled', 'true');

    // Simulate the track overflowing after children are added
    Object.defineProperty(track, 'scrollWidth', { value: 900, configurable: true });
    act(() => {
      rerender(
        <CardWidgetCarousel>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
          <div>Card 4</div>
        </CardWidgetCarousel>
      );
    });

    // MutationObserver fires after DOM mutation; the state should have updated
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).not.toHaveAttribute('aria-disabled');
    });
  });
});
