import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetProtectionStatus — Protection status indicator widget.
 * Figma: Charts-anatomy / Protection-Status (node 533:75562)
 *
 * Shows protection status with a visual indicator (icon/badge),
 * status label, and optional details.
 * Background: inversed-primary, Border: brand-light
 *
 * States: hover, active, focus
 */

export interface WidgetProtectionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetProtectionStatus = React.forwardRef<HTMLDivElement, WidgetProtectionStatusProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        'relative flex flex-col rounded-lg border border-[var(--av-brand-light)] bg-[var(--av-inversed-primary)] text-[var(--av-fixed-primary)] transition-colors',
        interactive && 'cursor-pointer hover:bg-[var(--av-el-secondary-hover)] active:bg-[var(--av-el-secondary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--av-fixed-focus)]',
        className
      )}
      {...props}
    />
  )
)
WidgetProtectionStatus.displayName = 'WidgetProtectionStatus'

const WidgetProtectionStatusHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetProtectionStatusHeader.displayName = 'WidgetProtectionStatusHeader'

const WidgetProtectionStatusTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetProtectionStatusTitle.displayName = 'WidgetProtectionStatusTitle'

const WidgetProtectionStatusIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetProtectionStatusIcon.displayName = 'WidgetProtectionStatusIcon'

const WidgetProtectionStatusContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 flex flex-col gap-2 px-6 py-2', className)}
    {...props}
  />
))
WidgetProtectionStatusContent.displayName = 'WidgetProtectionStatusContent'

const WidgetProtectionStatusIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status?: 'success' | 'warning' | 'critical' | 'danger' | 'info' | 'neutral'
  }
>(({ className, status = 'success', ...props }, ref) => {
  const statusColors: Record<string, string> = {
    success: 'var(--av-chart-success)',
    warning: 'var(--av-chart-warning)',
    critical: 'var(--av-chart-critical)',
    danger: 'var(--av-chart-danger)',
    info: 'var(--av-chart-info)',
    neutral: 'var(--av-chart-neutral)',
  }

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <div
        className="h-3 w-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: statusColors[status] }}
      />
      {props.children}
    </div>
  )
})
WidgetProtectionStatusIndicator.displayName = 'WidgetProtectionStatusIndicator'

const WidgetProtectionStatusValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-8 tabular-nums', className)}
    {...props}
  />
))
WidgetProtectionStatusValue.displayName = 'WidgetProtectionStatusValue'

const WidgetProtectionStatusLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm leading-6', className)}
    {...props}
  />
))
WidgetProtectionStatusLabel.displayName = 'WidgetProtectionStatusLabel'

const WidgetProtectionStatusFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-[var(--av-brand-accent)] px-6 py-2 text-xs', className)}
    {...props}
  />
))
WidgetProtectionStatusFooter.displayName = 'WidgetProtectionStatusFooter'

export {
  WidgetProtectionStatus,
  WidgetProtectionStatusHeader,
  WidgetProtectionStatusTitle,
  WidgetProtectionStatusIcon,
  WidgetProtectionStatusContent,
  WidgetProtectionStatusIndicator,
  WidgetProtectionStatusValue,
  WidgetProtectionStatusLabel,
  WidgetProtectionStatusFooter,
}
