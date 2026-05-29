import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsFullWidth() {
  return (
    <Tabs defaultValue="first" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second">Second</TabsTrigger>
        <TabsTrigger value="third">Third</TabsTrigger>
        <TabsTrigger value="fourth">Fourth</TabsTrigger>
        <TabsTrigger value="last">Last</TabsTrigger>
      </TabsList>
      <TabsContent value="first" className="mt-4">
        <p>First tab content</p>
      </TabsContent>
      <TabsContent value="second" className="mt-4">
        <p>Second tab content</p>
      </TabsContent>
      <TabsContent value="third" className="mt-4">
        <p>Third tab content</p>
      </TabsContent>
      <TabsContent value="fourth" className="mt-4">
        <p>Fourth tab content</p>
      </TabsContent>
      <TabsContent value="last" className="mt-4">
        <p>Last tab content</p>
      </TabsContent>
    </Tabs>
  )
}
