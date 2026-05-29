import * as React from 'react'

import { cn } from '@/lib/utils'

const AppShell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex min-h-screen w-full bg-background', className)}
    {...props}
  />
))
AppShell.displayName = 'AppShell'

const AppShellSidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn('flex-shrink-0', className)}
    {...props}
  />
))
AppShellSidebar.displayName = 'AppShellSidebar'

const AppShellBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-1 flex-col overflow-hidden', className)}
    {...props}
  />
))
AppShellBody.displayName = 'AppShellBody'

const AppShellHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      'sticky top-0 z-10 flex h-16 items-center border-b bg-background px-6',
      className
    )}
    {...props}
  />
))
AppShellHeader.displayName = 'AppShellHeader'

const AppShellMain = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    className={cn('flex-1 overflow-auto', className)}
    {...props}
  />
))
AppShellMain.displayName = 'AppShellMain'

const AppShellFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn('border-t bg-background px-6 py-4', className)}
    {...props}
  />
))
AppShellFooter.displayName = 'AppShellFooter'

export {
  AppShell,
  AppShellSidebar,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellFooter,
}