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
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)]"
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
  )
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea, ScrollBar };
