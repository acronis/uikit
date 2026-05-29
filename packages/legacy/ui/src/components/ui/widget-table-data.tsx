import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetTableData — Data table widget for dashboard.
 * Figma: Charts-anatomy / Table-Data (node 826:86024)
 *
 * Shows tabular data with optional colored background rows, links, and pagination.
 * Two variants: full table (with header row) and compact (without header).
 * Background: inversed-primary, Border: brand-light
 * Colored-Background: brand-lightest
 * Divider: brand-accent
 *
 * States: hover (el-secondary-hover), active (el-secondary-active), focus (fixed-focus)
 */

export interface WidgetTableDataProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetTableData = React.forwardRef<HTMLDivElement, WidgetTableDataProps>(
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
WidgetTableData.displayName = 'WidgetTableData'

const WidgetTableDataHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetTableDataHeader.displayName = 'WidgetTableDataHeader'

const WidgetTableDataTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetTableDataTitle.displayName = 'WidgetTableDataTitle'

const WidgetTableDataIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetTableDataIcon.displayName = 'WidgetTableDataIcon'

const WidgetTableDataContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 px-6 py-2', className)}
    {...props}
  />
))
WidgetTableDataContent.displayName = 'WidgetTableDataContent'

const WidgetTableDataTable = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn('w-full text-sm', className)}
    {...props}
  />
))
WidgetTableDataTable.displayName = 'WidgetTableDataTable'

const WidgetTableDataThead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'border-b border-[var(--av-brand-accent)] bg-[var(--av-brand-lightest)]',
      className
    )}
    {...props}
  />
))
WidgetTableDataThead.displayName = 'WidgetTableDataThead'

const WidgetTableDataTh = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-3 py-2 text-left text-xs font-semibold text-[var(--av-fixed-primary)]',
      className
    )}
    {...props}
  />
))
WidgetTableDataTh.displayName = 'WidgetTableDataTh'

const WidgetTableDataTbody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&>tr]:border-b [&>tr]:border-[var(--av-brand-accent)]', className)}
    {...props}
  />
))
WidgetTableDataTbody.displayName = 'WidgetTableDataTbody'

const WidgetTableDataTr = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn('transition-colors hover:bg-[var(--av-el-secondary-hover)]', className)}
    {...props}
  />
))
WidgetTableDataTr.displayName = 'WidgetTableDataTr'

const WidgetTableDataTd = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-3 py-2 text-sm', className)}
    {...props}
  />
))
WidgetTableDataTd.displayName = 'WidgetTableDataTd'

const WidgetTableDataLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn('text-[var(--av-fixed-link)] hover:underline cursor-pointer', className)}
    {...props}
  />
))
WidgetTableDataLink.displayName = 'WidgetTableDataLink'

const WidgetTableDataFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-t border-[var(--av-brand-accent)] px-6 py-2 text-xs',
      className
    )}
    {...props}
  />
))
WidgetTableDataFooter.displayName = 'WidgetTableDataFooter'

export {
  WidgetTableData,
  WidgetTableDataHeader,
  WidgetTableDataTitle,
  WidgetTableDataIcon,
  WidgetTableDataContent,
  WidgetTableDataTable,
  WidgetTableDataThead,
  WidgetTableDataTh,
  WidgetTableDataTbody,
  WidgetTableDataTr,
  WidgetTableDataTd,
  WidgetTableDataLink,
  WidgetTableDataFooter,
}
