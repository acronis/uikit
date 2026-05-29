import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * AuthLayout — A centered card layout for login/signup/forgot-password flows.
 *
 * Anatomy:
 * - AuthLayout (root, full-page centered)
 *   - AuthLayoutCard (centered card with max-width)
 *     - AuthLayoutLogo (logo/brand slot at top)
 *     - (children go here)
 *     - AuthLayoutFooter (bottom links/text)
 */

const AuthLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex min-h-screen w-full items-center justify-center bg-background p-4',
      className
    )}
    {...props}
  />
))
AuthLayout.displayName = 'AuthLayout'

const AuthLayoutCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full max-w-sm rounded-lg border bg-card p-6 shadow-xs',
      className
    )}
    {...props}
  />
))
AuthLayoutCard.displayName = 'AuthLayoutCard'

const AuthLayoutLogo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-6 flex justify-center', className)}
    {...props}
  />
))
AuthLayoutLogo.displayName = 'AuthLayoutLogo'

const AuthLayoutFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-6 text-center text-sm text-muted-foreground',
      className
    )}
    {...props}
  />
))
AuthLayoutFooter.displayName = 'AuthLayoutFooter'

export { AuthLayout, AuthLayoutCard, AuthLayoutLogo, AuthLayoutFooter }