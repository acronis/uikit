import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import {
  CheckIcon,
  MinusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Wraps Base UI's Checkbox primitive, themed by the dedicated next-gen
// `--ui-checkbox-*` token tier from @acronis-platform/tokens-pd. The box has three
// logical states — `unchecked` (the base), `checked`, and `indeterminate` — each
// with its own per-interaction (idle / hover / active / disabled) fill
// (`*-box-*`), border (`*-box-border-color-*`), and glyph (`*-icon-*`) tokens.
// `unchecked` is the base layer (lowest specificity); `data-[checked]` /
// `data-[indeterminate]` override it (Base UI marks an indeterminate box with both
// data-unchecked AND data-indeterminate, so the single-attribute overrides win on
// specificity), and `data-[disabled]:data-[<state>]` overrides those in turn. The
// glyph (check when checked, minus when indeterminate) inherits the Root's text
// color via the Indicator's `text-current`. Box geometry (16px size, 2px radius)
// comes from `--ui-checkbox-global-box-*`; the focus ring uses `--ui-focus-primary`.
export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

const checkboxClasses = [
  // geometry + focus ring
  'inline-flex size-[var(--ui-checkbox-global-box-size)] shrink-0 cursor-pointer items-center justify-center rounded-[var(--ui-checkbox-global-box-border-radius)] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:shrink-0',
  // unchecked (base): idle / hover / active
  'bg-[var(--ui-checkbox-unchecked-box-idle)] border-[var(--ui-checkbox-unchecked-box-border-color-idle)]',
  'not-data-[disabled]:hover:bg-[var(--ui-checkbox-unchecked-box-hover)] not-data-[disabled]:hover:border-[var(--ui-checkbox-unchecked-box-border-color-hover)]',
  'not-data-[disabled]:active:bg-[var(--ui-checkbox-unchecked-box-active)] not-data-[disabled]:active:border-[var(--ui-checkbox-unchecked-box-border-color-active)]',
  // checked: idle / hover / active
  'data-[checked]:bg-[var(--ui-checkbox-checked-box-idle)] data-[checked]:border-[var(--ui-checkbox-checked-box-border-color-idle)] data-[checked]:text-[var(--ui-checkbox-checked-icon-idle)]',
  'data-[checked]:not-data-[disabled]:hover:bg-[var(--ui-checkbox-checked-box-hover)] data-[checked]:not-data-[disabled]:hover:border-[var(--ui-checkbox-checked-box-border-color-hover)] data-[checked]:not-data-[disabled]:hover:text-[var(--ui-checkbox-checked-icon-hover)]',
  'data-[checked]:not-data-[disabled]:active:bg-[var(--ui-checkbox-checked-box-active)] data-[checked]:not-data-[disabled]:active:border-[var(--ui-checkbox-checked-box-border-color-active)] data-[checked]:not-data-[disabled]:active:text-[var(--ui-checkbox-checked-icon-active)]',
  // indeterminate: idle / hover / active
  'data-[indeterminate]:bg-[var(--ui-checkbox-indeterminate-box-idle)] data-[indeterminate]:border-[var(--ui-checkbox-indeterminate-box-border-color-idle)] data-[indeterminate]:text-[var(--ui-checkbox-indeterminate-icon-idle)]',
  'data-[indeterminate]:not-data-[disabled]:hover:bg-[var(--ui-checkbox-indeterminate-box-hover)] data-[indeterminate]:not-data-[disabled]:hover:border-[var(--ui-checkbox-indeterminate-box-border-color-hover)] data-[indeterminate]:not-data-[disabled]:hover:text-[var(--ui-checkbox-indeterminate-icon-hover)]',
  'data-[indeterminate]:not-data-[disabled]:active:bg-[var(--ui-checkbox-indeterminate-box-active)] data-[indeterminate]:not-data-[disabled]:active:border-[var(--ui-checkbox-indeterminate-box-border-color-active)] data-[indeterminate]:not-data-[disabled]:active:text-[var(--ui-checkbox-indeterminate-icon-active)]',
  // disabled (unchecked base + per-state overrides)
  'data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--ui-checkbox-unchecked-box-disabled)] data-[disabled]:border-[var(--ui-checkbox-unchecked-box-border-color-disabled)]',
  'data-[disabled]:data-[checked]:bg-[var(--ui-checkbox-checked-box-disabled)] data-[disabled]:data-[checked]:border-[var(--ui-checkbox-checked-box-border-color-disabled)] data-[disabled]:data-[checked]:text-[var(--ui-checkbox-checked-icon-disabled)]',
  'data-[disabled]:data-[indeterminate]:bg-[var(--ui-checkbox-indeterminate-box-disabled)] data-[disabled]:data-[indeterminate]:border-[var(--ui-checkbox-indeterminate-box-border-color-disabled)] data-[disabled]:data-[indeterminate]:text-[var(--ui-checkbox-indeterminate-icon-disabled)]',
].join(' ');

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    indeterminate={indeterminate}
    className={cn(checkboxClasses, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {indeterminate ? <MinusIcon size={16} /> : <CheckIcon size={16} />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
