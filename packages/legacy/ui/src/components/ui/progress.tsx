'use client'

import * as React from 'react'
import { Progress as ProgressPrimitive } from '@base-ui/react'

import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value ?? null}
    className={cn('relative h-4 w-full overflow-hidden rounded-full', className)}
    {...props}
  >
    <ProgressPrimitive.Track className="relative h-full w-full overflow-hidden bg-input">
      <ProgressPrimitive.Indicator
        className="h-full bg-primary transition-all data-[indeterminate]:animate-indeterminate-progress data-[indeterminate]:transition-none"
        style={value == null ? { width: '33%' } : undefined}
      />
    </ProgressPrimitive.Track>
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'

export { Progress }
