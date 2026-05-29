import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsProduct() {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Product Description</h4>
          <p className="text-sm text-muted-foreground">
            This is a high-quality product designed to meet your needs. It features advanced
            technology and premium materials for long-lasting durability.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="mt-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Technical Specifications</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Dimensions: 10 x 5 x 2 inches</li>
            <li>Weight: 1.5 lbs</li>
            <li>Material: Premium aluminum</li>
            <li>Color: Space Gray</li>
          </ul>
        </div>
      </TabsContent>
      <TabsContent value="reviews" className="mt-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Customer Reviews</h4>
          <p className="text-sm text-muted-foreground">
            ⭐⭐⭐⭐⭐ 4.8 out of 5 stars (based on 127 reviews)
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
