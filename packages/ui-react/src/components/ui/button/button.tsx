import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { SparklesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Variants mirror the Figma "Button" component's `Variant` property (Primary,
// Secondary, Link→ghost, Destructive, Ai, Inverted). Each interaction state
// (idle / hover / active / disabled) wires background, label, and border to its
// own dedicated `--ui-button-*` token from @acronis-platform/tokens-pd. Every
// state is wired explicitly — even where acronis's value is unchanged — because
// these are runtime `var()` references: a brand override (e.g. brand-b's Primary
// changes its label/border per state) is only honored if the matching state
// token is referenced. Disabled uses the design's explicit disabled tokens (not
// opacity); the focus ring uses the `--ui-focus-*` tokens. The `ai` variant
// paints its gradient via `background-image` and sets `bg-origin-border` so it
// covers the (transparent) 1px border box — otherwise the gradient anchors to
// the padding box and repeats a 1px color sliver into the left/right border.
const buttonVariants = cva(
  'inline-flex min-w-16 items-center justify-center gap-2 whitespace-nowrap rounded border text-sm font-semibold leading-6 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--ui-button-primary-background-idle)] text-[var(--ui-button-primary-label-idle)] border-[var(--ui-button-primary-border-idle)] hover:bg-[var(--ui-button-primary-background-hover)] hover:text-[var(--ui-button-primary-label-hover)] hover:border-[var(--ui-button-primary-border-hover)] active:bg-[var(--ui-button-primary-background-active)] active:text-[var(--ui-button-primary-label-active)] active:border-[var(--ui-button-primary-border-active)] disabled:bg-[var(--ui-button-primary-background-disabled)] disabled:text-[var(--ui-button-primary-label-disabled)] disabled:border-[var(--ui-button-primary-border-disabled)]',
        secondary:
          'bg-[var(--ui-button-secondary-background-idle)] text-[var(--ui-button-secondary-label-idle)] border-[var(--ui-button-secondary-border-idle)] hover:bg-[var(--ui-button-secondary-background-hover)] hover:text-[var(--ui-button-secondary-label-hover)] hover:border-[var(--ui-button-secondary-border-hover)] active:bg-[var(--ui-button-secondary-background-active)] active:text-[var(--ui-button-secondary-label-active)] active:border-[var(--ui-button-secondary-border-active)] disabled:bg-[var(--ui-button-secondary-background-disabled)] disabled:text-[var(--ui-button-secondary-label-disabled)] disabled:border-[var(--ui-button-secondary-border-disabled)]',
        ghost:
          'bg-[var(--ui-button-ghost-background-idle)] text-[var(--ui-button-ghost-label-idle)] border-[var(--ui-button-ghost-border-idle)] hover:bg-[var(--ui-button-ghost-background-hover)] hover:text-[var(--ui-button-ghost-label-hover)] hover:border-[var(--ui-button-ghost-border-hover)] active:bg-[var(--ui-button-ghost-background-active)] active:text-[var(--ui-button-ghost-label-active)] active:border-[var(--ui-button-ghost-border-active)] disabled:bg-[var(--ui-button-ghost-background-disabled)] disabled:text-[var(--ui-button-ghost-label-disabled)] disabled:border-[var(--ui-button-ghost-border-disabled)]',
        destructive:
          'bg-[var(--ui-button-destructive-background-idle)] text-[var(--ui-button-destructive-label-idle)] border-[var(--ui-button-destructive-border-idle)] hover:bg-[var(--ui-button-destructive-background-hover)] hover:text-[var(--ui-button-destructive-label-hover)] hover:border-[var(--ui-button-destructive-border-hover)] active:bg-[var(--ui-button-destructive-background-active)] active:text-[var(--ui-button-destructive-label-active)] active:border-[var(--ui-button-destructive-border-active)] disabled:bg-[var(--ui-button-destructive-background-disabled)] disabled:text-[var(--ui-button-destructive-label-disabled)] disabled:border-[var(--ui-button-destructive-border-disabled)]',
        ai: 'bg-origin-border text-[var(--ui-button-ai-label-idle)] border-[var(--ui-button-ai-border-idle)] [background-image:var(--ui-background-ai-idle)] hover:text-[var(--ui-button-ai-label-hover)] hover:border-[var(--ui-button-ai-border-hover)] hover:[background-image:var(--ui-background-ai-hover)] active:text-[var(--ui-button-ai-label-active)] active:border-[var(--ui-button-ai-border-active)] active:[background-image:var(--ui-background-ai-active)] disabled:text-[var(--ui-button-ai-label-disabled)] disabled:border-[var(--ui-button-ai-border-disabled)] disabled:[background-image:var(--ui-background-ai-disabled)]',
        inverted:
          'bg-[var(--ui-button-inverted-background-idle)] text-[var(--ui-button-inverted-label-idle)] border-[var(--ui-button-inverted-border-idle)] hover:bg-[var(--ui-button-inverted-background-hover)] hover:text-[var(--ui-button-inverted-label-hover)] hover:border-[var(--ui-button-inverted-border-hover)] active:bg-[var(--ui-button-inverted-background-active)] active:text-[var(--ui-button-inverted-label-active)] active:border-[var(--ui-button-inverted-border-active)] disabled:bg-[var(--ui-button-inverted-background-disabled)] disabled:text-[var(--ui-button-inverted-label-disabled)] disabled:border-[var(--ui-button-inverted-border-disabled)]',
      },
      size: {
        // Default matches the Figma button: 32px tall, 12px x-padding, 8px gap.
        default: 'h-8 px-3',
        sm: 'h-7 px-2 py-0.5 text-xs',
        lg: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
  ({ className, variant, size, render, children, ...props }, ref) => {
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
          className: cn(buttonVariants({ variant, size, className })),
          children: content,
        },
        props
      ),
    });
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
