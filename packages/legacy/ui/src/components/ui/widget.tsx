import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Widget — A dashboard card container for charts, progress indicators, and data displays.
 * Follows the Figma "Charts-anatomy" design system.
 *
 * Anatomy:
 * - Widget (root container)
 *   - WidgetHeader (title row with optional icon and actions)
 *     - WidgetIcon
 *     - WidgetTitle
 *     - WidgetActions (dropdown trigger, etc.)
 *   - WidgetContent (main visualization area)
 *   - WidgetFooter (optional legend, labels, or actions)
 */

const widgetVariants = cva(
  'relative flex flex-col rounded-lg border bg-[var(--av-inversed-primary)] text-[var(--av-fixed-primary)] transition-colors',
  {
    variants: {
      size: {
        sm: 'min-h-[112px]',
        md: 'min-h-[176px]',
        lg: 'min-h-[240px]',
        xl: 'min-h-[352px]',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-[var(--av-el-secondary-hover)] active:bg-[var(--av-el-secondary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--av-fixed-focus)]',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      interactive: false,
    },
  }
)

export interface WidgetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, size, interactive, ...props }, ref) => (
    <div
      ref={ref}
      tabIndex={interactive ? 0 : undefined}
      className={cn(widgetVariants({ size, interactive }), className)}
      {...props}
    />
  )
)
Widget.displayName = 'Widget'

const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-2 px-6 pt-4 pb-0',
      className
    )}
    {...props}
  />
))
WidgetHeader.displayName = 'WidgetHeader'

const WidgetIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 text-[var(--av-fixed-link)] [&>svg]:h-4 [&>svg]:w-4',
      className
    )}
    {...props}
  />
))
WidgetIcon.displayName = 'WidgetIcon'

const WidgetTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 truncate text-sm font-semibold leading-6',
      className
    )}
    {...props}
  />
))
WidgetTitle.displayName = 'WidgetTitle'

const WidgetActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-shrink-0 flex items-center gap-1 text-[var(--av-brand-primary)] [&>svg]:h-4 [&>svg]:w-4',
      className
    )}
    {...props}
  />
))
WidgetActions.displayName = 'WidgetActions'

const WidgetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 px-6 py-2', className)}
    {...props}
  />
))
WidgetContent.displayName = 'WidgetContent'

const WidgetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pb-4 pt-0', className)}
    {...props}
  />
))
WidgetFooter.displayName = 'WidgetFooter'

const WidgetValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold leading-8 tabular-nums', className)}
    {...props}
  />
))
WidgetValue.displayName = 'WidgetValue'

const WidgetLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-[var(--av-fixed-primary)] leading-6', className)}
    {...props}
  />
))
WidgetLabel.displayName = 'WidgetLabel'

const WidgetDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-[var(--av-brand-accent)] mx-6', className)}
    {...props}
  />
))
WidgetDivider.displayName = 'WidgetDivider'

export {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetActions,
  WidgetContent,
  WidgetFooter,
  WidgetValue,
  WidgetLabel,
  WidgetDivider,
  widgetVariants,
}
