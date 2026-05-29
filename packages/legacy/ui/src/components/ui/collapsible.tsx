'use client'

import * as React from 'react'
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react'

import { cn } from '@/lib/utils'

const Collapsible = CollapsiblePrimitive.Root
const CollapsibleTrigger = CollapsiblePrimitive.Trigger
// Base UI renamed Content → Panel; re-export under the original name for API compatibility
const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>(({ className, style, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className={cn(
      'overflow-hidden',
      'data-[starting-style]:h-0 data-[ending-style]:h-0',
      'transition-[height] duration-200 ease-out',
      className
    )}
    style={style}
    {...props}
  />
))
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
