import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetProgressChunks — Chunked progress visualization widget.
 * Figma: Charts-anatomy / Progress-Chunks (node 237:74702)
 *
 * Shows progress as discrete colored chunks/segments with labels and values.
 * Colors: chart-success, chart-warning, chart-critical, chart-danger
 * Background: inversed-primary, Border: brand-light
 * Divider: brand-accent
 *
 * Anatomy:
 * - WidgetProgressChunks (root)
 *   - Header: title + icon
 *   - Chunks: rows of labeled progress segments
 *   - Footer: optional summary
 *
 * States: hover, active, focus, focus-data
 */

export interface ProgressChunk {
  label: string
  value: number
  total: number
  color: string
}

export interface WidgetProgressChunksProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetProgressChunks = React.forwardRef<HTMLDivElement, WidgetProgressChunksProps>(
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
WidgetProgressChunks.displayName = 'WidgetProgressChunks'

const WidgetProgressChunksHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetProgressChunksHeader.displayName = 'WidgetProgressChunksHeader'

const WidgetProgressChunksTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetProgressChunksTitle.displayName = 'WidgetProgressChunksTitle'

const WidgetProgressChunksIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetProgressChunksIcon.displayName = 'WidgetProgressChunksIcon'

const WidgetProgressChunksBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-2 px-6 py-2', className)}
    {...props}
  />
))
WidgetProgressChunksBody.displayName = 'WidgetProgressChunksBody'

export interface WidgetProgressChunkRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: number
  total: number
  color: string
  formatValue?: (value: number) => string
  formatTotal?: (total: number) => string
}

const WidgetProgressChunkRow = React.forwardRef<HTMLDivElement, WidgetProgressChunkRowProps>(
  ({ className, label, value, total, color, formatValue, formatTotal, ...props }, ref) => {
    const pct = total > 0 ? (value / total) * 100 : 0
    const displayValue = formatValue ? formatValue(value) : String(value)
    const displayTotal = formatTotal ? formatTotal(total) : String(total)

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--av-fixed-primary)]">{label}</span>
          <span className="font-semibold tabular-nums">
            {displayValue} / {displayTotal}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[var(--av-brand-light)]">
          <div
            className="h-full rounded transition-all"
            style={{
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    )
  }
)
WidgetProgressChunkRow.displayName = 'WidgetProgressChunkRow'

const WidgetProgressChunksFooter = React.forwardRef<
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
WidgetProgressChunksFooter.displayName = 'WidgetProgressChunksFooter'

export {
  WidgetProgressChunks,
  WidgetProgressChunksHeader,
  WidgetProgressChunksTitle,
  WidgetProgressChunksIcon,
  WidgetProgressChunksBody,
  WidgetProgressChunkRow,
  WidgetProgressChunksFooter,
}
