import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { SparklesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Variants mirror the Figma "Button" component's `Variant` property (Primary,
// Secondary, Link→ghost, Destructive, Ai, Inverted). Each interaction state
// (idle / hover / active / disabled) wires the container fill, label, icon, and
// — for the variants that have one — the border to its own dedicated
// `--ui-button-*` token from @acronis-platform/tokens-pd. Every state is wired
// explicitly — even where acronis's value is unchanged — because these are
// runtime `var()` references: a brand override is only honored if the matching
// state token is referenced. The icon color is wired separately from the label
// because the next-gen tier diverges the two on hover/active for `secondary` and
// `ghost` (the icon keeps the brighter blue while the label darkens). Disabled
// uses the design's explicit disabled tokens (not opacity); the focus ring uses
// the `--ui-focus-*` tokens.
//
// Geometry is now tokenized: the shared box metrics (32px height, 8px gap, 4px
// radius, 16px icon) come from `--ui-button-global-container-*` / `-icon-size`,
// while padding-x and min-width are per-variant — `ghost` has 0 padding-x and no
// min-width (it reads as an inline link), every other variant has 12px / 64px.
// Only `secondary` and `inverted` define a container border (1px); the rest paint
// a transparent border so the box geometry stays identical across variants. The
// `ai` variant paints its gradient container via `background-image` and sets
// `bg-origin-border` so it covers the (transparent) 1px border box.
const buttonVariants = cva(
  'inline-flex h-[var(--ui-button-global-container-height)] items-center justify-center gap-[var(--ui-button-global-container-gap)] whitespace-nowrap rounded-[var(--ui-button-global-container-border-radius)] border border-transparent text-sm font-semibold leading-6 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-[var(--ui-button-global-icon-size)] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'min-w-[var(--ui-button-primary-container-width-min)] px-[var(--ui-button-primary-container-padding-x)] bg-[var(--ui-button-primary-container-color-idle)] text-[var(--ui-button-primary-label-color-idle)] [&_svg]:text-[var(--ui-button-primary-icon-color-idle)] hover:bg-[var(--ui-button-primary-container-color-hover)] hover:text-[var(--ui-button-primary-label-color-hover)] hover:[&_svg]:text-[var(--ui-button-primary-icon-color-hover)] active:bg-[var(--ui-button-primary-container-color-active)] active:text-[var(--ui-button-primary-label-color-active)] active:[&_svg]:text-[var(--ui-button-primary-icon-color-active)] disabled:bg-[var(--ui-button-primary-container-color-disabled)] disabled:text-[var(--ui-button-primary-label-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-primary-icon-color-disabled)]',
        secondary:
          'min-w-[var(--ui-button-secondary-container-width-min)] px-[var(--ui-button-secondary-container-padding-x)] bg-[var(--ui-button-secondary-container-color-idle)] text-[var(--ui-button-secondary-label-color-idle)] border-[var(--ui-button-secondary-container-border-color-idle)] [&_svg]:text-[var(--ui-button-secondary-icon-color-idle)] hover:bg-[var(--ui-button-secondary-container-color-hover)] hover:text-[var(--ui-button-secondary-label-color-hover)] hover:border-[var(--ui-button-secondary-container-border-color-hover)] hover:[&_svg]:text-[var(--ui-button-secondary-icon-color-hover)] active:bg-[var(--ui-button-secondary-container-color-active)] active:text-[var(--ui-button-secondary-label-color-active)] active:border-[var(--ui-button-secondary-container-border-color-active)] active:[&_svg]:text-[var(--ui-button-secondary-icon-color-active)] disabled:bg-[var(--ui-button-secondary-container-color-disabled)] disabled:text-[var(--ui-button-secondary-label-color-disabled)] disabled:border-[var(--ui-button-secondary-container-border-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-secondary-icon-color-disabled)]',
        ghost:
          'px-[var(--ui-button-ghost-container-padding-x)] text-[var(--ui-button-ghost-label-color-idle)] [&_svg]:text-[var(--ui-button-ghost-icon-color-idle)] hover:text-[var(--ui-button-ghost-label-color-hover)] hover:[&_svg]:text-[var(--ui-button-ghost-icon-color-hover)] active:text-[var(--ui-button-ghost-label-color-active)] active:[&_svg]:text-[var(--ui-button-ghost-icon-color-active)] disabled:text-[var(--ui-button-ghost-label-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-ghost-icon-color-disabled)]',
        destructive:
          'min-w-[var(--ui-button-destructive-container-width-min)] px-[var(--ui-button-destructive-container-padding-x)] bg-[var(--ui-button-destructive-container-color-idle)] text-[var(--ui-button-destructive-label-color-idle)] [&_svg]:text-[var(--ui-button-destructive-icon-color-idle)] hover:bg-[var(--ui-button-destructive-container-color-hover)] hover:text-[var(--ui-button-destructive-label-color-hover)] hover:[&_svg]:text-[var(--ui-button-destructive-icon-color-hover)] active:bg-[var(--ui-button-destructive-container-color-active)] active:text-[var(--ui-button-destructive-label-color-active)] active:[&_svg]:text-[var(--ui-button-destructive-icon-color-active)] disabled:bg-[var(--ui-button-destructive-container-color-disabled)] disabled:text-[var(--ui-button-destructive-label-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-destructive-icon-color-disabled)]',
        ai: 'min-w-[var(--ui-button-ai-container-width-min)] px-[var(--ui-button-ai-container-padding-x)] bg-origin-border text-[var(--ui-button-ai-label-color-idle)] [&_svg]:text-[var(--ui-button-ai-icon-color-idle)] [background-image:var(--ui-button-ai-container-color-idle)] hover:text-[var(--ui-button-ai-label-color-hover)] hover:[&_svg]:text-[var(--ui-button-ai-icon-color-hover)] hover:[background-image:var(--ui-button-ai-container-color-hover)] active:text-[var(--ui-button-ai-label-color-active)] active:[&_svg]:text-[var(--ui-button-ai-icon-color-active)] active:[background-image:var(--ui-button-ai-container-color-active)] disabled:text-[var(--ui-button-ai-label-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-ai-icon-color-disabled)] disabled:[background-image:var(--ui-button-ai-container-color-disabled)]',
        inverted:
          'min-w-[var(--ui-button-inverted-container-width-min)] px-[var(--ui-button-inverted-container-padding-x)] bg-[var(--ui-button-inverted-container-color-idle)] text-[var(--ui-button-inverted-label-color-idle)] border-[var(--ui-button-inverted-container-border-color-idle)] [&_svg]:text-[var(--ui-button-inverted-icon-color-idle)] hover:bg-[var(--ui-button-inverted-container-color-hover)] hover:text-[var(--ui-button-inverted-label-color-hover)] hover:border-[var(--ui-button-inverted-container-border-color-hover)] hover:[&_svg]:text-[var(--ui-button-inverted-icon-color-hover)] active:bg-[var(--ui-button-inverted-container-color-active)] active:text-[var(--ui-button-inverted-label-color-active)] active:border-[var(--ui-button-inverted-container-border-color-active)] active:[&_svg]:text-[var(--ui-button-inverted-icon-color-active)] disabled:bg-[var(--ui-button-inverted-container-color-disabled)] disabled:text-[var(--ui-button-inverted-label-color-disabled)] disabled:border-[var(--ui-button-inverted-container-border-color-disabled)] disabled:[&_svg]:text-[var(--ui-button-inverted-icon-color-disabled)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function —
   * the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, render, children, ...props }, ref) => {
    // The AI variant always leads with the Sparkles icon before its label
    // (the Figma "Ai" button is a Sparkles instance + label).
    const content =
      variant === 'ai' ? (
        <>
          <SparklesIcon />
          {children}
        </>
      ) : (
        children
      );
    return useRender({
      render,
      ref,
      defaultTagName: 'button',
      props: mergeProps<'button'>(
        {
          className: cn(buttonVariants({ variant, className })),
          children: content,
        },
        props
      ),
    });
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
