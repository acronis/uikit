import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonIconInput" component set: a smaller icon-only
// button (20px box, 16px glyph) meant to live inside an input's box (e.g. the
// clear/reveal affordance), as opposed to `ButtonIcon`'s standalone 32px/24px
// sizing. `variant` (`normal` / `error`) picks the field's tone — `error`
// mirrors the input's error-state red — and each interaction state
// (idle/hover/active) is wired to its own `--ui-button-icon-input-*` token per
// variant (they use distinct tokens, not a shared `global` tier like
// `ButtonIcon`). The Figma set has no `disabled` variant for `error` (only
// `normal` does), so disabled always uses the `normal` disabled tokens
// regardless of `variant` — there's no dead-token fallback here, just the one
// disabled treatment the design actually defines. Focus is a 3px ring —
// `--ui-focus-primary` for `normal`, `--ui-focus-error` for `error` —
// matching the field it sits in.
const buttonIconInputVariants = cva(
  'inline-flex size-[var(--ui-button-icon-input-global-container-width)] shrink-0 items-center justify-center rounded-[var(--ui-button-icon-input-global-container-border-radius)] outline-none transition-colors cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--ui-button-icon-input-normal-container-color-disabled)] disabled:text-[var(--ui-button-icon-input-normal-icon-color-disabled)] focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        normal:
          'bg-[var(--ui-button-icon-input-normal-container-color-idle)] text-[var(--ui-button-icon-input-normal-icon-color-idle)] hover:bg-[var(--ui-button-icon-input-normal-container-color-hover)] hover:text-[var(--ui-button-icon-input-normal-icon-color-hover)] active:bg-[var(--ui-button-icon-input-normal-container-color-active)] active:text-[var(--ui-button-icon-input-normal-icon-color-active)] focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-[var(--ui-button-icon-input-normal-icon-size)]',
        error:
          'bg-[var(--ui-button-icon-input-error-container-color-idle)] text-[var(--ui-button-icon-input-error-icon-color-idle)] hover:bg-[var(--ui-button-icon-input-error-container-color-hover)] hover:text-[var(--ui-button-icon-input-error-icon-color-hover)] active:bg-[var(--ui-button-icon-input-error-container-color-active)] active:text-[var(--ui-button-icon-input-error-icon-color-active)] focus-visible:ring-[var(--ui-focus-error)] [&_svg]:size-[var(--ui-button-icon-input-error-icon-size)]',
      },
    },
    defaultVariants: {
      variant: 'normal',
    },
  }
);

export interface ButtonIconInputProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonIconInputVariants> {
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function —
   * the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * Small icon-only button meant to sit inside an input's box. The icon is
 * passed as `children`; provide an `aria-label` (or `aria-labelledby`) so the
 * control has an accessible name.
 */
const ButtonIconInput = React.forwardRef<
  HTMLButtonElement,
  ButtonIconInputProps
>(({ className, variant, render, ...props }, ref) => {
  return useRender({
    render,
    ref,
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type: 'button',
        className: cn(buttonIconInputVariants({ variant, className })),
      },
      props
    ),
  });
});
ButtonIconInput.displayName = 'ButtonIconInput';

export { ButtonIconInput, buttonIconInputVariants };
