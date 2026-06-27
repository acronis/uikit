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
// (`*-box-color-*`), border (`*-box-border-color-*`), and glyph (`*-icon-color-*`)
// tokens. `unchecked` is the base layer (lowest specificity); `data-[checked]` /
// `data-[indeterminate]` override it (Base UI marks an indeterminate box with both
// data-unchecked AND data-indeterminate, so the single-attribute overrides win on
// specificity), and `data-[disabled]:data-[<state>]` overrides those in turn. The
// glyph (check when checked, minus when indeterminate) inherits the Root's text
// color via the Indicator's `text-current`. Box geometry (16px size, 2px radius)
// comes from `--ui-checkbox-global-box-*`; the focus ring uses `--ui-focus-primary`.
//
// An optional `label` / `description` compose the full Figma field: the box, an
// optional label, and an optional description stacked beside it. When either is
// present the whole row is a `<label>` (so clicking the text toggles the box — a
// Base UI checkbox renders a labelable <button>), the box gets a top margin of
// `--ui-checkbox-global-box-margin-x` (4px = (line-height 24 − box 16) / 2, the
// design's box alignment margin) to center it on the first text line, and the
// box is wired to the text via aria-labelledby / aria-describedby. With neither,
// the box renders on its own (name it with `aria-label`).
const boxClasses = [
  // geometry + focus ring
  // `align-middle` keeps the box vertically centered when it sits inline next to
  // text (e.g. in a table cell) rather than defaulting to the text baseline.
  'inline-flex size-[var(--ui-checkbox-global-box-size)] shrink-0 cursor-pointer items-center justify-center rounded-[var(--ui-checkbox-global-box-border-radius)] border align-middle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:shrink-0',
  // unchecked (base): idle / hover / active
  'bg-[var(--ui-checkbox-unchecked-box-color-idle)] border-[var(--ui-checkbox-unchecked-box-border-color-idle)]',
  'not-data-[disabled]:hover:bg-[var(--ui-checkbox-unchecked-box-color-hover)] not-data-[disabled]:hover:border-[var(--ui-checkbox-unchecked-box-border-color-hover)]',
  'not-data-[disabled]:active:bg-[var(--ui-checkbox-unchecked-box-color-active)] not-data-[disabled]:active:border-[var(--ui-checkbox-unchecked-box-border-color-active)]',
  // checked: idle / hover / active
  'data-[checked]:bg-[var(--ui-checkbox-checked-box-color-idle)] data-[checked]:border-[var(--ui-checkbox-checked-box-border-color-idle)] data-[checked]:text-[var(--ui-checkbox-checked-icon-color-idle)]',
  'data-[checked]:not-data-[disabled]:hover:bg-[var(--ui-checkbox-checked-box-color-hover)] data-[checked]:not-data-[disabled]:hover:border-[var(--ui-checkbox-checked-box-border-color-hover)] data-[checked]:not-data-[disabled]:hover:text-[var(--ui-checkbox-checked-icon-color-hover)]',
  'data-[checked]:not-data-[disabled]:active:bg-[var(--ui-checkbox-checked-box-color-active)] data-[checked]:not-data-[disabled]:active:border-[var(--ui-checkbox-checked-box-border-color-active)] data-[checked]:not-data-[disabled]:active:text-[var(--ui-checkbox-checked-icon-color-active)]',
  // indeterminate: idle / hover / active
  'data-[indeterminate]:bg-[var(--ui-checkbox-indeterminate-box-color-idle)] data-[indeterminate]:border-[var(--ui-checkbox-indeterminate-box-border-color-idle)] data-[indeterminate]:text-[var(--ui-checkbox-indeterminate-icon-color-idle)]',
  'data-[indeterminate]:not-data-[disabled]:hover:bg-[var(--ui-checkbox-indeterminate-box-color-hover)] data-[indeterminate]:not-data-[disabled]:hover:border-[var(--ui-checkbox-indeterminate-box-border-color-hover)] data-[indeterminate]:not-data-[disabled]:hover:text-[var(--ui-checkbox-indeterminate-icon-color-hover)]',
  'data-[indeterminate]:not-data-[disabled]:active:bg-[var(--ui-checkbox-indeterminate-box-color-active)] data-[indeterminate]:not-data-[disabled]:active:border-[var(--ui-checkbox-indeterminate-box-border-color-active)] data-[indeterminate]:not-data-[disabled]:active:text-[var(--ui-checkbox-indeterminate-icon-color-active)]',
  // disabled (unchecked base + per-state overrides)
  'data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--ui-checkbox-unchecked-box-color-disabled)] data-[disabled]:border-[var(--ui-checkbox-unchecked-box-border-color-disabled)]',
  'data-[disabled]:data-[checked]:bg-[var(--ui-checkbox-checked-box-color-disabled)] data-[disabled]:data-[checked]:border-[var(--ui-checkbox-checked-box-border-color-disabled)] data-[disabled]:data-[checked]:text-[var(--ui-checkbox-checked-icon-color-disabled)]',
  'data-[disabled]:data-[indeterminate]:bg-[var(--ui-checkbox-indeterminate-box-color-disabled)] data-[disabled]:data-[indeterminate]:border-[var(--ui-checkbox-indeterminate-box-border-color-disabled)] data-[disabled]:data-[indeterminate]:text-[var(--ui-checkbox-indeterminate-icon-color-disabled)]',
].join(' ');

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Optional label rendered beside the box; names the control. */
  label?: React.ReactNode;
  /** Optional secondary description rendered under the label. */
  description?: React.ReactNode;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, indeterminate, ...props }, ref) => {
  const reactId = React.useId();
  const labelId = label != null ? `${reactId}-label` : undefined;
  const descriptionId = description != null ? `${reactId}-description` : undefined;
  const hasContent = label != null || description != null;

  const box = (
    <CheckboxPrimitive.Root
      ref={ref}
      indeterminate={indeterminate}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className={cn(
        boxClasses,
        hasContent && 'mt-[var(--ui-checkbox-global-box-margin-x)]',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {indeterminate ? <MinusIcon size={16} /> : <CheckIcon size={16} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!hasContent) return box;

  return (
    <label className="inline-flex max-w-[var(--ui-checkbox-global-container-width-max)] min-w-[var(--ui-checkbox-global-container-width-min)] cursor-pointer items-start gap-[var(--ui-checkbox-global-container-gap)]">
      {box}
      <span className="flex max-w-[var(--ui-checkbox-global-container-content-width-max)] flex-col gap-[var(--ui-checkbox-global-container-content-gap)]">
        {label != null && (
          <span
            id={labelId}
            className="text-sm leading-6 font-normal text-[var(--ui-checkbox-global-label-color)]"
          >
            {label}
          </span>
        )}
        {description != null && (
          <span
            id={descriptionId}
            className="text-sm leading-6 font-normal text-[var(--ui-checkbox-global-description-color)]"
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
