import * as React from 'react';

import { cn } from '@/lib/utils';

// The page header region from the Figma (shadcn-uikit node 2850-701): an optional
// breadcrumb, a title row (title left, actions right), and an optional description.
// Ported from `@acronis-platform`'s `page-header` and reconciled with the Figma —
// the title is a moderate page title (not the legacy 2xl). Markup-only; the only
// color is the muted breadcrumb/description (text-muted-foreground →
// --ui-text-on-surface-secondary).

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header"
    role="banner"
    className={cn('flex flex-col gap-2 pb-4', className)}
    {...props}
  />
));
PageHeader.displayName = 'PageHeader';

const PageHeaderBreadcrumb = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    data-slot="page-header-breadcrumb"
    aria-label="Breadcrumb"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
PageHeaderBreadcrumb.displayName = 'PageHeaderBreadcrumb';

// The title + actions row: title on the left, actions pushed to the right.
const PageHeaderRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-row"
    className={cn('flex items-center justify-between gap-4', className)}
    {...props}
  />
));
PageHeaderRow.displayName = 'PageHeaderRow';

const PageHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    data-slot="page-header-title"
    className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
    {...props}
  />
));
PageHeaderTitle.displayName = 'PageHeaderTitle';

const PageHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="page-header-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
PageHeaderDescription.displayName = 'PageHeaderDescription';

const PageHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-actions"
    className={cn('flex shrink-0 items-center gap-2', className)}
    {...props}
  />
));
PageHeaderActions.displayName = 'PageHeaderActions';

export {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderRow,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
};
