import * as React from 'react';

import { cn } from '@/lib/utils';

import { CarouselDialog2, type CarouselDialog2Props } from '../carousel-dialog-2';

// Experimental — parallel to a future carousel primitive, not yet named/kept.
// Ports Figma's "DialogFooterCarousel" component (node 6353:5864, variants
// start/middle/end), the footer bar that hosts `CarouselDialog2`. Geometry and
// background resolve to the `--ui-footer-*` tier already shipped for
// `DialogFooterDefault` — this is the same footer chrome, just filled with the
// carousel row instead of end-aligned actions.

export type DialogFooterCarousel2Variant = 'start' | 'middle' | 'end';

export interface DialogFooterCarousel2Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    Pick<
      CarouselDialog2Props,
      | 'slideCount'
      | 'selectedIndex'
      | 'onSelectIndex'
      | 'onBack'
      | 'onNext'
      | 'onPrimaryAction'
      | 'backLabel'
      | 'nextLabel'
      | 'primaryLabel'
      | 'goToSlideLabel'
    > {
  /** Which slide position this renders for. Defaults to `'start'`. */
  variant?: DialogFooterCarousel2Variant;
}

const VARIANT_TO_CAROUSEL_DIALOG_VARIANT: Record<
  DialogFooterCarousel2Variant,
  CarouselDialog2Props['variant']
> = {
  start: 'first',
  middle: 'middle',
  end: 'last',
};

const DialogFooterCarousel2 = React.forwardRef<
  HTMLDivElement,
  DialogFooterCarousel2Props
>(
  (
    {
      className,
      variant = 'start',
      slideCount,
      selectedIndex,
      onSelectIndex,
      onBack,
      onNext,
      onPrimaryAction,
      backLabel,
      nextLabel,
      primaryLabel,
      goToSlideLabel,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-[var(--ui-footer-global-height)] items-center bg-[var(--ui-footer-carousel-color)] px-[var(--ui-footer-global-padding-x)]',
          className
        )}
        {...props}
      >
        <CarouselDialog2
          className="min-w-0 flex-1"
          variant={VARIANT_TO_CAROUSEL_DIALOG_VARIANT[variant]}
          slideCount={slideCount}
          selectedIndex={selectedIndex}
          onSelectIndex={onSelectIndex}
          onBack={onBack}
          onNext={onNext}
          onPrimaryAction={onPrimaryAction}
          backLabel={backLabel}
          nextLabel={nextLabel}
          primaryLabel={primaryLabel}
          goToSlideLabel={goToSlideLabel}
        />
      </div>
    );
  }
);
DialogFooterCarousel2.displayName = 'DialogFooterCarousel2';

export { DialogFooterCarousel2 };
