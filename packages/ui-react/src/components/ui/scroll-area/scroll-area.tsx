import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@/lib/utils';

// A scrollable region with a custom **overlay** scrollbar built on Base UI's
// Scroll Area. Unlike a native `overflow: auto` element, the scrollbar floats
// over the content and reserves **zero** layout space, so full-bleed content
// (e.g. edge-to-edge selected rows in a sidebar) is never cropped by a gutter —
// on every OS and browser, not just where the platform provides overlay bars.
// The bar is revealed on hover/scroll and hidden at rest.

export type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Scrollbar
>;

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      data-slot="scroll-area-scrollbar"
      className={cn(
        // Above anything the scrolled content stacks. A scrollbar that content
        // can paint over is not a scrollbar — sticky table headers stack to z-50,
        // so the bar must sit above them inside the isolated root.
        'z-[60]',
        'flex touch-none select-none opacity-0 transition-opacity duration-150',
        // Revealed on hover/scroll; hidden at rest.
        'data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
        orientation === 'vertical' && 'h-full w-2.5 p-px',
        orientation === 'horizontal' && 'h-2.5 w-full flex-col p-px',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-[var(--ui-border-on-surface-border)] transition-colors hover:bg-[var(--ui-border-on-surface-border-active)]"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
);
ScrollBar.displayName = 'ScrollBar';

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /** Which scrollbar(s) to render. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * Ref to the **viewport** — the element that actually scrolls.
   *
   * `ref` reaches the root, which is `overflow: hidden` and never scrolls, so
   * it reports `scrollTop: 0` and `scrollHeight === clientHeight` forever.
   * Anything that measures, observes, or programmatically scrolls the region
   * needs this one instead: a virtualizer's scroll element, an infinite-scroll
   * observer, a scroll-to-item call.
   */
  viewportRef?: React.Ref<HTMLDivElement>;
  /**
   * Extra props for the viewport — a scroll handler, a tab index, or
   * `data-*` attributes that must sit on the element that scrolls rather than
   * on the wrapper around it.
   *
   * The `data-*` index signature is deliberate: JSX grants intrinsic elements
   * an arbitrary-`data-*` escape hatch, but a props object typed as
   * `HTMLAttributes` does not get it — so without this, the main thing this
   * prop exists for (marking the scrolling element for an observer) would not
   * type-check.
   */
  viewportProps?: React.HTMLAttributes<HTMLDivElement> & {
    readonly [attribute: `data-${string}`]: unknown;
  };
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      children,
      orientation = 'vertical',
      viewportRef,
      viewportProps,
      ...props
    },
    ref,
  ) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      // `isolate` contains the scroll area's stacking order. Without it the
      // root is `position: relative` with no z-index — not a stacking context
      // — so a z-index set on scrolled content competes against everything in
      // the document, and the scrollbar's own z-index would too. Isolating
      // keeps both local. It is `isolation`, deliberately, not
      // `contain`/`transform`: those would create a containing block and break
      // `position: sticky` inside the viewport.
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        {...viewportProps}
        className={cn(
          'size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)]',
          viewportProps?.className,
        )}
      >
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && <ScrollBar orientation="vertical" />}
      {orientation !== 'vertical' && <ScrollBar orientation="horizontal" />}
      {orientation === 'both' && (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      )}
    </ScrollAreaPrimitive.Root>
  ),
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea, ScrollBar };
