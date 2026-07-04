import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonIcon" component: a single-style, icon-only button
// (32x32, 16px glyph) with idle / hover / active / disabled states wired to the
// dedicated `--ui-button-icon-*` tokens. Background, glyph, and border are each
// wired per state (runtime `var()` references, so brand overrides are honored).
// Like Button, disabled uses the design's explicit disabled tokens (not opacity)
// and the focus ring uses `--ui-focus-*`.
const buttonIconClasses =
  'inline-flex size-8 shrink-0 items-center justify-center rounded border transition-colors ' +
  'bg-[var(--ui-button-icon-background-idle)] text-[var(--ui-button-icon-icon-idle)] border-[var(--ui-button-icon-border-idle)] ' +
  'hover:bg-[var(--ui-button-icon-background-hover)] hover:text-[var(--ui-button-icon-icon-hover)] hover:border-[var(--ui-button-icon-border-hover)] ' +
  'active:bg-[var(--ui-button-icon-background-active)] active:text-[var(--ui-button-icon-icon-active)] active:border-[var(--ui-button-icon-border-active)] ' +
  'disabled:pointer-events-none disabled:bg-[var(--ui-button-icon-background-disabled)] disabled:text-[var(--ui-button-icon-icon-disabled)] disabled:border-[var(--ui-button-icon-border-disabled)] ' +
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-offset-2 ' +
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export interface ButtonIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  ({ className, render, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'button',
      props: mergeProps<'button'>(
        { className: cn(buttonIconClasses, className) },
        props
      ),
    });
  }
);
ButtonIcon.displayName = 'ButtonIcon';

export { ButtonIcon };
