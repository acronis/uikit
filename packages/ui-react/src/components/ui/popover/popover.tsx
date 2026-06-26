import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `popover`
// (packages/ui-legacy/src/components/ui/popover.tsx). A floating panel anchored
// to a trigger, built on the Base UI Popover primitive (positioning, focus
// management, outside-press / Esc dismissal, ARIA come from Base UI). No
// `--ui-popover-*` token tier exists yet, so this design-pending v1 themes from
// the shared semantic tokens:
//   • surface -> bg-background (--ui-background-surface-primary)  (legacy `bg-popover`)
//   • text    -> text-foreground (--ui-text-on-surface-primary)  (legacy `text-popover-foreground`)
//   • border  -> border-border (--ui-border-on-surface-border)   (legacy bare `border`)
// Enter/exit animations use `tw-animate-css` keyed to Base UI's data-[open] /
// data-[closed] / data-[side] attributes. Reconcile (and a possible
// `--ui-popover-*` tier) with `/figma-component Popover <url> --update`.

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverPortal = PopoverPrimitive.Portal;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> {
  /** Which side of the trigger to render on. */
  side?: PopoverPrimitive.Positioner.Props['side'];
  /** Alignment along the chosen side. */
  align?: PopoverPrimitive.Positioner.Props['align'];
  /** Distance in px from the trigger. */
  sideOffset?: number;
  /**
   * Render inside a portal (default `true`). Set `false` for inline usage
   * (e.g. when supplying your own `PopoverPortal`).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: PopoverPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: PopoverPrimitive.Portal.Props['keepMounted'];
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(
  (
    {
      className,
      side = 'bottom',
      align = 'center',
      sideOffset = 4,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const positioner = (
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={cn(
            'w-72 rounded-md border border-border bg-background p-4 text-foreground shadow-md outline-none',
            'duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-95 data-[closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    );

    return portal ? (
      <PopoverPrimitive.Portal container={portalContainer} keepMounted={keepMounted}>
        {positioner}
      </PopoverPrimitive.Portal>
    ) : (
      positioner
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverPortal, PopoverContent };
