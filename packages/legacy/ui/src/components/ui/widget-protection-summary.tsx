import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetProtectionSummary — Protection summary dashboard widget.
 * Figma: Charts-anatomy / Protection-Summary (node 538:78584)
 *
 * Shows a summary of protection metrics with status indicators and values.
 * Background: inversed-primary, Border: brand-light
 *
 * States: hover, active, focus
 */

export interface WidgetProtectionSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetProtectionSummary = React.forwardRef<HTMLDivElement, WidgetProtectionSummaryProps>(
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
WidgetProtectionSummary.displayName = 'WidgetProtectionSummary'

const WidgetProtectionSummaryHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetProtectionSummaryHeader.displayName = 'WidgetProtectionSummaryHeader'

const WidgetProtectionSummaryTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetProtectionSummaryTitle.displayName = 'WidgetProtectionSummaryTitle'

const WidgetProtectionSummaryIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetProtectionSummaryIcon.displayName = 'WidgetProtectionSummaryIcon'

const WidgetProtectionSummaryContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 flex flex-col gap-2 px-6 py-2', className)}
    {...props}
  />
))
WidgetProtectionSummaryContent.displayName = 'WidgetProtectionSummaryContent'

export interface WidgetProtectionSummaryRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  status?: 'success' | 'warning' | 'critical' | 'danger' | 'info' | 'neutral'
}

const WidgetProtectionSummaryRow = React.forwardRef<HTMLDivElement, WidgetProtectionSummaryRowProps>(
  ({ className, label, value, status, ...props }, ref) => {
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
        className={cn('flex items-center justify-between py-1', className)}
        {...props}
      >
        <div className="flex items-center gap-2 text-sm">
          {status && (
            <div
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColors[status] }}
            />
          )}
          <span>{label}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums">{value}</span>
      </div>
    )
  }
)
WidgetProtectionSummaryRow.displayName = 'WidgetProtectionSummaryRow'

const WidgetProtectionSummaryDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-[var(--av-brand-accent)] mx-6', className)}
    {...props}
  />
))
WidgetProtectionSummaryDivider.displayName = 'WidgetProtectionSummaryDivider'

const WidgetProtectionSummaryFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-[var(--av-brand-accent)] px-6 py-2 text-xs', className)}
    {...props}
  />
))
WidgetProtectionSummaryFooter.displayName = 'WidgetProtectionSummaryFooter'

export {
  WidgetProtectionSummary,
  WidgetProtectionSummaryHeader,
  WidgetProtectionSummaryTitle,
  WidgetProtectionSummaryIcon,
  WidgetProtectionSummaryContent,
  WidgetProtectionSummaryRow,
  WidgetProtectionSummaryDivider,
  WidgetProtectionSummaryFooter,
}
