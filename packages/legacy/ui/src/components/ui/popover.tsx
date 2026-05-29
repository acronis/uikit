import * as React from 'react'
import { Popover } from '@base-ui/react'

import { cn } from '@/lib/utils'

const PopoverRoot = Popover.Root

const PopoverTrigger = Popover.Trigger

const PopoverPortal = Popover.Portal

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  Omit<Popover.Popup.Props, 'ref'> & {
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'
    sideOffset?: number
    portal?: boolean
  }
>(({ className, align = 'center', side = 'bottom', sideOffset = 4, portal = true, ...props }, ref) => {
  const positioner = (
    <Popover.Positioner align={align} side={side} sideOffset={sideOffset}>
      <Popover.Popup
        ref={ref}
        className={cn(
          'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          'data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0',
          'data-[closed]:zoom-out-95 data-[open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      />
    </Popover.Positioner>
  )

  return portal ? <Popover.Portal>{positioner}</Popover.Portal> : positioner
})
PopoverContent.displayName = 'PopoverContent'

export { PopoverRoot as Popover, PopoverTrigger, PopoverPortal, PopoverContent }