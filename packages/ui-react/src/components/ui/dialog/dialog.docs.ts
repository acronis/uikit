import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DialogContentProps` and
// `DialogProps` in dialog.tsx extend Base UI Dialog props, which expand to a
// large, noisy table; this companion documents only the props callers set
// directly. (The runtime types live in dialog.tsx; this file is never bundled.)
// `DialogContentProps` is internal (DialogRoot isn't exported from the package
// root) but stays documented here for engineers reading Dialog's source.

/** Props for `DialogContent` — the portaled, centered dialog popup. */
export interface DialogContentProps {
  /** Popup max-width. `sm` (512px, default) is the Figma-defined size; `large` (832px) is a legacy backward-compatibility size. */
  size?: 'sm' | 'large';
  /**
   * Render the content inside a portal (default `true`). Disable only when you
   * supply your own `DialogPortal` ancestor (e.g. inline usage).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
  /** Keep the content mounted while closed. */
  keepMounted?: boolean;
  /** Extra classes merged onto the popup. */
  className?: string;
  children?: React.ReactNode;
}

/** Props for `Dialog` — the public, variant-driven dialog recipe. */
export interface DialogProps {
  /**
   * Selects the canned title / body / footer preset. Defaults to `'default'`.
   * `'wide'` is a legacy escape hatch (no canned preset) kept for backward
   * compatibility — pair it with `size="large"` and the `footer` prop.
   */
  variant?:
    | 'default'
    | 'rename'
    | 'save changes'
    | 'reset password'
    | 'discard changes'
    | 'accept'
    | 'read-only'
    | 'wide';
  /** Show a spinner overlay across the body + footer. */
  hasLoading?: boolean;
  /**
   * Show the header (title + close button). Defaults to `true`. When `false`,
   * the title is still rendered off-screen so the dialog keeps an accessible
   * name — only the visible bar and close button are omitted.
   */
  hasHeader?: boolean;
  /** Show the footer (action buttons). Defaults to `true`. */
  hasFooter?: boolean;
  /** Overrides the variant's default body content. */
  children?: React.ReactNode;
  /** Overrides the variant's default title. */
  title?: string;
  /**
   * The real name of the object being acted on (e.g. a file or resource
   * name). Interpolated into the `rename`/`discard changes`/`accept`
   * variants' canned title/body in place of the generic placeholder text;
   * ignored by variants that don't reference an object name.
   */
  objectName?: string;
  /**
   * Overrides the accessible name of the `rename` variant's text field
   * (default `'Object name'`). Ignored by every other variant.
   */
  objectNameLabel?: string;
  /**
   * Overrides the variant's default secondary (dismiss) button label. Passing
   * this on a variant with no secondary button by default (e.g. `read-only`)
   * also makes the button appear. Ignored when `footer` is provided.
   */
  secondaryLabel?: string;
  /** Overrides the variant's default primary button label. Ignored when `footer` is provided. */
  primaryLabel?: string;
  /**
   * Fires when the primary footer button is clicked. The dialog does not
   * close automatically afterwards — pair this with `open`/`onOpenChange` to
   * close it once the action completes. Ignored when `footer` is provided.
   */
  onPrimaryAction?: () => void;
  /**
   * Replaces the footer's action content entirely with free-form buttons —
   * the escape hatch the `wide` variant is meant to be paired with, for
   * legacy call sites that don't fit one of the seven canned presets.
   */
  footer?: React.ReactNode;
  /** Overrides the close button's accessible name. Defaults to `'Close'`. */
  closeLabel?: string;
  /** Popup max-width. Defaults to `'sm'`, or to `'large'` when `variant` is `'wide'`. */
  size?: 'sm' | 'large';
  /** Render inside a portal (default `true`). */
  portal?: boolean;
  /** Portal container. Pass a shadow-root mount for isolated-style previews. */
  portalContainer?: HTMLElement | null;
  /** Extra classes merged onto the popup container. */
  className?: string;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Open on mount, uncontrolled. */
  defaultOpen?: boolean;
  /** Modal behavior — focus trap and scroll lock while open. Defaults to `true`. */
  modal?: boolean | 'trap-focus';
  /** Fires when the dialog opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
}
