import * as React from 'react';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import { cn } from '@/lib/utils';

// Radio group + item, wrapping Base UI's RadioGroup / Radio primitives. Radios
// are mutually exclusive, so the group owns the selected value; each Radio takes
// a `value`. Colors and geometry come from the dedicated next-gen `--ui-radio-*`
// token tier from @acronis-platform/tokens-pd (which mirrors `--ui-checkbox-*`):
// the circle has two logical states — `unchecked` (the base) and `checked` —
// each with its own per-interaction (idle / hover / active / disabled) fill
// (`*-box-color-*`) and border (`*-box-border-color-*`) tokens. `unchecked` is
// the base layer (lowest specificity); `data-[checked]` overrides it, and
// `data-[disabled]:data-[checked]` overrides that in turn. The inner dot fill
// uses `--ui-radio-checked-icon-color-*`. Box geometry (16px size) comes from
// `--ui-radio-global-box-size`; the focus ring uses `--ui-focus-primary`. Each
// state is wired to its own token, and the checked overrides are scoped with
// `not-data-[disabled]` so the disabled tokens win.

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
      // geometry + focus ring
      'inline-flex size-[var(--ui-radio-global-box-size)] shrink-0 cursor-pointer items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      // unchecked (base): idle / hover / active
      'bg-[var(--ui-radio-unchecked-box-color-idle)] border-[var(--ui-radio-unchecked-box-border-color-idle)]',
      'not-data-[disabled]:hover:bg-[var(--ui-radio-unchecked-box-color-hover)] not-data-[disabled]:hover:border-[var(--ui-radio-unchecked-box-border-color-hover)]',
      'not-data-[disabled]:active:bg-[var(--ui-radio-unchecked-box-color-active)] not-data-[disabled]:active:border-[var(--ui-radio-unchecked-box-border-color-active)]',
      // checked: idle / hover / active
      'data-[checked]:not-data-[disabled]:bg-[var(--ui-radio-checked-box-color-idle)] data-[checked]:not-data-[disabled]:border-[var(--ui-radio-checked-box-border-color-idle)]',
      'data-[checked]:not-data-[disabled]:hover:bg-[var(--ui-radio-checked-box-color-hover)] data-[checked]:not-data-[disabled]:hover:border-[var(--ui-radio-checked-box-border-color-hover)]',
      'data-[checked]:not-data-[disabled]:active:bg-[var(--ui-radio-checked-box-color-active)] data-[checked]:not-data-[disabled]:active:border-[var(--ui-radio-checked-box-border-color-active)]',
      // disabled (unchecked base + checked override)
      'data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--ui-radio-unchecked-box-color-disabled)] data-[disabled]:border-[var(--ui-radio-unchecked-box-border-color-disabled)]',
      'data-[disabled]:data-[checked]:bg-[var(--ui-radio-checked-box-color-disabled)] data-[disabled]:data-[checked]:border-[var(--ui-radio-checked-box-border-color-disabled)]',
      className
    )}
    {...props}
  >
    <RadioPrimitive.Indicator className="size-2 rounded-full bg-[var(--ui-radio-checked-icon-color-idle)] data-[disabled]:bg-[var(--ui-radio-checked-icon-color-disabled)]" />
  </RadioPrimitive.Root>
));
Radio.displayName = 'Radio';

export { RadioGroup, Radio };
