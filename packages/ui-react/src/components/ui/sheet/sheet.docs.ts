import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `SheetContent` in sheet.tsx
// extends Base UI's `Dialog.Popup` props, which expand to a large, noisy table;
// this companion documents only the props callers set directly. (The runtime type
// lives in sheet.tsx; this file is never bundled.)

/** Props for `SheetContent` — the portaled, edge-anchored panel. */
export interface SheetContentProps {
  /** Screen edge the panel anchors to: `top` · `right` (default) · `bottom` · `left`. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Render the content inside a portal (default `true`). Disable only when you
   * supply your own `SheetPortal` ancestor (e.g. inline usage).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
  /** Keep the content mounted while closed. */
  keepMounted?: boolean;
  /** Extra classes merged onto the panel. */
  className?: string;
  children?: React.ReactNode;
}
