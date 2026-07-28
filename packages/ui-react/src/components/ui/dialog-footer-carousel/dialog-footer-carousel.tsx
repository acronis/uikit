import * as React from 'react';

import { cn } from '@/lib/utils';
import { mergeRefs } from '@/lib/merge-refs';
import { useRestoreFocusOnUnmount } from '@/lib/use-restore-focus-on-unmount';

import { Button } from '../button';
import { DialogClose } from '../dialog';
import { useCarousel } from '../carousel';

// PLTFRM-92693. Backed by two real Figma nodes (fileKey lrU3ydIyvPYQNE6ixdsKtJ):
// the inner row is node 6353:4858 ("CarouselDialog" in Figma's own naming — a
// three-variant first/middle/last row); the bar wrapping it is node 6353:5864
// ("DialogFooterCarousel" in Figma). This component implements both as one
// part — the bar's chrome plus the row inside it. State is never a prop: it is
// derived from the ambient <Carousel /> context's selectedIndex/slideCount
// (not canScrollPrev/canScrollNext, which stay permanently true under
// opts={{ loop: true }} and would pin state at 'middle' forever), exactly
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
// The indicator owns the same [1, 5] slide range DialogWelcome enforces on
// its own children (kept in sync with DialogWelcome's own MAX_SLIDES) —
// enforced again at this level because the footer is also usable standalone,
// paired directly with a bare `<Carousel>` that bypasses DialogWelcome's own
// slice.

const MAX_SLIDES = 5;

type DialogFooterCarouselState = 'first' | 'middle' | 'last';

