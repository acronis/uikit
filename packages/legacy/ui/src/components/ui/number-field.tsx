import * as React from 'react'
import { NumberField } from '@base-ui/react/number-field'

import { cn } from '@/lib/utils'

const NumberFieldRoot = React.forwardRef<
  React.ElementRef<typeof NumberField.Root>,
  React.ComponentPropsWithoutRef<typeof NumberField.Root>
>(({ className, ...props }, ref) => (
  <NumberField.Root ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
))
NumberFieldRoot.displayName = 'NumberFieldRoot'

const NumberFieldGroup = React.forwardRef<
  React.ElementRef<typeof NumberField.Group>,
  React.ComponentPropsWithoutRef<typeof NumberField.Group>
>(({ className, ...props }, ref) => (
  <NumberField.Group
    ref={ref}
    className={cn('flex h-12 w-full rounded border border-input bg-background', className)}
    {...props}
  />
))
NumberFieldGroup.displayName = 'NumberFieldGroup'

const NumberFieldInput = React.forwardRef<
  React.ElementRef<typeof NumberField.Input>,
  React.ComponentPropsWithoutRef<typeof NumberField.Input>
>(({ className, ...props }, ref) => (
  <NumberField.Input
    ref={ref}
    className={cn(
      'w-full bg-transparent px-4 py-3 text-sm leading-6 text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
))
NumberFieldInput.displayName = 'NumberFieldInput'

const NumberFieldDecrement = React.forwardRef<
  React.ElementRef<typeof NumberField.Decrement>,
  React.ComponentPropsWithoutRef<typeof NumberField.Decrement>
>(({ className, children, ...props }, ref) => (
  <NumberField.Decrement
    ref={ref}
    className={cn(
      'flex items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children ?? <span aria-hidden>−</span>}
  </NumberField.Decrement>
))
NumberFieldDecrement.displayName = 'NumberFieldDecrement'

const NumberFieldIncrement = React.forwardRef<
  React.ElementRef<typeof NumberField.Increment>,
  React.ComponentPropsWithoutRef<typeof NumberField.Increment>
>(({ className, children, ...props }, ref) => (
  <NumberField.Increment
    ref={ref}
    className={cn(
      'flex items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children ?? <span aria-hidden>+</span>}
  </NumberField.Increment>
))
NumberFieldIncrement.displayName = 'NumberFieldIncrement'

export {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
}
