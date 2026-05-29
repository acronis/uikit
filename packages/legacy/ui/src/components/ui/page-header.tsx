import * as React from 'react'

import { cn } from '@/lib/utils'

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="banner"
    className={cn('flex flex-col gap-1 pb-4', className)}
    {...props}
  />
))
PageHeader.displayName = 'PageHeader'

const PageHeaderBreadcrumb = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="Breadcrumb"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
PageHeaderBreadcrumb.displayName = 'PageHeaderBreadcrumb'

const PageHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('text-2xl font-bold leading-none tracking-tight', className)}
    {...props}
  />
))
PageHeaderTitle.displayName = 'PageHeaderTitle'

const PageHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
PageHeaderDescription.displayName = 'PageHeaderDescription'

const PageHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 pt-2', className)}
    {...props}
  />
))
PageHeaderActions.displayName = 'PageHeaderActions'

export {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
}