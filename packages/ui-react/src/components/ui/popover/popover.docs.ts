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
   * (the docs demos do this via `useShadowMount`), or a `RefObject` pointing
   * at a not-yet-mounted container element — its `current` is resolved once
   * attached, so it doesn't need to be available on first render.
   */
  portalContainer?:
    | HTMLElement
    | ShadowRoot
    | null
    | React.RefObject<HTMLElement | ShadowRoot | null>;
  /** Keep the content mounted while closed. */
  keepMounted?: boolean;
  /**
   * Element/rect the popup is confined to when avoiding collisions. Defaults
   * to Base UI's own `'clipping-ancestors'` behavior, left alone here — see
   * `positionMethod` for why that already avoids clipping inside a
   * constrained `portalContainer`.
   */
  collisionBoundary?:
    | Element
    | Element[]
    | { x: number; y: number; width: number; height: number }
    | 'clipping-ancestors';
  /**
   * Which CSS `position` the popup uses. Defaults to `fixed` whenever the
   * popup is portaled into a resolved `portalContainer`, so it escapes a
   * plain overflow-clipping container (e.g. `overflow: hidden`) — the
   * collision-detection library drops such an ancestor from its clipping
   * chain for a `fixed`-positioned element, resolving to the real,
   * scroll-independent viewport. Not a guarantee against an ancestor that
   * also has a `transform`/`filter`/`will-change`/etc., which establishes
   * its own containing block for fixed descendants and still clips.
   */
  positionMethod?: 'absolute' | 'fixed';
  /** Extra classes merged onto the popup. */
  className?: string;
  children?: React.ReactNode;
}
