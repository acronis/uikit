import * as React from 'react';
import {
  Toolbar as ToolbarPrimitive,
  type ToolbarButtonProps,
  type ToolbarRootProps,
} from '@base-ui/react/toolbar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonGroup" component set (node 7975:3479) and its
// "ButtonGroupItem" children (node 5558:17506): a compact cluster of icon-only
// actions sharing one box, hairline-separated. The container's `variant`
// (`outlined` / `inlined`) is the Figma variant property of the same name —
// `outlined` draws the 1px container border + 4px radius, `inlined` draws
// neither (for use inside a surface that already has its own chrome).
//
// Figma models the items' position as an `order` variant (first / middle /
// last), which only ever controls whether the trailing separator is drawn.
// That's derivable from the DOM, so it is NOT a prop here — `last:border-e-0`
// drops the separator on the final item, which keeps the group variadic
// (Figma's `ListItem` slot) instead of forcing callers to label positions.
//
// Built on Base UI's Toolbar so the cluster gets the WAI-ARIA toolbar pattern
// for free: `role="toolbar"`, a single Tab stop, and arrow-key roving tabindex
// between the items. Base UI's `Toolbar.Root` doesn't forward
// `enableHomeAndEndKeys` to its composite, so Home/End are unsupported — a Base
// UI limitation, same as in `toolbar.tsx`.
const buttonGroupVariants = cva(
  // `overflow-hidden` is load-bearing, not cosmetic: it clips the first/last
  // item's hover/active fill and its inset focus ring to the container's own
  // radius. Without it the square item corners poke out past the rounded box.
  'inline-flex w-fit items-center overflow-hidden',
  {
    variants: {
      variant: {
        outlined:
          'rounded-[var(--ui-button-group-global-container-border-radius)] border-[length:var(--ui-button-group-global-container-border-width)] border-solid border-[color:var(--ui-button-group-global-container-border-color)]',
        inlined: '',
      },
    },
    defaultVariants: {
      variant: 'outlined',
    },
  }
);

// The focus ring is `ring-inset`: an outer ring would be clipped away by the
// container's `overflow-hidden`. An inset box-shadow is clipped to the padding
// edge, so the ring stops short of the 1px separator instead of painting over
// it — which is exactly the 1px inset Figma's FocusRing layer draws by hand.
//
// Disabled is keyed off `data-[disabled]` rather than `:disabled` because the
// item is never natively disabled (see `focusableWhenDisabled` below) — Base UI
// exposes the state as `aria-disabled` + `data-disabled`, for a disabled item
// and a disabled *group* alike. The design has no disabled state for this
// component, so the glyph falls back to the shared
// `--ui-glyph-on-surface-disabled` semantic token.
const buttonGroupItemVariants = cva(
  'inline-flex h-[var(--ui-button-group-global-box-height)] shrink-0 cursor-pointer items-center justify-center px-[var(--ui-button-group-global-box-padding-x)] py-[var(--ui-button-group-global-box-padding-y)] transition-colors ' +
    'bg-[var(--ui-button-group-global-box-color-idle)] text-[var(--ui-glyph-on-surface-primary)] ' +
    'border-solid border-[color:var(--ui-button-group-global-separator-color)] ' +
    'hover:bg-[var(--ui-button-group-global-box-color-hover)] active:bg-[var(--ui-button-group-global-box-color-active)] ' +
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--ui-focus-primary)] ' +
    'data-[disabled]:pointer-events-none data-[disabled]:bg-[var(--ui-button-group-global-box-color-idle)] data-[disabled]:text-[var(--ui-glyph-on-surface-disabled)] ' +
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
);

const SEPARATOR_WIDTH =
  'border-e-[length:var(--ui-button-group-global-separator-border-width)]';

// The separator is the item's own inline-end border, mirroring how Figma hangs
// it off `ButtonGroupItem` rather than the container. `border-e-*` (not
// `border-r-*`) so it flips under `dir="rtl"`.
//
// By default the trailing separator is dropped via `:last-child`, which keeps
// the group variadic (Figma's `ListItem` slot) instead of making callers restate
// their own ordering. That derivation is resolved against the button's *real*
// parent, though, so interposing a wrapper around each item would make every
// button a `:last-child` and erase every separator. `order` is the escape hatch
// for those compositions: given explicitly, it replaces the derivation outright
// rather than layering on top of it — no `:last-child` rule is emitted at all,
// so there is no specificity fight to reason about.
function separatorClass(order: ButtonGroupItemOrder | undefined): string {
  if (order === undefined) return `${SEPARATOR_WIDTH} last:border-e-0`;
  return order === 'last' ? '' : SEPARATOR_WIDTH;
}

export interface ButtonGroupProps
  // Base UI types `className` as `string | ((state) => string)`, but the value
  // is merged through `cn()` here, which can't call a function — narrow it.
  // `orientation` is omitted because the design is horizontal-only: a vertical
  // group would need the separator on the block axis and different corner
  // rounding, neither of which Figma specifies.
  extends Omit<ToolbarRootProps, 'className' | 'orientation'>,
    VariantProps<typeof buttonGroupVariants> {
  className?: string;
}

/**
 * A cluster of related icon-only actions sharing a single bordered box.
 *
 * Renders a `role="toolbar"` container: the group is one Tab stop and the
 * arrow keys move between items. Give it an accessible name (`aria-label` or
 * `aria-labelledby`) describing what the actions have in common.
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant, ...props }, ref) => (
    <ToolbarPrimitive.Root
      ref={ref}
      className={cn(buttonGroupVariants({ variant, className }))}
      {...props}
    />
  )
);
ButtonGroup.displayName = 'ButtonGroup';

/** Mirrors the Figma `ButtonGroupItem` `order` variant. */
export type ButtonGroupItemOrder = 'first' | 'middle' | 'last';

export interface ButtonGroupItemProps
  extends Omit<ToolbarButtonProps, 'className'> {
  className?: string;
  /**
   * Position within the group, mirroring the Figma `order` variant. Controls
   * one thing: whether the trailing separator is drawn (`last` omits it).
   *
   * Leave it unset — position is derived from the DOM. Only pass it when each
   * item is wrapped in another element, which defeats that derivation.
   */
  order?: ButtonGroupItemOrder;
}

/**
 * A single action inside a `ButtonGroup`. The icon is passed as `children`;
 * provide an `aria-label` (or `aria-labelledby`) so the control has an
 * accessible name.
 */
const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(({ className, order, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    // `focusableWhenDisabled` is deliberately left at Base UI's default
    // (`true`), so a disabled item is `aria-disabled` rather than natively
    // disabled. Forcing the native attribute instead — to match how every other
    // disabled control in this library drops out of the tab order — breaks the
    // group outright when the FIRST item is disabled: the composite still parks
    // its single `tabIndex=0` on index 0, but the browser skips a natively
    // disabled button, so every item ends up unreachable and Tab never enters
    // the group at all. `Toolbar.Root` exposes no way to relocate that initial
    // tab stop, so the APG behaviour is the only correct option here. The item
    // is still inert: Base UI suppresses click and Enter/Space activation.
    className={cn(
      buttonGroupItemVariants({ className: separatorClass(order) }),
      className
    )}
    {...props}
  />
));
ButtonGroupItem.displayName = 'ButtonGroupItem';

export {
  ButtonGroup,
  ButtonGroupItem,
  buttonGroupVariants,
  buttonGroupItemVariants,
};
