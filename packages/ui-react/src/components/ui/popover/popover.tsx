import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

// Ported from `@acronis-platform/shadcn-uikit`'s `popover`
// (packages/ui-legacy/src/components/ui/popover.tsx). A floating panel anchored
// to a trigger, built on the Base UI Popover primitive (positioning, focus
// management, outside-press / Esc dismissal, ARIA come from Base UI). Themed by
// the `--ui-popover-*` tier (container chrome: color, border, radius, min/max
// width) per Figma node 6364:17907. The optional `PopoverBody`/`PopoverFooter`
// parts mirror that node's `Body` slot and `FooterDefault` recipe — `PopoverBody`
// from `--ui-popover-body-*`, `PopoverFooter` from the shared `--ui-footer-*`
// tier (also used by other components' default action-row footer). Text color
// stays on the bridged semantic token (--ui-text-on-surface-primary), which the
// design references directly rather than a Popover-specific token.
// Enter/exit animations use `tw-animate-css` keyed to Base UI's data-[open] /
// data-[closed] / data-[side] attributes.

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverPortal = PopoverPrimitive.Portal;

// Mirrors Base UI's own container resolution (FloatingPortal): a `container`
// prop may be the node itself or a ref object wrapping it. A ref object is
// always truthy, so a raw `Boolean(container)` would treat `ref.current ===
// null` as a resolved container when Base UI actually falls back to
// `document.body`.
function resolvePortalContainerNode(
  container: PopoverPrimitive.Portal.Props['container']
): HTMLElement | ShadowRoot | null {
  if (container == null) return null;
  return 'current' in container ? container.current : container;
}

