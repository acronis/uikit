import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DropdownMenuContent` in
// dropdown-menu.tsx extends Base UI's `Menu.Popup` props, which expand to a
// large, noisy table; this companion documents only the props callers set
// directly. (The runtime type lives in dropdown-menu.tsx; this file is never
// bundled.)

/** Props for `DropdownMenuContent` — the positioned, portaled menu popup. */
export interface DropdownMenuContentProps {
  /** Which side of the trigger to render on. Defaults to `bottom`. */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  /** Alignment along the chosen side. */
  align?: 'start' | 'center' | 'end';
  /** Distance in px from the trigger. Defaults to `4`. */
  sideOffset?: number;
  /**
   * Render inside a portal (default `true`). Disable only when you supply your
   * own `DropdownMenuPortal` ancestor.
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
