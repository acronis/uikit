import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsDisabled() {
  return (
    <Tabs defaultValue="available" className="w-full">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="available" className="mt-4">
        <p>This tab is available.</p>
      </TabsContent>
      <TabsContent value="disabled" className="mt-4">
        <p>This content is not accessible.</p>
      </TabsContent>
      <TabsContent value="another" className="mt-4">
        <p>Another available tab.</p>
      </TabsContent>
    </Tabs>
  )
}
