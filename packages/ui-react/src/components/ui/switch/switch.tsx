import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

// A binary on/off toggle: a Base UI Switch themed with the next-gen `--ui-switch-*`
// `box`/`tick` token tier. A 32×16 track with a 12px thumb; the track fill is wired
// per checked-state — off (`--ui-switch-off-box-idle`) / on (`--ui-switch-on-box-idle`,
// green) — and disabled swaps to the muted box fill + a light `tick`, plus a 1px inset
// border (`--ui-switch-global-box-border-color-disabled`). Keyboard focus paints a 3px
// `--ui-focus-primary` ring. The design has no hover/active color change (those token
// stops equal idle). The disabled border is an inset box-shadow so it doesn't shrink
// the 12px thumb's box (the Figma stroke is drawn inside).
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'group inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors',
      'data-[unchecked]:bg-[var(--ui-switch-off-box-idle)] data-[checked]:bg-[var(--ui-switch-on-box-idle)]',
      'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      'data-[disabled]:cursor-not-allowed data-[disabled]:data-[unchecked]:bg-[var(--ui-switch-off-box-disabled)] data-[disabled]:data-[checked]:bg-[var(--ui-switch-on-box-disabled)] data-[disabled]:shadow-[inset_0_0_0_1px_var(--ui-switch-global-box-border-color-disabled)]',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'block size-3 rounded-full bg-[var(--ui-switch-global-tick-idle)] transition-transform',
        'data-[checked]:translate-x-4',
        'group-data-[disabled]:bg-[var(--ui-switch-global-tick-disabled)]'
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';

export { Switch };
