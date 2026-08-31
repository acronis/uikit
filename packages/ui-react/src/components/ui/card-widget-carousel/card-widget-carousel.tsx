'use client';

import * as React from 'react';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// One card (288px) + one gap (16px) = one scroll step.
const SCROLL_STEP = 304;

export interface CardWidgetCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label for the Next chevron button. Defaults to `'Next'`. */
  nextLabel?: string;
  /** Accessible label for the Previous chevron button. Defaults to `'Previous'`. */
  prevLabel?: string;
}

const CardWidgetCarousel = React.forwardRef<HTMLDivElement, CardWidgetCarouselProps>(
  ({ className, children, nextLabel = 'Next', prevLabel = 'Previous', ...props }, ref) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    // Initialise next=true so the button shows on first paint for overflowing tracks.
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(true);

    const updateScrollState = React.useCallback(() => {
      const track = trackRef.current;
      if (!track) return;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      // Skip when layout hasn't happened yet (scrollWidth = 0 in test environments).
      if (scrollWidth === 0) return;
      // Math.abs handles both LTR (positive scrollLeft) and RTL (negative in Chrome).
      const absScroll = Math.abs(scrollLeft);
      setCanScrollPrev(absScroll > 1);
      setCanScrollNext(absScroll + clientWidth < scrollWidth - 1);
    }, []);

    React.useEffect(() => {
      const track = trackRef.current;
      if (!track) return;
      updateScrollState();
      track.addEventListener('scroll', updateScrollState, { passive: true });
      const ro = new ResizeObserver(updateScrollState);
      ro.observe(track);
      return () => {
        track.removeEventListener('scroll', updateScrollState);
        ro.disconnect();
      };
    }, [updateScrollState]);

    const scroll = (direction: 'prev' | 'next') => {
      const track = trackRef.current;
      if (!track) return;
      const isRtl = getComputedStyle(track).direction === 'rtl';
      const forward = direction === 'next' ? 1 : -1;
      track.scrollBy({ left: (isRtl ? -forward : forward) * SCROLL_STEP, behavior: 'smooth' });
    };

    const navBtn =
      'pointer-events-auto flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--ui-border-on-surface-border)] bg-[var(--ui-background-surface-primary)] shadow-[0px_4px_8px_rgba(165,167,243,0.12)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]';

    return (
      <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        {canScrollPrev && (
          <div className="pointer-events-none absolute inset-y-0 start-0 flex w-[180px] items-center justify-start ps-4">
            <button
              type="button"
              aria-label={prevLabel}
              onClick={() => scroll('prev')}
              className={navBtn}
            >
              <ChevronLeftIcon size={16} className="rtl:rotate-180" />
            </button>
          </div>
        )}

        {canScrollNext && (
          <div className="pointer-events-none absolute inset-y-0 end-0 flex w-[180px] items-center justify-end pe-4">
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => scroll('next')}
              className={navBtn}
            >
              <ChevronRightIcon size={16} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    );
  }
);
CardWidgetCarousel.displayName = 'CardWidgetCarousel';

export { CardWidgetCarousel };
