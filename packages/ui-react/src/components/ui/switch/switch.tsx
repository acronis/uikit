import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

// A binary on/off toggle: a Base UI Switch themed with the next-gen `--ui-switch-*`
// `box`/`tick` token tier. A 32×16 track with a 12px thumb; the track fill is wired
// per checked-state — off (`--ui-switch-off-box-color-idle`) / on
// (`--ui-switch-on-box-color-idle`, green) — and disabled swaps to the muted box
// fill + a light `tick`, plus a 1px inset border
// (`--ui-switch-global-box-border-color-disabled`). Keyboard focus paints a 3px
// `--ui-focus-primary` ring. The design has no hover/active color change (those token
// stops equal idle). The disabled border is an inset box-shadow so it doesn't shrink
// the 12px thumb's box (the Figma stroke is drawn inside).
//
// An optional `label` composes the full Figma field: the toggle plus its label in a
// clickable `<label>` row (a Base UI switch renders a labelable <button>, so clicking
// the text toggles it), wired via aria-labelledby and tinted with
// `--ui-switch-global-label-color`. With no label, the bare toggle renders — name it
// with `aria-label`.
const trackClasses = cn(
  'group inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors',
  'data-[unchecked]:bg-[var(--ui-switch-off-box-color-idle)] data-[checked]:bg-[var(--ui-switch-on-box-color-idle)]',
  'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
  'data-[disabled]:cursor-not-allowed data-[disabled]:data-[unchecked]:bg-[var(--ui-switch-off-box-color-disabled)] data-[disabled]:data-[checked]:bg-[var(--ui-switch-on-box-color-disabled)] data-[disabled]:shadow-[inset_0_0_0_1px_var(--ui-switch-global-box-border-color-disabled)]'
);

const thumbClasses = cn(
  'block size-3 rounded-full bg-[var(--ui-switch-global-tick-color-idle)] transition-transform',
  'data-[checked]:translate-x-4',
  'group-data-[disabled]:bg-[var(--ui-switch-global-tick-color-disabled)]'
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Optional label rendered beside the toggle; names the control. */
  label?: React.ReactNode;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, ...props }, ref) => {
  const reactId = React.useId();
  const labelId = label != null ? `${reactId}-label` : undefined;

  const root = (
    <SwitchPrimitive.Root
      ref={ref}
      aria-labelledby={labelId}
      className={cn(trackClasses, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={thumbClasses} />
    </SwitchPrimitive.Root>
  );

  if (label == null) return root;

  return (
    <label className="inline-flex cursor-pointer items-center gap-[var(--ui-switch-global-container-gap)]">
      {root}
      <span
        id={labelId}
        className="text-sm leading-6 font-normal text-[var(--ui-switch-global-label-color)]"
      >
        {label}
      </span>
    </label>
  );
});
Switch.displayName = 'Switch';

export { Switch };
