import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `NumberField` re-exports
// Base UI's `NumberField.Root` as-is and the parts wrap their Base UI counterparts
// without adding props, so there is no local interface for AutoTypeTable to read.
// This companion documents the props callers set directly. (Runtime types come
// from Base UI; this file is never bundled.)

/** Props for `NumberField` (the root) — owns the value, bounds, and stepping. */
export interface NumberFieldProps {
  /** The value (controlled). `null` is the empty input. */
  value?: number | null;
  /** The initial value (uncontrolled). */
  defaultValue?: number;
  /** Minimum value. Step interactions clamp to it. */
  min?: number;
  /** Maximum value. Step interactions clamp to it. */
  max?: number;
  /**
   * Amount the steppers and ↑/↓ change the value by. Defaults to `1`; `'any'`
   * disables step validation on submit.
   */
  step?: number | 'any';
  /** Increment used while Shift is held. Defaults to `10`. */
  largeStep?: number;
  /** Increment used while the meta key is held. Defaults to `0.1`. */
  smallStep?: number;
  /** Snap to the nearest multiple of `step` when stepping. Defaults to `false`. */
  snapOnStep?: boolean;
  /**
   * Let a typed value fall outside `min`/`max` so native range validation can
   * report it. Step interactions still clamp. Defaults to `false`.
   */
  allowOutOfRange?: boolean;
  /**
   * Change the value with the mouse wheel while the input is focused and
   * hovered. Defaults to `false`.
   */
  allowWheelScrub?: boolean;
  /** Disables the input and both steppers. */
  disabled?: boolean;
  /** Renders the value but blocks changes. */
  readOnly?: boolean;
  /** Requires a value before the owning form submits. */
  required?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /** `Intl.NumberFormat` options for the displayed value (currency, percent, …). */
  format?: Intl.NumberFormatOptions;
  /** Fired whenever the value changes. */
  onValueChange?: (value: number | null, eventDetails: unknown) => void;
  /** Fired once the interaction settles (blur, pointer release). */
  onValueCommitted?: (value: number | null, eventDetails: unknown) => void;
  /** The `NumberFieldGroup` and its steppers / input. */
  children?: React.ReactNode;
  /** Extra classes merged onto the root. */
  className?: string;
}
