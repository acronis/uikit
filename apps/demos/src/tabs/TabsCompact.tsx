import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsCompact() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="h-9">
        <TabsTrigger value="all" className="text-xs">
          All
        </TabsTrigger>
        <TabsTrigger value="active" className="text-xs">
          Active
        </TabsTrigger>
        <TabsTrigger value="completed" className="text-xs">
          Completed
        </TabsTrigger>
        <TabsTrigger value="archived" className="text-xs">
          Archived
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <p className="text-sm">Showing all items</p>
      </TabsContent>
      <TabsContent value="active" className="mt-4">
        <p className="text-sm">Showing active items</p>
      </TabsContent>
      <TabsContent value="completed" className="mt-4">
        <p className="text-sm">Showing completed items</p>
      </TabsContent>
      <TabsContent value="archived" className="mt-4">
        <p className="text-sm">Showing archived items</p>
      </TabsContent>
    </Tabs>
  )
}
