import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'
import { Button, Label } from '@acronis-platform/shadcn-uikit/react'

export function TabsDashboard() {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="mt-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h5 className="mb-2 text-sm font-medium">Total Users</h5>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="rounded-lg border p-4">
            <h5 className="mb-2 text-sm font-medium">Active Sessions</h5>
            <p className="text-2xl font-bold">567</p>
          </div>
          <div className="rounded-lg border p-4">
            <h5 className="mb-2 text-sm font-medium">Revenue</h5>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="activity" className="mt-4">
        <div className="space-y-2 rounded-lg border p-4">
          <p className="text-sm">
            <span className="font-medium">User123</span> logged in
          </p>
          <p className="text-sm">
            <span className="font-medium">User456</span> completed a purchase
          </p>
          <p className="text-sm">
            <span className="font-medium">User789</span> updated their profile
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="mt-4">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Label>Privacy Settings</Label>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
