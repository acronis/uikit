'use client'

import * as React from 'react'
import { Slider as SliderPrimitive } from '@base-ui/react'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, defaultValue, value, ...props }, ref) => {
  // Normalize values to arrays for consistency. Base UI accepts number | readonly number[]
  // but arrays provide more predictable behavior for thumb rendering and state management.
  const normalizedValue =
    value != null ? (Array.isArray(value) ? value : [value]) : undefined
  const normalizedDefaultValue =
    defaultValue != null ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [0]
  const thumbCount = (normalizedValue ?? normalizedDefaultValue).length

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={normalizedValue}
      defaultValue={normalizedDefaultValue}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center">
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-input">
          <SliderPrimitive.Indicator className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              'block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:pointer-events-none disabled:opacity-50',
              'data-dragging:ring-1 data-dragging:ring-ring'
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = 'Slider'

export { Slider }
