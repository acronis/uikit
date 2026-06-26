import * as React from 'react';

import { cn } from '@/lib/utils';

// Composable dashboard-widget empty-state parts, ported from
// `@acronis-platform/shadcn-uikit`'s `widget-placeholder`
// (packages/ui-legacy/src/components/ui/widget-placeholder.tsx). Plain styled
// elements — no Base UI primitive. No `--ui-widget-placeholder-*` tier exists
// yet, so this design-pending v1 themes from the shared semantic vocabulary:
//   • root      -> border-border + bg-background + text-foreground
//   • icon/action (was --av-fixed-link) -> text-secondary (the brand action blue)
//   • image (was --av-brand-light, a soft brand tint) -> text-muted-foreground
//     (a muted decorative placeholder; the brand tint is design-pending)
//   • interactive hover/active -> bg-accent (surface-hover) /
//     surface-active; focus -> the standard 3px --ui-focus-primary ring
// Reconcile with `/figma-component WidgetPlaceholder <url> --update` once a
// mockup lands (Figma: Charts-anatomy / Placeholders, node 229:73962).

export interface WidgetPlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Make the whole widget focusable and clickable (hover/active surface + focus
   * ring). Wire the behavior via `onClick`.
   */
  interactive?: boolean;
}

const WidgetPlaceholder = React.forwardRef<
  HTMLDivElement,
  WidgetPlaceholderProps
>(({ className, interactive, ...props }, ref) => (
  <div
    ref={ref}
    tabIndex={interactive ? 0 : undefined}
    className={cn(
      'relative flex flex-col rounded-lg border border-border bg-background text-foreground transition-colors',
      interactive &&
        'cursor-pointer hover:bg-accent active:bg-[var(--ui-background-surface-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  />
));
WidgetPlaceholder.displayName = 'WidgetPlaceholder';

const WidgetPlaceholderHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pb-2 pt-4', className)}
    {...props}
  />
));
WidgetPlaceholderHeader.displayName = 'WidgetPlaceholderHeader';

const WidgetPlaceholderTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetPlaceholderTitle.displayName = 'WidgetPlaceholderTitle';

const WidgetPlaceholderIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 text-secondary [&>svg]:size-4',
      className
    )}
    {...props}
  />
));
WidgetPlaceholderIcon.displayName = 'WidgetPlaceholderIcon';

const WidgetPlaceholderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-1 flex-col items-center justify-center gap-2 px-6 py-4 text-center',
      className
    )}
    {...props}
  />
));
WidgetPlaceholderContent.displayName = 'WidgetPlaceholderContent';

const WidgetPlaceholderImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-center text-muted-foreground [&>svg]:size-[72px]',
      className
    )}
    {...props}
  />
));
WidgetPlaceholderImage.displayName = 'WidgetPlaceholderImage';

const WidgetPlaceholderText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm leading-6', className)} {...props} />
));
WidgetPlaceholderText.displayName = 'WidgetPlaceholderText';

const WidgetPlaceholderAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'cursor-pointer text-sm font-semibold text-secondary hover:underline',
      className
    )}
    {...props}
  />
));
WidgetPlaceholderAction.displayName = 'WidgetPlaceholderAction';

const WidgetPlaceholderFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pb-4 pt-0 text-xs text-muted-foreground', className)}
    {...props}
  />
));
WidgetPlaceholderFooter.displayName = 'WidgetPlaceholderFooter';

export {
  WidgetPlaceholder,
  WidgetPlaceholderHeader,
  WidgetPlaceholderTitle,
  WidgetPlaceholderIcon,
  WidgetPlaceholderContent,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderAction,
  WidgetPlaceholderFooter,
};
