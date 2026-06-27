// Documentation-only types for AutoTypeTable (apps/docs). The real props extend
// Base UI Field part props + VariantProps, which AutoTypeTable can't resolve into
// a useful table — these mirror the documented surface. Keep in sync with field.tsx.
import type * as React from 'react';

export interface FieldProps {
  /** Label/control layout — stacked, inline, or stacked-then-inline at the @md container width. */
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  /** Marks the field invalid (sets data-invalid + the control's aria-invalid). */
  invalid?: boolean;
  /** Disables the field and its control. */
  disabled?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /** When the field validates. */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';
  children?: React.ReactNode;
  className?: string;
}

export interface FieldErrorProps {
  /** Which ValidityState shows the message; `true` always shows it. */
  match?: boolean | keyof ValidityState;
  children?: React.ReactNode;
  className?: string;
}

export interface FieldLegendProps {
  /** Large legend text or small label text. */
  variant?: 'legend' | 'label';
  children?: React.ReactNode;
  className?: string;
}
