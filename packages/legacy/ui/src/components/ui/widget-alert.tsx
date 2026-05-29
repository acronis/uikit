import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * WidgetAlert — Dashboard alert notification widget.
 * Figma: Charts-anatomy / Alert-Widget (node 201:65481)
 *
 * Variants: info, success, warning, danger
 * Sizes: compact (112px), default (176px), expanded (with description + actions)
 * States: hover, active, focus
 *
 * Anatomy:
 * - WidgetAlert (root)
 *   - WidgetAlertIcon (left icon, 16x16)
 *   - WidgetAlertContent
 *     - WidgetAlertTitle (semibold, 14px)
 *     - WidgetAlertDate (regular, 14px)
 *     - WidgetAlertDescription (regular, 14px)
 *   - WidgetAlertActions (right side, more icon)
 *
 * Spacing: 24px horizontal padding, 16px vertical padding, 8px gap between title and description
 * Colors per variant:
 *   info: bg=fixed-info-accent, border=fixed-info
 *   success: bg=fixed-success-accent, border=fixed-success
 *   warning: bg=fixed-warning-accent, border=fixed-warning
 *   danger: bg=fixed-danger-accent, border=fixed-danger
 */

const widgetAlertVariants = cva(
  'relative flex items-start rounded-lg border transition-colors',
  {
    variants: {
      variant: {
        info: 'bg-[var(--av-fixed-info-accent)] border-[var(--av-fixed-info)]',
        success: 'bg-[var(--av-fixed-success-accent)] border-[var(--av-fixed-success)]',
        warning: 'bg-[var(--av-fixed-warning-accent)] border-[var(--av-fixed-warning)]',
        danger: 'bg-[var(--av-fixed-danger-accent)] border-[var(--av-fixed-danger)]',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-[var(--av-el-secondary-hover)] active:bg-[var(--av-el-secondary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--av-fixed-focus)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'info',
      interactive: false,
    },
  }
)

export interface WidgetAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetAlertVariants> {}

const WidgetAlert = React.forwardRef<HTMLDivElement, WidgetAlertProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      tabIndex={interactive ? 0 : undefined}
      className={cn(widgetAlertVariants({ variant, interactive }), className)}
      {...props}
    />
  )
)
WidgetAlert.displayName = 'WidgetAlert'

const WidgetAlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 flex items-start pl-6 pt-4 [&>svg]:h-4 [&>svg]:w-4',
      className
    )}
    {...props}
  />
))
WidgetAlertIcon.displayName = 'WidgetAlertIcon'

const WidgetAlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 flex flex-col gap-2 px-4 py-4 min-w-0 text-[var(--av-fixed-primary)]',
      className
    )}
    {...props}
  />
))
WidgetAlertContent.displayName = 'WidgetAlertContent'

const WidgetAlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm font-semibold leading-6 truncate', className)}
    {...props}
  />
))
WidgetAlertTitle.displayName = 'WidgetAlertTitle'

const WidgetAlertDate = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm leading-6 text-[var(--av-fixed-primary)]', className)}
    {...props}
  />
))
WidgetAlertDate.displayName = 'WidgetAlertDate'

const WidgetAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm leading-6 text-[var(--av-fixed-primary)]', className)}
    {...props}
  />
))
WidgetAlertDescription.displayName = 'WidgetAlertDescription'

const WidgetAlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 flex items-start pr-6 pt-4 text-[var(--av-brand-primary)] [&>svg]:h-4 [&>svg]:w-4',
      className
    )}
    {...props}
  />
))
WidgetAlertActions.displayName = 'WidgetAlertActions'

export {
  WidgetAlert,
  WidgetAlertIcon,
  WidgetAlertContent,
  WidgetAlertTitle,
  WidgetAlertDate,
  WidgetAlertDescription,
  WidgetAlertActions,
  widgetAlertVariants,
}
