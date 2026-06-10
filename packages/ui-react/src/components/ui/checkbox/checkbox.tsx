import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import {
  CheckIcon,
  MinusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Wraps Base UI's Checkbox primitive. Colors and geometry come from the shared
// `--ui-form-*` token tier (idle / hover / active / disabled border + background)
// from @acronis-platform/tokens-pd — the same tier other form controls use. The
// glyph (check when checked, minus when indeterminate) is tinted with
// `--ui-glyph-on-brand-primary` and the focus ring with `--ui-focus-primary`.
// Each interaction state is wired to its own token so brand overrides are honored.
export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    indeterminate={indeterminate}
    className={cn(
      'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[2px] border bg-[var(--ui-form-background-idle)] border-[var(--ui-form-border-idle)] text-[var(--ui-glyph-on-brand-primary)] transition-colors focus-visible:outline-none not-data-[disabled]:hover:border-[var(--ui-form-border-hover)] focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] data-[checked]:not-data-[disabled]:border-[var(--ui-form-border-active)] data-[checked]:not-data-[disabled]:bg-[var(--ui-form-background-active)] data-[indeterminate]:not-data-[disabled]:border-[var(--ui-form-border-active)] data-[indeterminate]:not-data-[disabled]:bg-[var(--ui-form-background-active)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--ui-form-border-disabled)] data-[disabled]:bg-[var(--ui-form-background-disabled)] data-[disabled]:text-[var(--ui-form-icon-disabled)] [&_svg]:shrink-0',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {indeterminate ? <MinusIcon size={16} /> : <CheckIcon size={16} />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
