import * as React from 'react'
import {
  AuthLayout, AuthLayoutCard,
  Button,
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@acronis-platform/shadcn-uikit/react'

function Error404() {
  return (
    <AuthLayout>
      <AuthLayoutCard className="text-center">
        <div className="mb-4 text-6xl font-bold text-muted-foreground/30">404</div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button>Go to Dashboard</Button>
        <p className="mt-4 text-xs text-muted-foreground">
          <a href="#" className="underline">Report this issue</a>
        </p>
      </AuthLayoutCard>
    </AuthLayout>
  )
}

function Error500() {
  return (
    <AuthLayout>
      <AuthLayoutCard className="text-center">
        <div className="mb-4 text-6xl font-bold text-muted-foreground/30">500</div>
        <h1 className="text-2xl font-bold mb-2">Server error</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Something went wrong on our end. Please try again in a moment.
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline">Try Again</Button>
          <Button>Contact Support</Button>
        </div>
      </AuthLayoutCard>
    </AuthLayout>
  )
}

function Error403() {
  return (
    <AuthLayout>
      <AuthLayoutCard className="text-center">
        <div className="mb-4 text-6xl font-bold text-muted-foreground/30">403</div>
        <h1 className="text-2xl font-bold mb-2">Access denied</h1>
        <p className="text-sm text-muted-foreground mb-6">
          You don&apos;t have permission to view this page. Contact your administrator.
        </p>
        <Button>Go Back</Button>
      </AuthLayoutCard>
    </AuthLayout>
  )
}

export function ErrorPagesPattern() {
  return (
    <div className="p-4">
      <Tabs defaultValue="404">
        <TabsList>
          <TabsTrigger value="404">404 Not Found</TabsTrigger>
          <TabsTrigger value="500">500 Server Error</TabsTrigger>
          <TabsTrigger value="403">403 Forbidden</TabsTrigger>
        </TabsList>
        <TabsContent value="404" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 320 }}>
          <Error404 />
        </TabsContent>
        <TabsContent value="500" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 320 }}>
          <Error500 />
        </TabsContent>
        <TabsContent value="403" className="mt-4 border rounded-lg overflow-hidden" style={{ minHeight: 320 }}>
          <Error403 />
        </TabsContent>
      </Tabs>
    </div>
  )
}
