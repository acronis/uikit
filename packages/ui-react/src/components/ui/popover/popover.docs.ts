import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `PopoverContent` in
// popover.tsx extends Base UI's `Popover.Popup` props, which expand to a large,
// noisy table; this companion documents only the props callers set directly.
// (The runtime type lives in popover.tsx; this file is never bundled.)

/** Props for `PopoverContent` — the positioned, portaled popover panel. */
export interface PopoverContentProps {
  /** Which side of the trigger to render on. Defaults to `bottom`. */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  /** Alignment along the chosen side. Defaults to `center`. */
  align?: 'start' | 'center' | 'end';
  /** Distance in px from the trigger. Defaults to `4`. */
  sideOffset?: number;
  /**
   * Render inside a portal (default `true`). Disable only when you supply your
   * own `PopoverPortal` ancestor.
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
