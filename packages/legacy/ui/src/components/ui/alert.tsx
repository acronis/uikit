import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva('relative w-full flex items-start border-b border-foreground/10', {
  variants: {
    variant: {
      info: 'bg-info text-info-foreground border-info-accent',
      success: 'bg-success text-success-foreground border-success-accent',
      warning: 'bg-warning text-warning-foreground border-warning-accent',
      critical: 'bg-critical text-critical-foreground border-critical-accent',
      destructive: 'bg-danger text-danger-foreground border-danger-accent',
      ai: 'bg-ai text-ai-foreground border-ai-accent',
      neutral: 'bg-neutral text-neutral-foreground border-neutral-accent',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
))
Alert.displayName = 'Alert'

const AlertIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-start pl-6 pr-0 pt-3 pb-0', className)} {...props} />
  )
)
AlertIcon.displayName = 'AlertIcon'

const AlertContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 flex flex-col items-start pl-4 pr-6 pt-2 pb-[7px] min-w-0', className)}
      {...props}
    />
  )
)
AlertContent.displayName = 'AlertContent'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('font-semibold text-sm leading-6 mb-0', className)} {...props} />
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm leading-6 font-normal', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription }
