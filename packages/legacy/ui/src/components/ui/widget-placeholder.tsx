import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * WidgetPlaceholder — Empty state / placeholder widget for dashboard.
 * Figma: Charts-anatomy / Placeholders (node 229:73962)
 *
 * Shows a placeholder with icon, title, and optional description/action.
 * Two sizes: default (with large icon) and compact (with small icon).
 * Background: inversed-primary, Border: brand-light
 * Icon: brand-light (placeholder icon), fixed-link (action icon)
 *
 * States: hover (el-secondary-hover), active (el-secondary-active), focus (fixed-focus)
 */

export interface WidgetPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

const WidgetPlaceholder = React.forwardRef<HTMLDivElement, WidgetPlaceholderProps>(
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
WidgetPlaceholder.displayName = 'WidgetPlaceholder'

const WidgetPlaceholderHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
))
WidgetPlaceholderHeader.displayName = 'WidgetPlaceholderHeader'

const WidgetPlaceholderTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
))
WidgetPlaceholderTitle.displayName = 'WidgetPlaceholderTitle'

const WidgetPlaceholderIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4', className)}
    {...props}
  />
))
WidgetPlaceholderIcon.displayName = 'WidgetPlaceholderIcon'

const WidgetPlaceholderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 flex flex-col items-center justify-center gap-2 px-6 py-4 text-center',
      className
    )}
    {...props}
  />
))
WidgetPlaceholderContent.displayName = 'WidgetPlaceholderContent'

const WidgetPlaceholderImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-center text-[var(--av-brand-light)] [&>svg]:h-[72px] [&>svg]:w-[72px]',
      className
    )}
    {...props}
  />
))
WidgetPlaceholderImage.displayName = 'WidgetPlaceholderImage'

const WidgetPlaceholderText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm leading-6 text-[var(--av-fixed-primary)]', className)}
    {...props}
  />
))
WidgetPlaceholderText.displayName = 'WidgetPlaceholderText'

const WidgetPlaceholderAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-sm font-semibold text-[var(--av-fixed-link)] cursor-pointer hover:underline',
      className
    )}
    {...props}
  />
))
WidgetPlaceholderAction.displayName = 'WidgetPlaceholderAction'

const WidgetPlaceholderFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pb-4 pt-0 text-xs', className)}
    {...props}
  />
))
WidgetPlaceholderFooter.displayName = 'WidgetPlaceholderFooter'

export {
  WidgetPlaceholder,
  WidgetPlaceholderHeader,
  WidgetPlaceholderTitle,
  WidgetPlaceholderIcon,
  WidgetPlaceholderContent,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderAction,
  WidgetPlaceholderFooter,
}
