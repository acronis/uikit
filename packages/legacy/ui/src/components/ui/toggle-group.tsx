import * as React from 'react'
import { ToggleGroup as ToggleGroupPrimitive, Toggle } from '@base-ui/react'

import { cn } from '@/lib/utils'

const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive
    ref={ref}
    className={cn(
      'flex items-center gap-1',
      'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
      className
    )}
    {...props}
  />
))
ToggleGroup.displayName = 'ToggleGroup'

const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof Toggle>,
  React.ComponentPropsWithoutRef<typeof Toggle>
>(({ className, ...props }, ref) => (
  <Toggle
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors',
      'h-9 px-3',
      'border border-transparent bg-transparent',
      'hover:bg-muted hover:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // Base UI uses data-pressed for the active/pressed state
      'data-[pressed]:bg-accent data-[pressed]:text-accent-foreground',
      className
    )}
    {...props}
  />
))
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
