import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `ToggleGroup`, `Toggle`,
// and `ToggleGroupItem` wrap Base UI's ToggleGroup / Toggle primitives and
// declare no local props interface, and the primitives' generated types expand
// into every inherited HTML attribute; this companion documents the props
// consumers set directly. (Runtime types come from Base UI; this file is never
// bundled.)

/** Props for `ToggleGroup` (the root). */
export interface ToggleGroupProps {
  /** Controlled array of pressed item values. Pair with `onValueChange`. */
  value?: readonly string[];
  /** Initially pressed item values (uncontrolled). */
  defaultValue?: readonly string[];
  /** Fired with the next array of pressed item values. */
  onValueChange?: (value: string[], eventDetails: unknown) => void;
  /**
   * Allow more than one item to be pressed at a time. When `false`, pressing an
   * item releases the previously pressed one. Defaults to `false`.
   */
  multiple?: boolean;
  /** Ignore all user interaction across the whole group. Defaults to `false`. */
  disabled?: boolean;
  /**
   * Arrow-key navigation axis; `vertical` also stacks the items and stretches
   * them to a common width. Defaults to `horizontal`.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Wrap arrow-key focus from the last item back to the first. Defaults to
   * `true`.
   */
  loopFocus?: boolean;
  /** One or more `ToggleGroupItem` buttons. */
  children?: React.ReactNode;
}

/** Props for `ToggleGroupItem` and the standalone `Toggle`. */
export interface ToggleProps {
  /** Identifies the item in the group's pressed-value array. */
  value?: string;
  /**
   * Controlled pressed state. Use on a standalone `Toggle`; inside a
   * `ToggleGroup` the group's `value` drives it.
   */
  pressed?: boolean;
  /** Initially pressed (uncontrolled). Defaults to `false`. */
  defaultPressed?: boolean;
  /** Fired with the next pressed state. */
  onPressedChange?: (pressed: boolean, eventDetails: unknown) => void;
  /** Disable just this toggle. */
  disabled?: boolean;
  /** Label text and/or an icon. Give icon-only toggles an `aria-label`. */
  children?: React.ReactNode;
}
