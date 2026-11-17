'use client';

import * as React from 'react';

const PortalContainerContext = React.createContext<HTMLElement | null | undefined>(undefined);

type PortalContainerTarget =
  | HTMLElement
  | ShadowRoot
  | React.RefObject<HTMLElement | ShadowRoot | null>
  | null
  | undefined;

function resolvePortalContainerNode(
  container: PortalContainerTarget
): HTMLElement | ShadowRoot | null {
  if (container == null) return null;
  return 'current' in container ? container.current : container;
}

function useResolvedPortalContainerNode(
  container: PortalContainerTarget
): HTMLElement | ShadowRoot | null {
  const [node, setNode] = React.useState(() =>
    resolvePortalContainerNode(container)
  );

  React.useLayoutEffect(() => {
    setNode(resolvePortalContainerNode(container));
  }, [container]);

  return node;
}

/**
 * Use fixed positioning for a popup that portals into a resolved container.
 * This lets it escape plain overflow-clipping ancestors while retaining the
 * default positioning when there is no portal target (or the popup is inline).
 */
export function usePortalContainerPositionMethod(
  container: PortalContainerTarget,
  isPortaled = true
): 'fixed' | undefined {
  const node = useResolvedPortalContainerNode(container);
  return isPortaled && node !== null ? 'fixed' : undefined;
}

export interface PortalContainerProviderProps {
  /**
   * The DOM element portaled content should render into (e.g. a `<div>` inside
   * a shadow root). When set, every ui-react portaling component
   * (`Popover`, `DropdownMenu`, `Tooltip`, `Dialog`, `Sheet`, `Select`,
   * `Combobox`, `Toast`) will mount its popup inside this element instead of
   * `document.body`.
   */
  container: HTMLElement | null;
  children: React.ReactNode;
}

/**
 * Provides a default portal container for all ui-react portaling components.
 *
 * Wrap your app (or a subtree) so that popups, dialogs, tooltips, toasts, etc.
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
