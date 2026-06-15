import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonIcon" component: a single-style, icon-only button
// (square 32px box, 16px glyph) with idle / hover / active / disabled states
// wired to the dedicated `--ui-button-icon-global-*` tokens. The container fill
// and the glyph color are each wired per state (runtime `var()` references, so
// brand overrides are honored); the default ButtonIcon is borderless (the
// next-gen tier only defines a border for the `secondary` treatment, not yet
// surfaced as a variant here). Box geometry — 32px height, 4px radius, 16px icon
// — comes from the `global-container-*` / `global-icon-size` tokens. Like Button,
// disabled uses the design's explicit disabled tokens (not opacity) and the focus
// ring uses `--ui-focus-*`.
const buttonIconClasses =
  'inline-flex size-[var(--ui-button-icon-global-container-height)] shrink-0 items-center justify-center rounded-[var(--ui-button-icon-global-container-border-radius)] border border-transparent transition-colors ' +
  'bg-[var(--ui-button-icon-global-container-idle)] text-[var(--ui-button-icon-global-icon-idle)] ' +
  'hover:bg-[var(--ui-button-icon-global-container-hover)] hover:text-[var(--ui-button-icon-global-icon-hover)] ' +
  'active:bg-[var(--ui-button-icon-global-container-active)] active:text-[var(--ui-button-icon-global-icon-active)] ' +
  'disabled:pointer-events-none disabled:bg-[var(--ui-button-icon-global-container-disabled)] disabled:text-[var(--ui-button-icon-global-icon-disabled)] ' +
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-brand)] focus-visible:ring-offset-2 ' +
  '[&_svg]:pointer-events-none [&_svg]:size-[var(--ui-button-icon-global-icon-size)] [&_svg]:shrink-0';

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
