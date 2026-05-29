import * as React from 'react'
import { CloseIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void
  icon?: React.ReactNode
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, children, onRemove, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-6 items-center gap-2 rounded-full border border-[rgba(38,104,197,0.3)] bg-[rgba(38,104,197,0.05)] text-sm leading-6 text-[hsl(var(--chip-foreground))]',
          onRemove ? 'pl-3 pr-0' : 'px-3',
          className
        )}
        {...props}
      >
        {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
        <span className="font-normal">{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-full items-center justify-center rounded-br-full rounded-tr-full pl-1 pr-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            aria-label="Remove"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Chip.displayName = 'Chip'

export { Chip }
