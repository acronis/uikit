import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetProgressTiers — Tiered progress bar widget for dashboard.
 * Figma: Charts-anatomy / Progress-Tiers (node 229:70578)
 *
 * Shows a horizontal stacked bar with colored tiers and labels.
 * Colors: chart-success, chart-warning, chart-critical, chart-danger, chart-neutral
 * Background: inversed-primary, Border: brand-light
 * Divider: brand-accent
 *
 * Anatomy:
 * - WidgetProgressTiers (root)
 *   - Header: title + icon + dropdown
 *   - Bar: stacked horizontal segments
 *   - Legend: tier labels with values
 *   - Footer: optional summary
 *
 * States: hover (el-secondary-hover), active (el-secondary-active), focus (fixed-focus), focus-data (fixed-focus on tier)
 */

export interface ProgressTier {
  label: string
  value: number
  color: string
}

export interface WidgetProgressTiersProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetProgressTiers = React.forwardRef<HTMLDivElement, WidgetProgressTiersProps>(
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
WidgetProgressTiers.displayName = 'WidgetProgressTiers'

const WidgetProgressTiersHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetProgressTiersHeader.displayName = 'WidgetProgressTiersHeader'

const WidgetProgressTiersTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetProgressTiersTitle.displayName = 'WidgetProgressTiersTitle'

const WidgetProgressTiersIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetProgressTiersIcon.displayName = 'WidgetProgressTiersIcon'

export interface WidgetProgressTiersBarProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers: ProgressTier[]
  total?: number
}

const WidgetProgressTiersBar = React.forwardRef<HTMLDivElement, WidgetProgressTiersBarProps>(
  ({ className, tiers, total, ...props }, ref) => {
    const sum = total ?? tiers.reduce((acc, t) => acc + t.value, 0)

    return (
      <div
        ref={ref}
        className={cn('flex h-6 w-full overflow-hidden rounded px-6', className)}
        {...props}
      >
        <div className="flex h-full w-full overflow-hidden rounded border border-[var(--av-fixed-invisible)]">
          {tiers.map((tier, index) => {
            const pct = sum > 0 ? (tier.value / sum) * 100 : 0
            return (
              <div
                key={index}
                className="h-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: tier.color,
                }}
                title={`${tier.label}: ${tier.value}`}
              />
            )
          })}
        </div>
      </div>
    )
  }
)
WidgetProgressTiersBar.displayName = 'WidgetProgressTiersBar'

const WidgetProgressTiersLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-wrap gap-x-4 gap-y-1 px-6 py-2', className)}
    {...props}
  />
))
WidgetProgressTiersLegend.displayName = 'WidgetProgressTiersLegend'

export interface WidgetProgressTiersLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  label: string
  value?: string | number
}

const WidgetProgressTiersLegendItem = React.forwardRef<HTMLDivElement, WidgetProgressTiersLegendItemProps>(
  ({ className, color, label, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-1.5 text-xs', className)}
      {...props}
    >
      <div
        className="h-2 w-2 rounded-sm flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[var(--av-fixed-primary)]">{label}</span>
      {value !== undefined && (
        <span className="font-semibold tabular-nums">{value}</span>
      )}
    </div>
  )
)
WidgetProgressTiersLegendItem.displayName = 'WidgetProgressTiersLegendItem'

const WidgetProgressTiersFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border-t border-[var(--av-brand-accent)] px-6 py-2 text-xs',
      className
    )}
    {...props}
  />
))
WidgetProgressTiersFooter.displayName = 'WidgetProgressTiersFooter'

export {
  WidgetProgressTiers,
  WidgetProgressTiersHeader,
  WidgetProgressTiersTitle,
  WidgetProgressTiersIcon,
  WidgetProgressTiersBar,
  WidgetProgressTiersLegend,
  WidgetProgressTiersLegendItem,
  WidgetProgressTiersFooter,
}
