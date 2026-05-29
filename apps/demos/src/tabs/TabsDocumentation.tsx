import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'

export function TabsDocumentation() {
  return (
    <Tabs defaultValue="getting-started" className="w-full">
      <TabsList>
        <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        <TabsTrigger value="api">API Reference</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>
      <TabsContent value="getting-started" className="mt-4">
        <div className="space-y-4 rounded-lg border p-6">
          <h4 className="font-semibold">Getting Started</h4>
          <p className="text-sm text-muted-foreground">
            Welcome! This guide will help you get up and running quickly.
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>Install the package</li>
            <li>Configure your environment</li>
            <li>Run your first command</li>
          </ol>
        </div>
      </TabsContent>
      <TabsContent value="api" className="mt-4">
        <div className="space-y-4 rounded-lg border p-6">
          <h4 className="font-semibold">API Reference</h4>
          <p className="text-sm text-muted-foreground">
            Complete API documentation with examples and parameters.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="examples" className="mt-4">
        <div className="space-y-4 rounded-lg border p-6">
          <h4 className="font-semibold">Code Examples</h4>
          <p className="text-sm text-muted-foreground">
            Practical examples to help you implement common use cases.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="faq" className="mt-4">
        <div className="space-y-4 rounded-lg border p-6">
          <h4 className="font-semibold">Frequently Asked Questions</h4>
          <p className="text-sm text-muted-foreground">Find answers to common questions.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
