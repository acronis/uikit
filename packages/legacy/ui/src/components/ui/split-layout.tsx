import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const splitLayoutVariants = cva(
  'flex w-full',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

export interface SplitLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitLayoutVariants> {}

const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(splitLayoutVariants({ orientation }), className)}
      {...props}
    />
  )
)
SplitLayout.displayName = 'SplitLayout'

const SplitLayoutPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-auto', className)}
    {...props}
  />
))
SplitLayoutPanel.displayName = 'SplitLayoutPanel'

export { SplitLayout, SplitLayoutPanel, splitLayoutVariants }
