import * as React from 'react';

import { cn } from '@/lib/utils';

// A centered card layout for auth flows (sign-in / sign-up / forgot-password /
// 2FA), reconciled with the Main-menu-improvements Figma (node 4906-362342).
// Ported from `@acronis-platform`'s `auth-layout`. Token fixes vs legacy: the card
// uses `bg-background` (legacy `bg-card` isn't bridged in ui-react) and a named
// `border-border` (a bare `border` is transparent here).
//
// Anatomy:
//   AuthLayout (full-page centered)
//     AuthLayoutCard (centered surface card)
//       AuthLayoutLogo (top brand slot)
//       …children (title + form)…
//       AuthLayoutFooter (bottom links)

const AuthLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="auth-layout"
    className={cn(
      'flex min-h-screen w-full items-center justify-center bg-background p-4',
      className
    )}
    {...props}
  />
));
AuthLayout.displayName = 'AuthLayout';

const AuthLayoutCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="auth-layout-card"
    className={cn(
      'w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm',
      className
    )}
    {...props}
  />
));
AuthLayoutCard.displayName = 'AuthLayoutCard';

const AuthLayoutLogo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="auth-layout-logo"
    className={cn('mb-6 flex justify-center', className)}
    {...props}
  />
));
AuthLayoutLogo.displayName = 'AuthLayoutLogo';

const AuthLayoutFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="auth-layout-footer"
    className={cn('mt-6 text-center text-sm text-muted-foreground', className)}
    {...props}
  />
));
AuthLayoutFooter.displayName = 'AuthLayoutFooter';

export { AuthLayout, AuthLayoutCard, AuthLayoutLogo, AuthLayoutFooter };