// Base UI resolves the same `container` prop inside a layout effect (see
// FloatingPortal's useFloatingPortalNode), because a ref pointing at a node
// rendered in the same commit isn't populated until after commit — React
// attaches every ref in a commit before running any layout effect in it.
// Resolving inline during render (as a plain expression) would race that:
// on the ref's first commit `current` is still null, and since nothing
// re-renders on a ref mutation, a wrong 'absolute' default could stick
// indefinitely. Mirroring Base UI's own two-phase timing here — a state
// value corrected by a layout effect — picks up a same-commit ref
// correctly, same as Base UI does for its own portaling.
function useResolvedPortalContainerNode(
  container: PopoverPrimitive.Portal.Props['container']
): HTMLElement | ShadowRoot | null {
  const [node, setNode] = React.useState(() =>
    resolvePortalContainerNode(container)
  );

  React.useLayoutEffect(() => {
    setNode(resolvePortalContainerNode(container));
  }, [container]);

  return node;
}

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Popup
> {
  /** Which side of the trigger to render on. */
  side?: PopoverPrimitive.Positioner.Props['side'];
  /** Alignment along the chosen side. */
  align?: PopoverPrimitive.Positioner.Props['align'];
  /** Distance in px from the trigger. */
  sideOffset?: number;
  /**
   * Render inside a portal (default `true`). Set `false` for inline usage
   * (e.g. when supplying your own `PopoverPortal`).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`), or a constrained
   * MFE/Shadow DOM mount point (see `PortalContainerProvider`).
   */
  portalContainer?: PopoverPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: PopoverPrimitive.Portal.Props['keepMounted'];
  /**
   * Element/rect the popup is confined to when avoiding collisions. Defaults
   * to Base UI's own `'clipping-ancestors'` behavior — left alone here,
   * since pairing it with the `positionMethod` default below already avoids
   * clipping inside a constrained `portalContainer` (see that prop's doc).
   * Override explicitly if a different boundary is needed.
   */
  collisionBoundary?: PopoverPrimitive.Positioner.Props['collisionBoundary'];
  /**
   * Which CSS `position` the popup uses. Defaults to `'fixed'` whenever the
   * popup is portaled (`portal` is not `false`) into a resolved
   * `portalContainer` — an `'absolute'`-positioned popup
   * (Base UI's own default) is still clipped by a `portalContainer` ancestor
   * that constrains overflow (e.g. a Shadow DOM host with `overflow: hidden`)
   * no matter how the collision boundary is computed, since it shares that
   * ancestor's containing block. `'fixed'` escapes a plain overflow-clipping
   * ancestor — for a `fixed`-positioned popup, the collision-detection
   * library (floating-ui) drops overflow ancestors that don't establish
   * their own containing block, so it clips against the real viewport
   * instead, which is also unaffected by page scroll (unlike measuring
   * `document.documentElement`'s own bounding rect, which shrinks by the
   * scroll offset). Note this is not an absolute guarantee: an ancestor with
   * `transform`, `filter`, `will-change`, `backdrop-filter`, `perspective`,
   * or `contain: paint`/`layout` *does* establish a containing block, so it
   * still clips (and repositions relative to) a `fixed` descendant. Override
   * explicitly if a different strategy is needed.
   */
  positionMethod?: PopoverPrimitive.Positioner.Props['positionMethod'];
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(
  (
    {
      className,
      side = 'bottom',
      align = 'center',
      sideOffset = 4,
      portal = true,
      portalContainer,
      keepMounted,
      collisionBoundary,
      positionMethod,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;
    const resolvedContainerNode =
      useResolvedPortalContainerNode(resolvedContainer);
    // Gated on this component's own `portal` prop, not on whether the popup
    // actually ends up inside a constrained containing block: `portal={false}`
    // opts out of the viewport-escape defaults so inline content keeps its
    // intended scroll-with-content behavior. A consumer who wraps this in
    // their own ancestor Portal targeting the same constrained container can
    // still get clipped — pass `positionMethod` explicitly in that case.
    const appliesContainerDefaults = portal && resolvedContainerNode != null;
    // 'absolute' (Base UI's default) shares its portal container's
    // containing block, so a container that constrains overflow (e.g.
    // `overflow: hidden` on a Shadow DOM host) clips the popup at its own
    // edge no matter how the collision boundary is computed. 'fixed' escapes
    // a plain overflow-clipping ancestor instead: floating-ui's clipping-
    // ancestor detection drops overflow ancestors that don't establish their
    // own containing block for a `fixed`-positioned element, so the platform
    // default collision boundary ('clipping-ancestors') already resolves to
    // the real (scroll-independent) viewport without needing an explicit
    // `collisionBoundary` override here.
    const resolvedPositionMethod =
      positionMethod ?? (appliesContainerDefaults ? 'fixed' : undefined);

    const positioner = (
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionBoundary={collisionBoundary}
        positionMethod={resolvedPositionMethod}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={cn(
            'min-w-[var(--ui-popover-container-min-width)] max-w-[var(--ui-popover-container-max-width)] rounded-[var(--ui-popover-container-border-radius)] border-[length:var(--ui-popover-container-border-width)] border-solid border-[var(--ui-popover-container-border-color)] bg-[var(--ui-popover-container-color)] text-foreground outline-none',
            'duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-95 data-[closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    );

    return portal ? (
      <PopoverPrimitive.Portal
        container={resolvedContainer}
        keepMounted={keepMounted}
      >
        {positioner}
      </PopoverPrimitive.Portal>
    ) : (
      positioner
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

/**
 * Vertical-rhythm wrapper for a `PopoverContent`'s main content — the `Body`
 * slot in the Figma node. Themed from `--ui-popover-body-*` (gap, padding-y);
 * horizontal inset is a plain utility since the design has no dedicated
 * component token for it.
 */
const PopoverBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full flex-col gap-[var(--ui-popover-body-gap)] px-4 py-[var(--ui-popover-body-padding-y)]',
      className
    )}
    {...props}
  />
));
PopoverBody.displayName = 'PopoverBody';

/**
 * Default action-row footer — the `FooterDefault` (`variant=default`) recipe
 * from the Figma node. Themed from the shared `--ui-footer-*` tier.
 */
const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-[var(--ui-footer-global-height)] w-full shrink-0 items-center justify-end gap-[var(--ui-footer-global-gap)] border-t-[length:var(--ui-footer-default-border-width)] border-solid border-[var(--ui-footer-default-border-color)] bg-[var(--ui-footer-default-color)] px-[var(--ui-footer-global-padding-x)]',
      className
    )}
    {...props}
  />
));
PopoverFooter.displayName = 'PopoverFooter';

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
};
