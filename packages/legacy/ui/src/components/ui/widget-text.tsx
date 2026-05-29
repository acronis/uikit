import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetText — Text-based dashboard widget.
 * Figma: Charts-anatomy / Text-Widgets (node 829:95739)
 *
 * Shows text-based metrics: a large value, label, and optional trend indicator.
 * Background: inversed-primary, Border: brand-light
 *
 * States: hover, active, focus
 */

export interface WidgetTextProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetText = React.forwardRef<HTMLDivElement, WidgetTextProps>(
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
WidgetText.displayName = 'WidgetText'

const WidgetTextHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetTextHeader.displayName = 'WidgetTextHeader'

const WidgetTextTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetTextTitle.displayName = 'WidgetTextTitle'

const WidgetTextIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetTextIcon.displayName = 'WidgetTextIcon'

const WidgetTextContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 flex flex-col gap-1 px-6 py-2', className)}
    {...props}
  />
))
WidgetTextContent.displayName = 'WidgetTextContent'

const WidgetTextValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-8 tabular-nums', className)}
    {...props}
  />
))
WidgetTextValue.displayName = 'WidgetTextValue'

const WidgetTextLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm leading-6', className)}
    {...props}
  />
))
WidgetTextLabel.displayName = 'WidgetTextLabel'

export interface WidgetTextTrendProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'up' | 'down' | 'neutral'
}

const WidgetTextTrend = React.forwardRef<HTMLDivElement, WidgetTextTrendProps>(
  ({ className, direction = 'neutral', children, ...props }, ref) => {
    const colorMap: Record<string, string> = {
      up: 'text-[var(--av-chart-success)]',
      down: 'text-[var(--av-chart-danger)]',
      neutral: 'text-[var(--av-chart-neutral)]',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1 text-sm font-semibold', colorMap[direction], className)}
        {...props}
      >
        {direction === 'up' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
          </svg>
        )}
        {direction === 'down' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
          </svg>
        )}
        {children}
      </div>
    )
  }
)
WidgetTextTrend.displayName = 'WidgetTextTrend'

const WidgetTextDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-[var(--av-brand-accent)] mx-6', className)}
    {...props}
  />
))
WidgetTextDivider.displayName = 'WidgetTextDivider'

const WidgetTextFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pb-4 pt-0 text-xs', className)}
    {...props}
  />
))
WidgetTextFooter.displayName = 'WidgetTextFooter'

export {
  WidgetText,
  WidgetTextHeader,
  WidgetTextTitle,
  WidgetTextIcon,
  WidgetTextContent,
  WidgetTextValue,
  WidgetTextLabel,
  WidgetTextTrend,
  WidgetTextDivider,
  WidgetTextFooter,
}
