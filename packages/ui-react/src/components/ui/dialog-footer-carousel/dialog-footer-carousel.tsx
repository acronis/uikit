import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../button';
import { DialogClose } from '../dialog';
import { useCarousel } from '../carousel';

// PLTFRM-92693. Backed by two real Figma nodes (fileKey lrU3ydIyvPYQNE6ixdsKtJ):
// the inner row is node 6353:4858 ("CarouselDialog" in Figma's own naming — a
// three-variant first/middle/last row); the bar wrapping it is node 6353:5864
// ("DialogFooterCarousel" in Figma). This component implements both as one
// part — the bar's chrome plus the row inside it. State is never a prop: it is
// derived from the ambient <Carousel /> context (canScrollPrev/canScrollNext),
// exactly
// like Carousel's own previous-disabled/next-disabled internal state.
//
// The Back/Next/Close buttons are ui-react's Button (secondary / default);
// each dot is a plain filled circle whose OWN color carries the active/idle
// distinction (confirmed via Figma screenshot: the active dot's circle is
// solid --ui-button-icon-global-icon-color-active, idle circles are the
// dimmer --ui-button-icon-global-icon-color-disabled — there is no
// surrounding container box/fill, unlike a real ButtonIcon). The 16px outer
// span is a non-visual hit-box matching Figma's own CircleSmall bounding box
// (a 9.6px circle inset 3.2px on every side) so the flex gap token measures
// the same effective spacing Figma shows. The bar's own geometry and fill
// come from the Footer tier and the dot gap from the Carousel tier —
// Figma's own "unset" placeholder for the bar fill resolved to a literal
// transparent in tokens-pd, so no separate design decision was needed there.
//
// Figma's own default preview shows 3 dots, but the dots row (ListIndicator)
// is a `children`-overridable slot in the design, not a fixed 3-step
// indicator — so the rendered dot count tracks the ambient Carousel's real
// slide count (Embla's `scrollSnapList().length`), and the active dot tracks
// its real `selectedScrollSnap()`, instead of collapsing every slide count
// onto the 3-variant first/middle/last row.
//
// The indicator owns the same [1, 5] slide range CarouselDialog enforces on
// its children (kept in sync with CarouselDialog's own MIN_SLIDES/MAX_SLIDES)
// — enforced again at this level because the footer is also usable
// standalone, paired directly with a bare `<Carousel>` that bypasses
// CarouselDialog's slice.

const MIN_SLIDES = 1;
const MAX_SLIDES = 5;

type DialogFooterCarouselState = 'first' | 'middle' | 'last';

function getFooterState(
  canScrollPrev: boolean,
  canScrollNext: boolean,
  slideCount: number
): DialogFooterCarouselState {
  // A single slide can't scroll either direction, but it must still resolve
  // to 'last' so the Close button renders — otherwise there's no reachable
  // way to close the dialog (see accessibility.md).
  if (slideCount <= 1) {
    return 'last';
  }
  if (!canScrollPrev) {
    return 'first';
  }
  if (!canScrollNext) {
    return 'last';
  }
  return 'middle';
}

interface DialogFooterCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the slide-position indicator. */
  positionLabel?: string;
  /** Label for the "scroll to previous slide" control. */
  backLabel?: string;
  /** Label for the "scroll to next slide" control. */
  nextLabel?: string;
  /** Label for the "close the dialog" control (shown on the last slide). */
  closeLabel?: string;
}

const DialogFooterCarousel = React.forwardRef<
  HTMLDivElement,
  DialogFooterCarouselProps
>(
  (
    {
      className,
      positionLabel = 'Slide position',
      backLabel = 'Back',
      nextLabel = 'Next',
      closeLabel = 'Close',
      ...props
    },
    ref
  ) => {
    const {
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      selectedIndex,
      slideCount,
    } = useCarousel();
    const state = getFooterState(canScrollPrev, canScrollNext, slideCount);

    if (
      process.env.NODE_ENV !== 'production' &&
      (slideCount < MIN_SLIDES || slideCount > MAX_SLIDES)
    ) {
      console.error(
        `DialogFooterCarousel: expected between ${MIN_SLIDES} and ${MAX_SLIDES} slides, received ${slideCount}.` +
          (slideCount > MAX_SLIDES ? ` Rendering only ${MAX_SLIDES} dots.` : '')
      );
    }

    const dotIndices = React.useMemo(
      () =>
        Array.from(
          { length: Math.min(slideCount, MAX_SLIDES) },
          (_, index) => index
        ),
      [slideCount]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          'h-[var(--ui-footer-global-height)]',
          'gap-[var(--ui-footer-global-gap)]',
          'px-[var(--ui-footer-global-padding-x)]',
          'bg-[var(--ui-footer-carousel-color)]',
          className
        )}
        {...props}
      >
        {/* boxLeft/boxRight are equal flex-1 growers (Figma's own structure) so
            the dot indicator stays pinned dead-center regardless of whether
            Back/Next/Close are present — a plain justify-between would let the
            dots drift when a side slot is empty (state=first has no Back). */}
        <div className="flex flex-1 items-center">
          {canScrollPrev && (
            <Button variant="secondary" onClick={scrollPrev}>
              {backLabel}
            </Button>
          )}
        </div>
        <div
          role="list"
          aria-label={positionLabel}
          className={cn(
            'flex shrink-0 items-center',
            'gap-[var(--ui-carousel-dialog-list-indicator-gap)]'
          )}
        >
          {dotIndices.map((index) => (
            <span
              key={index}
              role="listitem"
              aria-current={index === selectedIndex ? 'true' : undefined}
              className="flex size-4 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-[9.6px] rounded-full',
                  index === selectedIndex
                    ? 'bg-[var(--ui-button-icon-global-icon-color-active)]'
                    : 'bg-[var(--ui-button-icon-global-icon-color-disabled)]'
                )}
              />
            </span>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end">
          {state === 'last' ? (
            <DialogClose
              render={<Button variant="default">{closeLabel}</Button>}
            />
          ) : (
            <Button variant="default" onClick={scrollNext}>
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
DialogFooterCarousel.displayName = 'DialogFooterCarousel';

export {
  DialogFooterCarousel,
  type DialogFooterCarouselProps,
  type DialogFooterCarouselState,
};
