import * as React from 'react'
import { Separator as SeparatorPrimitive } from '@base-ui/react'

import { cn } from '@/lib/utils'

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive> & { decorative?: boolean }
>(({ className, orientation = 'horizontal', decorative: _decorative, ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-primary/10',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator }