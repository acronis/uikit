import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The root's real props are
// Base UI's generic `Select.Root.Props<Value, Multiple>` and the Label/Content
// parts declare their props inline (no exported interface), so AutoTypeTable can't
// render a useful table from input-select.tsx for any of the three. Generic value
// types are flattened to `unknown` here, following the other `.docs.ts`
// companions. (The runtime types live in input-select.tsx; this file is never
// bundled — and `Select*` re-exports the same parts, so select.mdx points here too.)

/** Props for `InputSelect` — the root. Owns the open + selection state. */
export interface InputSelectProps {
  /**
   * Item data structure. When set, `InputSelectValue` renders the selected item's
   * label instead of the raw value while the popup is closed.
   */
  items?:
    | Record<string, React.ReactNode>
    | ReadonlyArray<{ label: React.ReactNode; value: unknown }>;
  /** The selected value (controlled) — an array when `multiple`. */
  value?: unknown;
  /** The initial selected value (uncontrolled) — an array when `multiple`. */
  defaultValue?: unknown;
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: unknown, eventDetails: unknown) => void;
  /**
   * Allow selecting several items: each row shows a leading checkbox and the
   * popup stays open. Defaults to `false`.
   */
  multiple?: boolean;
  /** Whether the popup is open (controlled). */
  open?: boolean;
  /** Whether the popup is initially open (uncontrolled). Defaults to `false`. */
  defaultOpen?: boolean;
  /**
   * Called when the popup opens or closes. `InputSelect` also resets the
   * in-dropdown search query on close, so the popup reopens unfiltered.
   */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  /** Ignore user interaction and apply the disabled token set. Defaults to `false`. */
  disabled?: boolean;
  /** Keep the trigger focusable but block changing the selection. Defaults to `false`. */
  readOnly?: boolean;
  /** Require a value before the owning form submits. Defaults to `false`. */
  required?: boolean;
  /** Identifies the field when a form is submitted (via a hidden input). */
  name?: string;
  /** `InputSelectField` + `InputSelectContent`. */
  children?: React.ReactNode;
}

/** Props for `InputSelectLabel` — the field label, auto-associated with the trigger. */
export interface InputSelectLabelProps {
  /** Appends a required `*` marker (decorative) after the label text. */
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Props for `InputSelectContent` — the positioned, portaled dropdown popup. */
export interface InputSelectContentProps {
  /** Which side of the trigger to open on. Defaults to `bottom`. */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  /** Alignment along the chosen side. Defaults to `start`. */
  align?: 'start' | 'center' | 'end';
  /** Distance in px from the trigger. Defaults to `4`. */
  sideOffset?: number;
  /**
   * Portal container for the popup. Defaults to the container from
   * `PortalContainerProvider`, then `document.body`. Pass a shadow-root mount for
   * isolated-style previews.
   */
  portalContainer?: HTMLElement | null | React.RefObject<HTMLElement | null>;
  /** Extra classes merged onto the popup. */
  className?: string;
  children?: React.ReactNode;
}
