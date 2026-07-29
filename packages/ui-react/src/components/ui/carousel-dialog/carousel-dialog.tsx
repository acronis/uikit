import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../button';

// Ports Figma's "CarouselDialog" component (node 6353:5864's descendant,
// isolated at 6353:4718 / 6353:4891 / 6353:4922 for the first/middle/last
// variants): the row of controls inside a `DialogFooterCarousel` — a `Back`
// button (`boxLeft`, hidden on the first slide), the dot `ListIndicator`, and
// a `Next`/call-to-action button (`boxRight`). Pure controls — no Embla import
// here; the slide count/index/callbacks are threaded down from
// `DialogWelcome`, which owns the carousel engine.
//
// Internal only — not exported from the package's public entry point. Apps
// building a welcome/onboarding carousel dialog should use `DialogWelcome`.

export type CarouselDialogVariant = 'first' | 'middle' | 'last';

export interface CarouselDialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Which slide position this renders for. Defaults to `'first'`. */
  variant?: CarouselDialogVariant;
  /** Total number of slides, used to render the dot `ListIndicator`. Defaults to `1`. */
  slideCount?: number;
  /** The currently active slide index (0-based). Defaults to `0`. */
  selectedIndex?: number;
  /** Fires when a dot is activated, with the dot's slide index. */
  onSelectIndex?: (index: number) => void;
  /** Fires when `Back` (hidden on `variant="first"`) is activated. */
  onBack?: () => void;
  /** Fires when `Next` (`variant="first" | "middle"`) is activated. */
  onNext?: () => void;
  /** Fires when the call-to-action button (`variant="last"`) is activated. */
  onPrimaryAction?: () => void;
  /** `Back` button label. Defaults to `'Back'`. */
  backLabel?: string;
  /** `Next` button label (`variant="first" | "middle"`). Defaults to `'Next'`. */
  nextLabel?: string;
  /** Call-to-action button label (`variant="last"`). Defaults to `'Call to action'`. */
  primaryLabel?: string;
  /** Builds each dot's accessible name from its 0-based index and the slide count. */
  goToSlideLabel?: (index: number, count: number) => string;
}

const defaultGoToSlideLabel = (index: number, count: number) =>
  `Go to slide ${index + 1} of ${count}`;

const CarouselDialog = React.forwardRef<HTMLDivElement, CarouselDialogProps>(
  (
    {
      className,
      variant = 'first',
      slideCount = 1,
      selectedIndex = 0,
      onSelectIndex,
      onBack,
      onNext,
      onPrimaryAction,
      backLabel = 'Back',
      nextLabel = 'Next',
      primaryLabel = 'Call to action',
      goToSlideLabel = defaultGoToSlideLabel,
      ...props
    },
    ref
  ) => {
    const isFirst = variant === 'first';
    const isLast = variant === 'last';

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-8 w-full items-center justify-between',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col items-start justify-center',
            isFirst && 'h-8'
          )}
        >
          {!isFirst && (
            <Button variant="secondary" onClick={onBack}>
              {backLabel}
            </Button>
          )}
        </div>

        <div
          className="flex shrink-0 items-center gap-[var(--ui-carousel-dialog-list-indicator-gap)]"
        >
          {Array.from({ length: slideCount }, (_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={index}
                type="button"
                aria-current={isActive || undefined}
                aria-label={goToSlideLabel(index, slideCount)}
                onClick={() => onSelectIndex?.(index)}
                className="relative block size-4 shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]"
              >
                <span
                  className={cn(
                    'absolute inset-[3.2px] rounded-full',
                    isActive
                      ? 'bg-[var(--ui-glyph-on-surface-primary)]'
                      : 'bg-[var(--ui-glyph-on-surface-disabled)]'
                  )}
                />
              </button>
            );
          })}
        </div>

        <div
          className="flex min-w-0 flex-1 flex-col items-end justify-center"
        >
          <Button onClick={isLast ? onPrimaryAction : onNext}>
            {isLast ? primaryLabel : nextLabel}
          </Button>
        </div>
      </div>
    );
  }
);
CarouselDialog.displayName = 'CarouselDialog';

export { CarouselDialog };
