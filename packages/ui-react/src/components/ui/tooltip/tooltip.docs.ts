import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `TooltipContent` in
// tooltip.tsx extends Base UI's `Tooltip.Popup` props (plus a few Positioner /
// Portal props), which expand to a large, noisy table; this companion documents
// only the props callers set directly. (The runtime types live in tooltip.tsx;
// this file is never bundled.)

/** Props for `TooltipContent` — the portaled, positioned hint bubble. */
export interface TooltipContentProps {
  /** Which side of the trigger to render on. Defaults to `top`. */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  /** Alignment along the chosen side. Defaults to `center`. */
  align?: 'start' | 'center' | 'end';
  /** Distance in px from the trigger. Defaults to `6`. */
  sideOffset?: number;
  /**
   * Override what the popup is positioned against — defaults to the
   * `TooltipTrigger` element. Use it when the hover/focus trigger is narrower
   * than the element the tooltip should visually align to (e.g. a truncating
   * label inside a full-width row). Also accepts a Base UI `VirtualElement`.
   */
  anchor?:
    | Element
    | React.RefObject<Element | null>
    | (() => Element | null)
    | null;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
  /** Keep the popup mounted while closed. */
  keepMounted?: boolean;
  /** Extra classes merged onto the popup. */
  className?: string;
  children?: React.ReactNode;
}

/** Props for `TooltipProvider` — shares open/close timing across tooltips. */
export interface TooltipProviderProps {
  /** How long to wait before opening a tooltip, in ms. Defaults to `300`. */
  delay?: number;
  /** How long to wait before closing a tooltip, in ms. */
  closeDelay?: number;
  /**
   * Another tooltip opens instantly if the previous one closed within this
   * window, in ms. Defaults to `400`.
   */
  timeout?: number;
  children?: React.ReactNode;
}
