import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonMenu" component: a Button-like trigger (label +
// trailing chevron) that opens a menu. `variant` maps to the Figma `variant`
// property (Primary / Secondary); the Figma `active` state is the **open** state
// — the chevron flips down→up and the container takes its `*-active` colors. Each
// interaction state wires the container fill, label, icon, and — for `secondary`
// — the border to its own dedicated `--ui-button-menu-*` token from
// @acronis-platform/tokens-pd. Every state is referenced explicitly (runtime
// `var()` lookups: a brand override is only honored if the matching state token is
// referenced). `primary` keeps a single label/icon color across states; only
// `secondary` diverges them per state. Geometry — 32px height, 8px gap, 12px
// padding-x, 4px radius, 64px min-width, 16px icon — comes from the
// `--ui-button-menu-global-*` tokens. The open treatment is driven by the
// `data-open` attribute (set from the `open` prop) and CSS `:active` for press
// feedback; disabled uses the explicit disabled tokens (not opacity). Focus: the
// Figma focus state is a 3px `--ui-focus-primary` ring flush to the button edge
// (no offset) — `ring-[3px]`, no `ring-offset`.
const buttonMenuVariants = cva(
  'inline-flex h-[var(--ui-button-menu-global-container-height)] min-w-[var(--ui-button-menu-global-container-width-min)] items-center justify-center gap-[var(--ui-button-menu-global-container-gap)] whitespace-nowrap rounded-[var(--ui-button-menu-global-container-border-radius)] border border-transparent px-[var(--ui-button-menu-global-container-padding-x)] text-sm font-semibold leading-6 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-[var(--ui-button-menu-global-icon-size)] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--ui-button-menu-primary-container-color-idle)] text-[var(--ui-button-menu-primary-label-color)] [&_svg]:text-[var(--ui-button-menu-primary-icon-color)] hover:bg-[var(--ui-button-menu-primary-container-color-hover)] active:bg-[var(--ui-button-menu-primary-container-color-active)] data-[open]:bg-[var(--ui-button-menu-primary-container-color-active)] disabled:bg-[var(--ui-button-menu-primary-container-color-disabled)]',
        secondary:
          'bg-[var(--ui-button-menu-secondary-container-color-idle)] text-[var(--ui-button-menu-secondary-label-color-idle)] border-[var(--ui-button-menu-secondary-container-border-color-idle)] [&_svg]:text-[var(--ui-button-menu-secondary-icon-color-idle)] hover:bg-[var(--ui-button-menu-secondary-container-color-hover)] hover:text-[var(--ui-button-menu-secondary-label-color-hover)] hover:border-[var(--ui-button-menu-secondary-container-border-color-hover)] hover:[&_svg]:text-[var(--ui-button-menu-secondary-icon-color-hover)] active:bg-[var(--ui-button-menu-secondary-container-color-active)] active:text-[var(--ui-button-menu-secondary-label-color-active)] active:border-[var(--ui-button-menu-secondary-container-border-color-active)] active:[&_svg]:text-[var(--ui-button-menu-secondary-icon-color-active)] data-[open]:bg-[var(--ui-button-menu-secondary-container-color-active)] data-[open]:text-[var(--ui-button-menu-secondary-label-color-active)] data-[open]:border-[var(--ui-button-menu-secondary-container-border-color-active)] data-[open]:[&_svg]:text-[var(--ui-button-menu-secondary-icon-color-active)] disabled:bg-[var(--ui-button-menu-secondary-container-color-disabled)] disabled:text-[var(--ui-button-menu-secondary-label-color-disabled)] disabled:border-[var(--ui-button-menu-secondary-container-border-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-menu-secondary-icon-color-disabled)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonMenuProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonMenuVariants> {
  /**
   * Whether the associated menu is open. Flips the trailing chevron
   * (down → up), applies the open (`*-active`) treatment, and reflects
   * `aria-expanded`. Control this in sync with the menu you trigger.
   */
  open?: boolean;
  /** Label content rendered before the chevron. */
  children?: React.ReactNode;
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function —
   * the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * A button that opens a dropdown menu: a label followed by a chevron that
 * points up while `open`. Pair it with the menu/popover it controls and keep
 * the `open` prop in sync.
 */
const ButtonMenu = React.forwardRef<HTMLButtonElement, ButtonMenuProps>(
  ({ className, variant, open, render, children, ...props }, ref) => {
    const Chevron = open ? ChevronUpIcon : ChevronDownIcon;
    return useRender({
      render,
      ref,
      defaultTagName: 'button',
      props: mergeProps<'button'>(
        {
          className: cn(buttonMenuVariants({ variant, className })),
          'aria-expanded': open,
          // `data-open` drives the open (`*-active`) token switch via attribute
          // selectors; present only while open, and typed loosely because
          // React's button attribute map doesn't include arbitrary data-* keys
          // as literals.
          ...(open ? ({ 'data-open': '' } as Record<string, string>) : {}),
          children: (
            <>
              {children}
              <Chevron />
            </>
          ),
        },
        props
      ),
    });
  }
);
ButtonMenu.displayName = 'ButtonMenu';

export { ButtonMenu, buttonMenuVariants };
