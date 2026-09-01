'use client';

import * as React from 'react';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { ButtonIconInput } from '../button-icon-input';

// Mirrors the Figma "InputNumPicker" component: a numeric stepper field built on
// Base UI's NumberField (Root/Group/Input/Decrement/Increment), themed by its own
// `--ui-input-num-picker-*` tier. Adds the field furniture InputText/InputSelect
// already ship: an optional `label` (with an optional `required` `*`). The stepper
// buttons reuse `ButtonIconInput` (already themed for exactly this "small icon
// inside a field box" role) via its `render` prop, rather than duplicating its
// idle/hover/active/disabled token wiring here.
export interface InputNumPickerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Root>,
    'children'
  > {
  /** Field label, rendered above the stepper box. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
  /** Accessible label for the decrement button. */
  decrementLabel?: string;
  /** Accessible label for the increment button. */
  incrementLabel?: string;
}

const InputNumPicker = React.forwardRef<HTMLInputElement, InputNumPickerProps>(
  (
    {
      className,
      id,
      label,
      required,
      disabled,
      decrementLabel = 'Decrease',
      incrementLabel = 'Increase',
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    return (
      <NumberFieldPrimitive.Root
        id={inputId}
        disabled={disabled}
        required={required}
        className={cn(
          'flex min-w-[var(--ui-input-num-picker-global-container-width-min)] flex-col items-center gap-[var(--ui-input-num-picker-global-container-gap)]',
          className
        )}
        {...props}
      >
        {label != null && label !== '' && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex w-full gap-[var(--ui-input-num-picker-global-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-num-picker-global-label-color-disabled)]'
                : 'text-[var(--ui-input-num-picker-global-label-color-idle)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-num-picker-global-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}

        <NumberFieldPrimitive.Group
          className={cn(
            'flex h-[var(--ui-input-num-picker-global-box-height)] w-full items-center gap-[var(--ui-input-num-picker-global-box-gap)] rounded-[var(--ui-input-num-picker-global-box-border-radius)] border-[length:var(--ui-input-num-picker-global-box-border-width)] border-solid border-[var(--ui-input-num-picker-normal-box-border-color-idle)] bg-[var(--ui-input-num-picker-global-box-color-idle)] px-[var(--ui-input-num-picker-global-box-padding-x)] py-[var(--ui-input-num-picker-global-box-padding-y)] transition-colors',
            'not-has-disabled:hover:border-[var(--ui-input-num-picker-normal-box-border-color-hover)] not-has-disabled:hover:bg-[var(--ui-input-num-picker-global-box-color-hover)]',
            'has-[input:focus-visible]:border-[var(--ui-input-num-picker-normal-box-border-color-hover)] has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-[var(--ui-focus-primary)]',
            'has-disabled:cursor-not-allowed has-disabled:border-[var(--ui-input-num-picker-normal-box-border-color-disabled)] has-disabled:bg-[var(--ui-input-num-picker-global-box-color-disabled)]'
          )}
        >
          <NumberFieldPrimitive.Decrement
            render={
              <ButtonIconInput aria-label={decrementLabel}>
                {/* Full-size glyph swapped for a small variant in Checkbox/Combobox/InputSelect/DropdownMenu's selection-indicator role; this is a decrement affordance, not a selection indicator, so it stays until design rules on whether the inset glyph applies here too. */}
                <MinusIcon size={16} />
              </ButtonIconInput>
            }
          />

          <NumberFieldPrimitive.Input
            ref={ref}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-center text-sm leading-6 outline-none',
              disabled
                ? 'text-[var(--ui-input-num-picker-global-value-color-disabled)]'
                : 'text-[var(--ui-input-num-picker-global-value-color-idle)]'
            )}
          />

          <NumberFieldPrimitive.Increment
            render={
              <ButtonIconInput aria-label={incrementLabel}>
                <PlusIcon size={16} />
              </ButtonIconInput>
            }
          />
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    );
  }
);
InputNumPicker.displayName = 'InputNumPicker';

export { InputNumPicker };
