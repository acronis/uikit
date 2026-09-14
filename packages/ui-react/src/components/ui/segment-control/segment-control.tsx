'use client';

import * as React from 'react';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Tag, type TagProps } from '../tag';

// The design's SegmentControl is a single-choice control, rather than a set of
// independently pressed toggles. Base UI's RadioGroup supplies the native radio
// semantics and arrow-key navigation; the token tier owns every visual state.
const segmentControlVariants = cva(
  'inline-flex h-[var(--ui-segment-control-item-height)] items-center overflow-hidden rounded-[var(--ui-segment-control-item-border-radius)] bg-[var(--ui-segment-control-container-color)]',
  {
    variants: {
      // Figma specifies hug for one or two choices and fill for groups of three
      // or more; only fill grows both the control and each of its direct items.
      variant: {
        hug: '',
        fill: 'w-full [&>[role=radio]]:flex-1',
      },
    },
    defaultVariants: { variant: 'hug' },
  }
);

// One item's worth of track per chevron press. Items are variable-width, so a
// fixed step is the only stable choice without measuring every child.
const SCROLL_STEP = 120;

/** Figma SegmentControlScrollItem: one 32px chevron box with a leading divider. */
const scrollItemClassName =
  'flex h-[var(--ui-segment-control-item-height)] w-[var(--ui-segment-control-box-icon-width)] shrink-0 items-center justify-center ' +
  '[border-inline-start-width:var(--ui-segment-control-box-icon-border-width)] [border-inline-start-style:var(--ui-segment-control-box-icon-border-style)] [border-inline-start-color:var(--ui-segment-control-box-icon-border-color)] ' +
  'bg-[var(--ui-segment-control-box-icon-color-idle)] text-[var(--ui-glyph-on-surface-primary)] outline-none transition-colors ' +
  'not-disabled:hover:bg-[var(--ui-segment-control-box-icon-color-hover)] not-disabled:active:bg-[var(--ui-segment-control-box-icon-color-active)] ' +
  // The chevron box reaches the container edge; an outward ring would be clipped
  // by the container, so keep it inset like ButtonGroup's box.
  'focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)] ' +
  'disabled:cursor-not-allowed disabled:text-[var(--ui-glyph-on-surface-disabled)] ' +
  '[&_svg]:pointer-events-none [&_svg]:shrink-0';

export interface SegmentControlProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>,
      'className'
    >,
    VariantProps<typeof segmentControlVariants> {
  className?: string;
  /**
   * Figma `hasScroll`: puts the items on a scrollable track and pins a pair of
   * paging chevrons to the inline end. The chevron block reserves its width so
   * the final item is never hidden underneath it. Items keep their natural
   * width so the track can overflow, which takes precedence over `fill`'s item
   * stretching.
   */
  hasScroll?: boolean;
  /** Accessible label for the previous-page chevron. */
  scrollPrevLabel?: string;
  /** Accessible label for the next-page chevron. */
  scrollNextLabel?: string;
}

const SegmentControl = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive>,
  SegmentControlProps
>(
  (
    {
      className,
      variant,
      hasScroll = false,
      scrollPrevLabel = 'Previous',
      scrollNextLabel = 'Next',
      children,
      ...props
    },
    ref
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const updateScrollState = React.useCallback(() => {
      const track = trackRef.current;
      if (!track) return;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      // Layout hasn't happened yet (scrollWidth is 0 in jsdom); leave the
      // chevrons as they are rather than reporting a bogus "no overflow".
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
      // Re-check when items are added or removed (e.g. an async data load).
      const mo = new MutationObserver(updateScrollState);
      mo.observe(track, { childList: true, subtree: true });
      return () => {
        track.removeEventListener('scroll', updateScrollState);
        ro.disconnect();
        mo.disconnect();
      };
    }, [updateScrollState, hasScroll]);

    const scroll = (direction: 'prev' | 'next') => {
      const track = trackRef.current;
      if (!track) return;
      const isRtl = getComputedStyle(track).direction === 'rtl';
      const forward = direction === 'next' ? 1 : -1;
      track.scrollBy({
        left: (isRtl ? -forward : forward) * SCROLL_STEP,
        behavior: 'smooth',
      });
    };

    return (
      <RadioGroupPrimitive
        ref={ref}
        className={cn(
          segmentControlVariants({ variant }),
          hasScroll && 'relative w-full overflow-hidden',
          className
        )}
        {...props}
      >
        {hasScroll ? (
          <>
            <div
              ref={trackRef}
              className="flex h-full min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&>[role=radio]]:shrink-0 [&::-webkit-scrollbar]:hidden"
            >
              {children}
            </div>
            <div className="flex h-full shrink-0 items-center">
              <button
                type="button"
                aria-label={scrollPrevLabel}
                disabled={!canScrollPrev}
                onClick={() => scroll('prev')}
                className={scrollItemClassName}
              >
                <ChevronLeftIcon size={16} className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                aria-label={scrollNextLabel}
                disabled={!canScrollNext}
                onClick={() => scroll('next')}
                className={scrollItemClassName}
              >
                <ChevronRightIcon size={16} className="rtl:rotate-180" />
              </button>
            </div>
          </>
        ) : (
          children
        )}
      </RadioGroupPrimitive>
    );
  }
);
SegmentControl.displayName = 'SegmentControl';

export interface SegmentControlItemProps extends React.ComponentPropsWithoutRef<
  typeof RadioPrimitive.Root
> {
  /** Whether a Tag counter is rendered after the label. */
  hasCounter?: boolean;
  /** Tag configuration, applied only while `hasCounter` is true. */
  counter?: Pick<TagProps, 'variant' | 'size' | 'icon' | 'children'>;
}

const SegmentControlItem = React.forwardRef<
  React.ElementRef<typeof RadioPrimitive.Root>,
  SegmentControlItemProps
>(({ className, hasCounter = false, counter, children, ...props }, ref) => (
  <RadioPrimitive.Root
    ref={ref}
    className={cn(
      'inline-flex h-[var(--ui-segment-control-item-height)] min-w-0 shrink-0 cursor-pointer items-center justify-center gap-[var(--ui-segment-control-item-gap)] whitespace-nowrap rounded-[var(--ui-segment-control-item-border-radius)] border-[length:var(--ui-segment-control-item-border-width)] [border-style:var(--ui-segment-control-item-border-style)] border-[color:var(--ui-segment-control-item-border-color-idle)] bg-[var(--ui-segment-control-item-color-idle)] px-[var(--ui-segment-control-item-padding-x)] py-[var(--ui-segment-control-item-padding-y)] ui-segment-control-value-text-style text-[var(--ui-segment-control-value-color-idle)] outline-none transition-colors not-data-[checked]:hover:border-[color:var(--ui-segment-control-item-border-color-hover)] not-data-[checked]:hover:bg-[var(--ui-segment-control-item-color-hover)] not-data-[checked]:hover:text-[var(--ui-segment-control-value-color-hover)] data-[checked]:border-[color:var(--ui-segment-control-item-border-color-active)] data-[checked]:bg-[var(--ui-segment-control-item-color-active)] data-[checked]:text-[var(--ui-segment-control-value-color-active)] focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className
    )}
    {...props}
  >
    {children}
    {hasCounter && (
      <Tag
        variant={counter?.variant ?? 'neutral'}
        size={counter?.size ?? 'sm'}
        icon={counter?.icon}
      >
        {counter?.children}
      </Tag>
    )}
  </RadioPrimitive.Root>
));
SegmentControlItem.displayName = 'SegmentControlItem';

export { SegmentControl, SegmentControlItem, segmentControlVariants };
