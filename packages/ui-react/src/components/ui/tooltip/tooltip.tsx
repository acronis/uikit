import * as React from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { cn } from '@/lib/utils';

// A contextual hint shown on hover/focus of its trigger. Wraps the Base UI
// Tooltip primitive; the popup is themed with the `--ui-tooltip-*` token tier
// (a dark, ~90%-opaque bubble with a light label, 12/8px padding, 4px radius,
// 48–256px width). No arrow — matching the Figma design. Wrap the whole app (or
// a region) in `TooltipProvider` to share open/close delays across tooltips.

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> & {
    sideOffset?: number;
    side?: TooltipPrimitive.Positioner.Props['side'];
    align?: TooltipPrimitive.Positioner.Props['align'];
  }
>(({ className, sideOffset = 6, side = 'top', align = 'center', ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner sideOffset={sideOffset} side={side} align={align} className="z-50">
      <TooltipPrimitive.Popup
        ref={ref}
        className={cn(
          'max-w-[var(--ui-tooltip-global-width-max)] min-w-[var(--ui-tooltip-global-width-min)] rounded-[var(--ui-tooltip-global-radius)] bg-[var(--ui-tooltip-background)] px-[var(--ui-tooltip-global-padding-x)] py-[var(--ui-tooltip-global-padding-y)] text-xs font-medium leading-4 text-[var(--ui-tooltip-label)]',
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
