import * as React from 'react';

import { cn } from '@/lib/utils';

// The full-page application scaffold from the Figma App Shell (node 2782-1495):
// a left sidebar column (holds SidebarPrimary, optionally a secondary menu) beside
// a body column of a sticky header (with the global search) over the scrolling
// main content. Layout-only — the rich parts come from SidebarPrimary /
// SidebarSecondary / SearchGlobal placed inside these slots. Surfaces use the
// shared `--ui-*` tokens (bg-background / border-border; a bare `border` is
// transparent in ui-react, so borders name `border-border`).

const AppShell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell"
    className={cn('flex min-h-screen w-full bg-background', className)}
    {...props}
  />
));
AppShell.displayName = 'AppShell';

const AppShellSidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    data-slot="app-shell-sidebar"
    className={cn('flex shrink-0', className)}
    {...props}
  />
));
AppShellSidebar.displayName = 'AppShellSidebar';

const AppShellBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="app-shell-body"
    className={cn('flex min-w-0 flex-1 flex-col', className)}
    {...props}
  />
));
AppShellBody.displayName = 'AppShellBody';

const AppShellHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    data-slot="app-shell-header"
    className={cn(
      'sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6',
      className
    )}
    {...props}
  />
));
AppShellHeader.displayName = 'AppShellHeader';

const AppShellMain = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    data-slot="app-shell-main"
    className={cn('flex-1 overflow-auto', className)}
    {...props}
  />
));
AppShellMain.displayName = 'AppShellMain';

const AppShellFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    data-slot="app-shell-footer"
    className={cn('shrink-0 border-t border-border bg-background px-6 py-4', className)}
    {...props}
  />
));
AppShellFooter.displayName = 'AppShellFooter';

export {
  AppShell,
  AppShellSidebar,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellFooter,
};
