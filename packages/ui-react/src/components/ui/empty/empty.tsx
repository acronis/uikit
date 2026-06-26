import * as React from 'react';

import { cn } from '@/lib/utils';

// Composable empty-state parts ported from `@acronis-platform/shadcn-uikit`'s
// `empty` (packages/ui-legacy/src/components/ui/empty.tsx). Plain styled
// elements — no Base UI primitive. No `--ui-empty-*` token tier exists yet, so
// this design-pending v1 themes from the shared semantic text tokens:
//   • title       -> text-foreground (--ui-text-on-surface-primary)
//   • description / icon -> text-muted-foreground (--ui-text-on-surface-secondary)
// (Legacy used a single `--empty-foreground` for the whole block; this splits it
// into an emphasized title over muted supporting content.) The legacy
// `--empty-icon-size` (72px) becomes a fixed size. Reconcile with
// `/figma-component Empty <url> --update` once a mockup lands.

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full max-w-[448px] flex-col items-center justify-center text-center text-muted-foreground',
      className
    )}
    {...props}
  />
));
Empty.displayName = 'Empty';

const EmptyIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mb-4 flex size-[72px] items-center justify-center [&_svg]:size-full',
      className
    )}
    {...props}
  />
));
EmptyIcon.displayName = 'EmptyIcon';

const EmptyHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full flex-col items-center gap-2 text-center',
      className
    )}
    {...props}
  />
));
EmptyHeader.displayName = 'EmptyHeader';

const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-normal leading-6 text-foreground', className)}
    {...props}
  />
));
EmptyTitle.displayName = 'EmptyTitle';

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm leading-6', className)} {...props} />
));
EmptyDescription.displayName = 'EmptyDescription';

const EmptyActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 flex flex-col items-center gap-4', className)}
    {...props}
  />
));
EmptyActions.displayName = 'EmptyActions';

const EmptyLinks = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col items-center gap-2', className)}
    {...props}
  />
));
EmptyLinks.displayName = 'EmptyLinks';

export {
  Empty,
  EmptyIcon,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  EmptyLinks,
};
