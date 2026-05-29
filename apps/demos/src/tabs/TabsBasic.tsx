import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsBasic() {
  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="mt-4">
        <p>Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2" className="mt-4">
        <p>Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3" className="mt-4">
        <p>Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  )
}
