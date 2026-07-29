import * as React from 'react';

import { cn } from '@/lib/utils';

import { CarouselDialog, type CarouselDialogProps } from '../carousel-dialog';

// Ports Figma's "DialogFooterCarousel" component (node 6353:5864, variants
// start/middle/end), the footer bar that hosts `CarouselDialog`. Geometry and
// background resolve to the `--ui-footer-*` tier already shipped for
// `DialogFooterDefault` — this is the same footer chrome, just filled with the
// carousel row instead of end-aligned actions.

export type DialogFooterCarouselVariant = 'start' | 'middle' | 'end';

export interface DialogFooterCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    Pick<
      CarouselDialogProps,
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
  variant?: DialogFooterCarouselVariant;
}

const VARIANT_TO_CAROUSEL_DIALOG_VARIANT: Record<
  DialogFooterCarouselVariant,
  CarouselDialogProps['variant']
> = {
  start: 'first',
  middle: 'middle',
  end: 'last',
};

const DialogFooterCarousel = React.forwardRef<
  HTMLDivElement,
  DialogFooterCarouselProps
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
          'flex h-[var(--ui-footer-global-height)] shrink-0 items-center bg-[var(--ui-footer-carousel-color)] px-[var(--ui-footer-global-padding-x)]',
          className
        )}
        {...props}
      >
        <CarouselDialog
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
DialogFooterCarousel.displayName = 'DialogFooterCarousel';

export { DialogFooterCarousel };
