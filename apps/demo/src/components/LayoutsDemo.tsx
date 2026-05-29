import * as React from 'react'
import {
  AppShell, AppShellSidebar, AppShellBody, AppShellHeader, AppShellMain, AppShellFooter,
  AuthLayout, AuthLayoutCard, AuthLayoutLogo, AuthLayoutFooter,
  DashboardLayout, DashboardGrid,
  Button,
  Card, CardHeader, CardTitle, CardContent,
} from '@acronis-platform/shadcn-uikit/react'

function AppShellExample() {
  return (
    <div className="border rounded-lg overflow-hidden h-64">
      <AppShell>
        <AppShellSidebar className="w-48 border-r bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Navigation</p>
          <div className="space-y-1">
            <div className="px-2 py-1 rounded text-sm bg-accent">Dashboard</div>
            <div className="px-2 py-1 rounded text-sm">Settings</div>
            <div className="px-2 py-1 rounded text-sm">Users</div>
          </div>
        </AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>
            <span className="font-semibold">My Application</span>
          </AppShellHeader>
          <AppShellMain className="p-4">
            <p className="text-muted-foreground text-sm">Main content area</p>
          </AppShellMain>
          <AppShellFooter className="text-xs text-muted-foreground">
            Footer content
          </AppShellFooter>
        </AppShellBody>
      </AppShell>
    </div>
  )
}

function AuthLayoutExample() {
  return (
    <div className="border rounded-lg overflow-hidden bg-muted/20 py-8">
      <AuthLayout className="relative min-h-0">
        <AuthLayoutCard>
          <AuthLayoutLogo>
            <div className="h-8 w-8 rounded bg-primary" />
          </AuthLayoutLogo>
          <h2 className="text-xl font-bold text-center mb-4">Sign in</h2>
          <div className="space-y-3">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Email" />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Password" type="password" />
            <Button className="w-full">Sign in</Button>
          </div>
          <AuthLayoutFooter>
            Don&apos;t have an account? <a href="#" className="underline">Sign up</a>
          </AuthLayoutFooter>
        </AuthLayoutCard>
      </AuthLayout>
    </div>
  )
}

function DashboardLayoutExample() {
  return (
    <DashboardLayout>
      <DashboardGrid cols={3}>
        {['Metric A', 'Metric B', 'Metric C'].map((title) => (
          <Card key={title}>
            <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">1,234</p></CardContent>
          </Card>
        ))}
      </DashboardGrid>
    </DashboardLayout>
  )
}

export function LayoutsDemo() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold">Layout Components</h2>
        <p className="text-muted-foreground">Structural shells for common application layouts.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AppShell</h3>
        <p className="text-sm text-muted-foreground">Full-page shell with sidebar, header, main content, and footer slots.</p>
        <AppShellExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AuthLayout</h3>
        <p className="text-sm text-muted-foreground">Centered card layout for authentication flows.</p>
        <AuthLayoutExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">DashboardLayout + DashboardGrid</h3>
        <p className="text-sm text-muted-foreground">Responsive grid layout for dashboard widgets.</p>
        <DashboardLayoutExample />
      </div>
    </div>
  )
}