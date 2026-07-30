import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The `Combobox` root has no
// prop interface of its own — it forwards Base UI's generic
// `Combobox.Root.Props<Value, Multiple>` — so AutoTypeTable has nothing in
// combobox.tsx to resolve. Generic value types are flattened to `unknown` here,
// following the other `.docs.ts` companions. The parts that *do* declare their own
// interfaces (`ComboboxInputProps`, `ComboboxContentProps`) are documented straight
// from combobox.tsx. (This file is never bundled.)

/** Props for `Combobox` — the root. Holds the items, the query, and the value. */
export interface ComboboxProps {
  /**
   * The options: a flat array, or an array of groups. `{ value, label }` objects
   * have their label/value extracted automatically for display, filtering, and
   * form submission.
   */
  items?: readonly unknown[];
  /**
   * Match function for an item against the typed query. Pass `null` to disable
   * filtering (the list then shows every item).
   */
  filter?: null | ((itemValue: unknown, query: string) => boolean);
  /** Maximum number of items rendered. Defaults to `-1` (no limit). */
  limit?: number;
  /** The selected value (controlled) — an array when `multiple`. */
  value?: unknown;
  /** The initial selected value (uncontrolled) — an array when `multiple`. */
  defaultValue?: unknown;
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: unknown, eventDetails: unknown) => void;
  /** The text in the input (controlled). */
  inputValue?: string;
  /** The initial text in the input (uncontrolled). */
  defaultInputValue?: string;
  /** Called as the typed text changes. */
  onInputValueChange?: (inputValue: string, eventDetails: unknown) => void;
  /** Whether more than one item can be selected. Defaults to `false`. */
  multiple?: boolean;
  /** Whether the dropdown is open (controlled). */
  open?: boolean;
  /** Whether the dropdown is initially open (uncontrolled). Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the dropdown opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  /** Highlight the first match automatically while filtering. Defaults to `false`. */
  autoHighlight?: boolean;
  /** Ignore user interaction and apply the disabled token set. Defaults to `false`. */
  disabled?: boolean;
  /** Keep the input focusable but block changing the selection. Defaults to `false`. */
  readOnly?: boolean;
  /** Require a value before the owning form submits. Defaults to `false`. */
  required?: boolean;
  /** Identifies the field when a form is submitted. */
  name?: string;
  /** `ComboboxInput` + `ComboboxContent`. */
  children?: React.ReactNode;
}
