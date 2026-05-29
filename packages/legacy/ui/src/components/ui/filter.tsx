import * as React from 'react'
import { FilterIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface FilterProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number
  active?: boolean
  variant?: 'default' | 'outline' | 'ghost'
}

const Filter = React.forwardRef<HTMLButtonElement, FilterProps>(
  ({ className, count, active = false, variant = 'ghost', children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          'gap-2 text-[hsl(var(--filter-text))] hover:text-[hsl(var(--filter-text))] hover:bg-transparent',
          active && 'font-semibold',
          className
        )}
        {...props}
      >
        {count !== undefined && count > 0 && (
          <span className="flex items-center justify-center px-1 min-w-[16px] h-4 text-[11px] font-bold leading-4 tracking-wider uppercase bg-[hsl(var(--filter-counter-bg))] text-[hsl(var(--filter-counter-text))] rounded-sm">
            {count}
          </span>
        )}
        {!count && <FilterIcon className="h-4 w-4 text-[hsl(var(--filter-icon))]" />}
        <span className="text-sm font-semibold leading-6">{children || 'Filter'}</span>
      </Button>
    )
  }
)
Filter.displayName = 'Filter'

export { Filter }
