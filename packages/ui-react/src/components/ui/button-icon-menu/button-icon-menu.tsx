import * as React from 'react';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';
import type { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';
import { ButtonIcon } from '../button-icon';

// Mirrors the Figma "ButtonIconMenu" component set: the kebab ("more options")
// trigger — a 32×32 bordered icon button holding a fixed 16px Ellipsis glyph,
// with idle / hover / active / disabled / focus states. The design has a single
// `state` property (no variant/size axis) and draws every state from the
// **ButtonIcon** token tier (`components/ButtonIcon/*`), always with the
// `secondary` 1px container border — so this composes `ButtonIcon
// variant="secondary"` rather than restating those token references. A re-theme
// of ButtonIcon then reaches this component for free, and the two can't drift.
// Only the open treatment is added here: as in ButtonMenu, the Figma `active`
// state doubles as the **open** state, so `data-open` — set from the `open` prop
// — re-points the container fill, glyph, and border at their `*-active` tokens.
// Geometry (32px box, 4px radius, 16px glyph) and the 3px `--ui-focus-primary`
// ring flush to the edge come from ButtonIcon.
const openStateClasses =
  'data-[open]:bg-[var(--ui-button-icon-global-container-color-active)] data-[open]:text-[var(--ui-button-icon-global-icon-color-active)] data-[open]:border-[var(--ui-button-icon-secondary-container-border-color-active)]';

export interface ButtonIconMenuProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /**
   * Whether the associated menu is open. Applies the open (`*-active`)
   * treatment and reflects `aria-expanded`. Control this in sync with the menu
   * you trigger.
   */
  open?: boolean;
  /**
   * Accessible name for the trigger. The button is icon-only, so it has no text
   * to name it — pass a localized string here.
   */
  ariaLabel?: string;
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function —
   * the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * Icon-only button that opens a menu of actions — the kebab / "more options"
 * trigger. The glyph is fixed (Ellipsis); for any other icon use `ButtonIcon`.
 * Pair it with the menu it controls and keep the `open` prop in sync.
 */
const ButtonIconMenu = React.forwardRef<HTMLButtonElement, ButtonIconMenuProps>(
  ({ className, open, ariaLabel = 'More options', ...props }, ref) => (
    <ButtonIcon
      ref={ref}
      variant="secondary"
      aria-haspopup="menu"
      aria-label={ariaLabel}
      aria-expanded={open}
      className={cn(openStateClasses, className)}
      // `data-open` drives the open (`*-active`) token switch via attribute
      // selectors; present only while open, and typed loosely because React's
      // button attribute map doesn't include arbitrary data-* keys as literals.
      {...(open ? ({ 'data-open': '' } as Record<string, string>) : {})}
      {...props}
    >
      <EllipsisIcon size={16} />
    </ButtonIcon>
  )
);
ButtonIconMenu.displayName = 'ButtonIconMenu';

export { ButtonIconMenu };
