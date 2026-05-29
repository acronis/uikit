import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@acronis-platform/shadcn-uikit/react'
import {
  DashboardPattern,
  SettingsPattern,
  DataManagementPattern,
  LoginPattern,
  SignupPattern,
  ErrorPagesPattern,
} from '@acronis-platform/shadcn-uikit-demos/patterns'

export function PatternsDemo() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-2xl font-bold">Pattern Demos</h2>
        <p className="text-muted-foreground">
          Semi-functional page composition examples. Each pattern uses real library components with mock data.
        </p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="errors">Error Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 600 }}>
          <DashboardPattern />
        </TabsContent>
        <TabsContent value="settings" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 600 }}>
          <SettingsPattern />
        </TabsContent>
        <TabsContent value="data" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 600 }}>
          <DataManagementPattern />
        </TabsContent>
        <TabsContent value="login" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 500 }}>
          <LoginPattern />
        </TabsContent>
        <TabsContent value="signup" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 500 }}>
          <SignupPattern />
        </TabsContent>
        <TabsContent value="errors" className="mt-4">
          <ErrorPagesPattern />
        </TabsContent>
      </Tabs>
    </div>
  )
}
