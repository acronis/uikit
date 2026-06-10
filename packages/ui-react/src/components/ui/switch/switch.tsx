import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

// A binary on/off toggle: a Base UI Switch themed with the `--ui-switch-*` token
// tier. A 32×16 track with a 12px circle; each state is wired to its own token —
// off (`--ui-switch-background-inactive`) / on (`--ui-switch-background-active`,
// green) / disabled (track + a 1px inset border + circle). Keyboard focus paints
// a 3px `--ui-focus-primary` ring (the design's focus drop-shadow). The design
// has no hover color change. The disabled "border" is an inset box-shadow so it
// doesn't shrink the 12px circle's box (the Figma stroke is drawn inside).
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'group inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors',
      'data-[unchecked]:bg-[var(--ui-switch-background-inactive)] data-[checked]:bg-[var(--ui-switch-background-active)]',
      'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      'data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--ui-switch-background-disabled)] data-[disabled]:shadow-[inset_0_0_0_1px_var(--ui-switch-border-disabled)]',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'block size-3 rounded-full bg-[var(--ui-switch-circle-off)] transition-transform',
        'data-[checked]:translate-x-4 data-[checked]:bg-[var(--ui-switch-circle-on)]',
        'group-data-[disabled]:bg-[var(--ui-switch-circle-disabled)]'
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';

export { Switch };
