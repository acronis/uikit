import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-xl border font-bold uppercase tracking-wider',
  {
    variants: {
      variant: {
          success: 'bg-success border-success-accent text-success-foreground',
          info: 'bg-info border-info-accent text-info-foreground',
          warning: 'bg-warning border-warning-accent text-warning-foreground',
          critical: 'bg-critical border-critical-accent text-critical-foreground',
          danger: 'bg-destructive border-destructive-accent text-destructive-foreground',
          neutral: 'bg-neutral border-neutral-accent text-neutral-foreground',
      },
      size: {
        default: 'h-6 px-2 py-1 text-[11px] leading-4',
        small: 'h-4 px-2 py-0 text-[10px] leading-4',
      },
    },
    defaultVariants: {
      variant: 'success',
      size: 'default',
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
  icon?: React.ReactNode
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(tagVariants({ variant, size, className }))} {...props}>
        {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
        <span>{children}</span>
      </div>
    )
  }
)
Tag.displayName = 'Tag'

export { Tag, tagVariants }
