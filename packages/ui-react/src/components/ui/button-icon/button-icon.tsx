import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonIcon" component set: an icon-only button (square 32px
// box, 16px glyph) with a `variant` property (`ghost` / `secondary`) and idle /
// hover / active / disabled states. The container fill and the glyph color are
// shared across both variants and come from the `--ui-button-icon-global-*`
// tokens; `secondary` additionally paints a 1px container border from the
// `--ui-button-icon-secondary-container-border-color-*` tokens, while `ghost`
// leaves the (transparent) border so the box geometry stays identical across
// variants. Each interaction state is wired to its own token (runtime `var()`
// references, so brand overrides are honored). Box geometry — 32px height, 4px
// radius, 16px icon — comes from the `global-container-*` / `global-icon-size`
// tokens. Like Button, disabled uses the design's explicit disabled tokens (not
// opacity) and the focus ring uses `--ui-focus-*`.
const buttonIconVariants = cva(
  'inline-flex size-[var(--ui-button-icon-global-container-height)] shrink-0 items-center justify-center rounded-[var(--ui-button-icon-global-container-border-radius)] border border-transparent transition-colors ' +
    'bg-[var(--ui-button-icon-global-container-color-idle)] text-[var(--ui-button-icon-global-icon-color-idle)] ' +
    'hover:bg-[var(--ui-button-icon-global-container-color-hover)] hover:text-[var(--ui-button-icon-global-icon-color-hover)] ' +
    'active:bg-[var(--ui-button-icon-global-container-color-active)] active:text-[var(--ui-button-icon-global-icon-color-active)] ' +
    'disabled:pointer-events-none disabled:bg-[var(--ui-button-icon-global-container-color-disabled)] disabled:text-[var(--ui-button-icon-global-icon-color-disabled)] ' +
    'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-offset-2 ' +
    '[&_svg]:pointer-events-none [&_svg]:size-[var(--ui-button-icon-global-icon-size)] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        ghost: '',
        secondary:
          'border-[var(--ui-button-icon-secondary-container-border-color-idle)] hover:border-[var(--ui-button-icon-secondary-container-border-color-hover)] active:border-[var(--ui-button-icon-secondary-container-border-color-active)] disabled:border-[var(--ui-button-icon-secondary-container-border-color-disabled)]',
      },
    },
    defaultVariants: {
      variant: 'ghost',
    },
  }
);

export interface ButtonIconProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonIconVariants> {
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function —
   * the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * Icon-only button. The icon is passed as `children`; provide an `aria-label`
 * (or `aria-labelledby`) so the control has an accessible name.
 */
const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ className, variant, render, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'button',
      props: mergeProps<'button'>(
        { className: cn(buttonIconVariants({ variant, className })) },
        props
      ),
    });
  }
);
ButtonIcon.displayName = 'ButtonIcon';

export { ButtonIcon, buttonIconVariants };
