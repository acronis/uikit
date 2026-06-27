'use client';

import * as React from 'react';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform`'s `number-field`, on Base UI's NumberField
// (Root / Group / Decrement / Input / Increment). No `--ui-number-field-*` tier —
// the box reuses the `--ui-input-text-*` tier (already imported) so it matches
// InputBox / InputText; the steppers use the muted/primary surface + text tokens.

const NumberField = NumberFieldPrimitive.Root;

// The bordered box wrapping the steppers + input. Mirrors the InputBox field box
// (height / radius / border / bg / hover / focus-within ring / disabled / invalid).
const NumberFieldGroup = React.forwardRef<
  React.ElementRef<typeof NumberFieldPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Group>
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.Group
    ref={ref}
    className={cn(
      'flex h-[var(--ui-input-text-global-box-height)] w-full min-w-0 items-stretch overflow-hidden rounded-[var(--ui-input-text-global-box-border-radius)] border bg-[var(--ui-input-text-global-box-color-idle)] border-[var(--ui-input-text-normal-box-border-color-idle)] transition-colors',
      'not-has-disabled:hover:border-[var(--ui-input-text-normal-box-border-color-hover)]',
      'has-[input:focus-visible]:border-[var(--ui-input-text-normal-box-border-color-hover)] has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-[var(--ui-focus-primary)]',
      'has-disabled:cursor-not-allowed has-disabled:border-[var(--ui-input-text-normal-box-border-color-disabled)] has-disabled:bg-[var(--ui-input-text-global-box-color-disabled)]',
      'has-[input[aria-invalid=true]]:border-[var(--ui-input-text-error-msg-box-border-color-idle)] has-[input[aria-invalid=true]:focus-visible]:ring-[var(--ui-focus-error)]',
      className
    )}
    {...props}
  />
));
NumberFieldGroup.displayName = 'NumberFieldGroup';

const NumberFieldInput = React.forwardRef<
  React.ElementRef<typeof NumberFieldPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
  <NumberFieldPrimitive.Input
    ref={ref}
    className={cn(
      'min-w-0 flex-1 bg-transparent px-[var(--ui-input-text-global-box-padding-x)] text-center text-sm leading-6 text-[var(--ui-input-text-global-value-color-idle)] outline-none placeholder:text-[var(--ui-input-text-global-placeholder-color-idle)] disabled:cursor-not-allowed disabled:text-[var(--ui-input-text-global-value-color-disabled)]',
      className
    )}
    {...props}
  />
));
NumberFieldInput.displayName = 'NumberFieldInput';

const stepperClassName =
  'flex w-9 shrink-0 cursor-pointer items-center justify-center text-[var(--ui-text-on-surface-secondary)] transition-colors not-disabled:hover:bg-[var(--ui-background-surface-hover)] not-disabled:hover:text-[var(--ui-text-on-surface-primary)] disabled:cursor-not-allowed disabled:text-[var(--ui-text-on-surface-disabled)]';

const NumberFieldDecrement = React.forwardRef<
  React.ElementRef<typeof NumberFieldPrimitive.Decrement>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Decrement>
>(({ className, children, ...props }, ref) => (
  <NumberFieldPrimitive.Decrement
    ref={ref}
    className={cn(stepperClassName, className)}
    {...props}
  >
    {children ?? <MinusIcon size={16} />}
  </NumberFieldPrimitive.Decrement>
));
NumberFieldDecrement.displayName = 'NumberFieldDecrement';

const NumberFieldIncrement = React.forwardRef<
  React.ElementRef<typeof NumberFieldPrimitive.Increment>,
  React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Increment>
>(({ className, children, ...props }, ref) => (
  <NumberFieldPrimitive.Increment
    ref={ref}
    className={cn(stepperClassName, className)}
    {...props}
  >
    {children ?? <PlusIcon size={16} />}
  </NumberFieldPrimitive.Increment>
));
NumberFieldIncrement.displayName = 'NumberFieldIncrement';

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
};