// Derived from selectedIndex/slideCount rather than Embla's canScrollPrev/
// canScrollNext — those flags are permanently true when the ambient Carousel
// loops (opts={{ loop: true }}), which would pin this at 'middle' forever and
// hide the Close button (the only in-footer dismiss control) on every slide.
function getFooterState(
  selectedIndex: number,
  slideCount: number
): DialogFooterCarouselState {
  // A single slide can't scroll either direction, but it must still resolve
  // to 'last' so the Close button renders — otherwise there's no reachable
  // way to close the dialog (see accessibility.md).
  if (slideCount <= 1 || selectedIndex >= slideCount - 1) {
    return 'last';
  }
  if (selectedIndex === 0) {
    return 'first';
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
  /** Builds each position dot's accessible name from its 1-based index and the total dot count. */
  dotAriaLabel?: (index: number, count: number) => string;
}

const defaultDotAriaLabel = (index: number, count: number) =>
  `Slide ${index} of ${count}`;

interface DialogFooterCarouselBoxLeftProps {
  canScrollPrev: boolean;
  scrollPrev: () => void;
  backLabel: string;
}

// Figma's own "boxLeft" — a flex-1 grower so the dots stay pinned dead-center
// regardless of whether Back is present — a plain justify-between would let
// them drift when this slot is empty (state=first has no Back).
function DialogFooterCarouselBoxLeft({
  canScrollPrev,
  scrollPrev,
  backLabel,
}: DialogFooterCarouselBoxLeftProps) {
  return (
    <div className="flex flex-1 items-center">
      {canScrollPrev && (
        <Button variant="secondary" onClick={scrollPrev}>
          {backLabel}
        </Button>
      )}
    </div>
  );
}
DialogFooterCarouselBoxLeft.displayName = 'DialogFooterCarouselBoxLeft';

interface DialogFooterCarouselListIndicatorProps {
  dotIndices: number[];
  selectedIndex: number;
  positionLabel: string;
  dotAriaLabel: (index: number, count: number) => string;
}

// Figma's own "ListIndicator".
function DialogFooterCarouselListIndicator({
  dotIndices,
  selectedIndex,
  positionLabel,
  dotAriaLabel,
}: DialogFooterCarouselListIndicatorProps) {
  return (
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
          aria-label={dotAriaLabel(index + 1, dotIndices.length)}
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
  );
}
DialogFooterCarouselListIndicator.displayName =
  'DialogFooterCarouselListIndicator';

interface DialogFooterCarouselBoxRightProps {
  state: DialogFooterCarouselState;
  scrollNext: () => void;
  nextLabel: string;
  closeLabel: string;
  nextRef: React.Ref<HTMLButtonElement>;
  closeRef: React.Ref<HTMLButtonElement>;
}

// Figma's own "boxRight" — the other flex-1 grower: Next and Close occupy
// the same slot, swapped by `state` — never both rendered.
function DialogFooterCarouselBoxRight({
  state,
  scrollNext,
  nextLabel,
  closeLabel,
  nextRef,
  closeRef,
}: DialogFooterCarouselBoxRightProps) {
  return (
    <div className="flex flex-1 items-center justify-end">
      {state === 'last' ? (
        <DialogClose
          ref={closeRef}
          render={<Button variant="default">{closeLabel}</Button>}
        />
      ) : (
        <Button ref={nextRef} variant="default" onClick={scrollNext}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
DialogFooterCarouselBoxRight.displayName = 'DialogFooterCarouselBoxRight';

// The bar itself — Figma's own "DialogFooterCarousel" node (variants:
// start/middle/end) — flanking BoxLeft/ListIndicator/BoxRight. `ref` is
// forwarded straight through; the caller merges it with any internal ref it
// also needs on the same node (see DialogFooterCarousel's own forwardRef).
const DialogFooterCarouselVariantsContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
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
  />
));
DialogFooterCarouselVariantsContainer.displayName =
  'DialogFooterCarouselVariantsContainer';

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
      dotAriaLabel = defaultDotAriaLabel,
      ...props
    },
    ref
  ) => {
    const {
      canScrollPrev,
      scrollPrev,
      scrollNext,
      selectedIndex,
      slideCount,
    } = useCarousel();
    const state = getFooterState(selectedIndex, slideCount);

    // Back (hidden below) and Next/Close (swapped below) are each
    // conditionally unmounted per Figma — there is no disabled visual state
    // for any of them in the design. Unmounting the currently-focused control
    // drops keyboard focus to document.body; useRestoreFocusOnUnmount moves it
    // onto whichever control is left standing instead, regardless of which of
    // the two ever caused it. Back is deliberately absent from the fallback
    // list: mounting never steals focus, only unmounting does, so Back can
    // only ever be a focus *source* here, never a valid redirect *target* —
    // including it would make it a false-positive candidate whenever it
    // happens to be mounted alongside an unrelated Next/Close swap.
    const rootRef = React.useRef<HTMLDivElement>(null);
    const nextRef = React.useRef<HTMLButtonElement>(null);
    const closeRef = React.useRef<HTMLButtonElement>(null);
    useRestoreFocusOnUnmount(rootRef, [nextRef, closeRef]);

    // Memoized so the callback ref's identity is stable across renders
    // unless the forwarded `ref` itself changes — otherwise React would
    // detach (null) and reattach the DOM node on every commit.
    const mergedRef = React.useMemo(() => mergeRefs(rootRef, ref), [ref]);

    const dotIndices = React.useMemo(
      () =>
        Array.from(
          { length: Math.min(slideCount, MAX_SLIDES) },
          (_, index) => index
        ),
      [slideCount]
    );

    return (
      <DialogFooterCarouselVariantsContainer
        ref={mergedRef}
        className={className}
        {...props}
      >
        <DialogFooterCarouselBoxLeft
          canScrollPrev={canScrollPrev}
          scrollPrev={scrollPrev}
          backLabel={backLabel}
        />
        <DialogFooterCarouselListIndicator
          dotIndices={dotIndices}
          selectedIndex={selectedIndex}
          positionLabel={positionLabel}
          dotAriaLabel={dotAriaLabel}
        />
        <DialogFooterCarouselBoxRight
          state={state}
          scrollNext={scrollNext}
          nextLabel={nextLabel}
          closeLabel={closeLabel}
          nextRef={nextRef}
          closeRef={closeRef}
        />
      </DialogFooterCarouselVariantsContainer>
    );
  }
);
DialogFooterCarousel.displayName = 'DialogFooterCarousel';

export {
  DialogFooterCarousel,
  type DialogFooterCarouselProps,
  type DialogFooterCarouselState,
};
