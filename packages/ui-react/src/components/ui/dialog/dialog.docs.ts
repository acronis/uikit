import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DialogContent` in
// dialog.tsx extends Base UI's `Dialog.Popup` props, which expand to a large,
// noisy table; this companion documents only the props callers set directly.
// (The runtime type lives in dialog.tsx; this file is never bundled.)

/** Props for `DialogContent` — the portaled, centered dialog popup. */
export interface DialogContentProps {
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
