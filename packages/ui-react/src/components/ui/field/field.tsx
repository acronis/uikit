'use client';

import * as React from 'react';
import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { labelClassName } from '../label';
import { Separator } from '../separator';

// Ported from `@acronis-platform/shadcn-uikit`'s `field`
// (packages/ui-legacy/src/components/ui/field.tsx), rebuilt on Base UI's `Field`
// primitive. `Field` (Root) / `FieldLabel` / `FieldControl` / `FieldDescription` /
// `FieldError` auto-wire the label↔control↔description↔error associations and
// expose Base UI's validity state — no manual `htmlFor`/`id`/`aria-*`. The
// structural parts (`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`,
// `FieldTitle`, `FieldSeparator`) are styled markup (Base UI has no equivalent).
// Field pairs with the *bare* controls — `InputBox`, `Checkbox`, `Switch`,
// `RadioGroup` — not the self-contained `InputText`/`InputSearch` fields.

const fieldVariants = cva(
  'group/field flex w-full gap-3 data-[invalid]:text-[var(--ui-text-on-status-danger)]',
  {
    variants: {
      orientation: {
        vertical: 'flex-col [&>*]:w-full [&>.sr-only]:w-auto',
        horizontal:
          'flex-row items-center [&>[data-slot=field-label]]:flex-auto',
        responsive:
          'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);

export interface FieldProps
  extends Omit<React.ComponentProps<typeof FieldPrimitive.Root>, 'className'>,
    VariantProps<typeof fieldVariants> {
  className?: string;
}

function Field({ className, orientation = 'vertical', ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

export interface FieldLabelProps
  extends Omit<React.ComponentProps<typeof FieldPrimitive.Label>, 'className'> {
  className?: string;
}

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        labelClassName,
        'flex w-fit items-center gap-2 leading-snug group-data-[disabled]/field:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export interface FieldControlProps
  extends Omit<React.ComponentProps<typeof FieldPrimitive.Control>, 'className'> {
  className?: string;
}

// Thin wrapper over Base UI's Field.Control — usually used with `render` to wire
// a bare ui-react control (e.g. `<FieldControl render={<InputBox />} />`), which
// receives the field's id / aria-describedby / name automatically.
function FieldControl({ className, ...props }: FieldControlProps) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cn(className)}
      {...props}
    />
  );
}

export interface FieldDescriptionProps
  extends Omit<
    React.ComponentProps<typeof FieldPrimitive.Description>,
    'className'
  > {
  className?: string;
}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        'text-sm font-normal leading-normal text-muted-foreground',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-[var(--ui-background-brand-secondary)]',
        className
      )}
      {...props}
    />
  );
}

export interface FieldErrorProps
  extends Omit<React.ComponentProps<typeof FieldPrimitive.Error>, 'className'> {
  className?: string;
}

function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn(
        'text-sm font-normal text-[var(--ui-text-on-status-danger)]',
        className
      )}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  );
}

export interface FieldLegendProps extends React.ComponentProps<'legend'> {
  variant?: 'legend' | 'label';
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-3 font-medium data-[variant=legend]:text-base data-[variant=label]:text-sm',
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-7 [&>[data-slot=field-group]]:gap-4',
        className
      )}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'group/field-content flex flex-1 flex-col gap-1.5 leading-snug',
        className
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        'flex w-fit items-center gap-2 text-sm font-medium leading-snug group-data-[disabled]/field:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export interface FieldSeparatorProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode;
}

function FieldSeparator({ children, className, ...props }: FieldSeparatorProps) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn('relative -my-2 h-5 text-sm', className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        >
          {children}
        </span>
      )}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldContent,
  FieldTitle,
  FieldSeparator,
};
