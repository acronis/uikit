import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsMultiple() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-2 font-semibold">Overview</h4>
          <p className="text-sm text-muted-foreground">
            View a summary of your account activity and key metrics.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-2 font-semibold">Analytics</h4>
          <p className="text-sm text-muted-foreground">
            Detailed analytics and insights about your performance.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports" className="mt-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-2 font-semibold">Reports</h4>
          <p className="text-sm text-muted-foreground">
            Generate and download custom reports.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications" className="mt-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-2 font-semibold">Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
