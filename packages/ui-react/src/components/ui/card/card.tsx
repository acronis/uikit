import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

// Initial version ported from `@acronis-platform/shadcn-uikit`'s `card`
// (packages/ui-legacy/src/components/ui/card.tsx). No "ready for dev" Figma node
// exists yet, so this is a design-pending v1: there is no `--ui-card-*` token
// tier, so the surface/text/border colors resolve to the shared **semantic**
// tokens via the bridged Tailwind names in `src/styles/index.css`:
//   • bg-background    → --ui-background-surface-primary   (legacy `bg-card`)
//   • text-foreground  → --ui-text-on-surface-primary      (legacy `text-card-foreground`)
//   • border-border    → --ui-border-on-surface-border      (legacy bare `border`)
//   • text-muted-foreground → --ui-text-on-surface-secondary (description)
// Geometry (radius, padding, gaps, shadow) is carried over verbatim from legacy.
// Reconcile against the real design with `/figma-component Card <url> --update`
// once a mockup lands — at which point an elevated-surface token may replace the
// primary surface used for the card background.

interface CardPartProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. render `CardTitle` as a heading. The component's props
   * and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

const Card = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            'rounded-lg border border-border bg-background text-foreground shadow-xs',
            className
          ),
        },
        props
      ),
    })
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: cn('flex flex-col space-y-1.5 p-6', className) },
        props
      ),
    })
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            'text-2xl font-semibold leading-none tracking-tight',
            className
          ),
        },
        props
      ),
    })
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: cn('text-sm text-muted-foreground', className) },
        props
      ),
    })
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>({ className: cn('p-6 pt-0', className) }, props),
    })
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardPartProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        { className: cn('flex items-center p-6 pt-0', className) },
        props
      ),
    })
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  type CardPartProps,
};
