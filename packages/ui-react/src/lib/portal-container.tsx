'use client';

import * as React from 'react';

const PortalContainerContext = React.createContext<HTMLElement | null | undefined>(undefined);

export interface PortalContainerProviderProps {
  /**
   * The DOM element portaled content should render into (e.g. a `<div>` inside
   * a shadow root). When set, every ui-react portaling component
   * (`Popover`, `DropdownMenu`, `Tooltip`, `Dialog`, `Sheet`, `Select`,
   * `Combobox`) will mount its popup inside this element instead of
   * `document.body`.
   */
  container: HTMLElement | null;
  children: React.ReactNode;
}

/**
 * Provides a default portal container for all ui-react portaling components.
 *
 * Wrap your app (or a subtree) so that popups, dialogs, tooltips, etc.
 * render inside the given container instead of `document.body`. This is the
 * recommended way for shadow-DOM MFEs to keep portaled content inside the
 * shadow root where adopted stylesheets apply.
 *
 * Individual components' `portalContainer` prop overrides this context.
 *
 * @example
 * ```tsx
 * // Inside a shadow-DOM MFE — all portals go into the shadow root
 * <PortalContainerProvider container={shadowRootMountDiv}>
 *   <App />
 * </PortalContainerProvider>
 * ```
 */
export function PortalContainerProvider({ container, children }: PortalContainerProviderProps) {
  return (
    <PortalContainerContext value={container}>
      {children}
    </PortalContainerContext>
  );
}

/**
 * Returns the portal container set by the nearest `PortalContainerProvider`,
 * or `undefined` if none exists (letting Base UI default to `document.body`).
 */
export function usePortalContainer(): HTMLElement | null | undefined {
  return React.useContext(PortalContainerContext);
}
