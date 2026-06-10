import * as React from 'react';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import { cn } from '@/lib/utils';

// Radio group + item, wrapping Base UI's RadioGroup / Radio primitives. Radios
// are mutually exclusive, so the group owns the selected value; each Radio takes
// a `value`. Colors and geometry come from the shared `--ui-form-*` token tier
// from @acronis-platform/tokens-pd (the same tier checkbox/input use): the 16px
// circle uses idle / hover / active / disabled border + background, the 8px dot
// uses `--ui-form-circle-active` (and `--ui-form-circle-disabled` when disabled),
// and the focus ring uses `--ui-focus-primary`. Each state is wired to its own
// token, and the checked fill is scoped with `not-data-[disabled]` so the
// disabled tokens win.

export type RadioGroupProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive
>;

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive
    ref={ref}
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
));
RadioGroup.displayName = 'RadioGroup';

export type RadioProps = React.ComponentPropsWithoutRef<
  typeof RadioPrimitive.Root
>;

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioPrimitive.Root>,
  RadioProps
>(({ className, ...props }, ref) => (
  <RadioPrimitive.Root
    ref={ref}
    className={cn(
      'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-[var(--ui-form-background-idle)] border-[var(--ui-form-border-idle)] outline-none transition-colors not-data-[disabled]:hover:border-[var(--ui-form-border-hover)] focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] data-[checked]:not-data-[disabled]:border-[var(--ui-form-border-active)] data-[checked]:not-data-[disabled]:bg-[var(--ui-form-background-active)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--ui-form-border-disabled)] data-[disabled]:bg-[var(--ui-form-background-disabled)]',
      className
    )}
    {...props}
  >
    <RadioPrimitive.Indicator className="size-2 rounded-full bg-[var(--ui-form-circle-active)] data-[disabled]:bg-[var(--ui-form-circle-disabled)]" />
  </RadioPrimitive.Root>
));
Radio.displayName = 'Radio';

export { RadioGroup, Radio };
