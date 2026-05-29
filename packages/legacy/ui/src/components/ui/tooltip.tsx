import * as React from 'react'
import { Tooltip } from '@base-ui/react'

import { cn } from '@/lib/utils'

const TooltipProvider = Tooltip.Provider

const TooltipRoot = Tooltip.Root

const TooltipTrigger = Tooltip.Trigger

type PositionerProps = React.ComponentPropsWithoutRef<typeof Tooltip.Positioner>

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof Tooltip.Popup> {
  sideOffset?: number
  side?: PositionerProps['side']
  align?: PositionerProps['align']
  className?: string
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 5, side = 'top', align, children, ...props }, ref) => (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={sideOffset} side={side} align={align}>
        <Tooltip.Popup
          ref={ref}
          className={cn(
            'z-50 overflow-hidden rounded bg-popover px-4 py-4 text-xs font-medium leading-4 text-popover-foreground shadow-[0px_10px_20px_rgba(36,49,67,0.2)]',
            // Base UI uses data-open / data-closed / data-starting-style / data-ending-style
            'data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95',
            'data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          {...props}
        >
          {children}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  )
)
TooltipContent.displayName = 'TooltipContent'

const TooltipArrow = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Tooltip.Arrow>>(
  ({ className, ...props }, ref) => (
    <Tooltip.Arrow
      ref={ref}
      className={cn('fill-popover', className)}
      {...props}
    />
  )
)
TooltipArrow.displayName = 'TooltipArrow'

export { TooltipRoot as Tooltip, TooltipTrigger, TooltipContent, TooltipArrow, TooltipProvider }