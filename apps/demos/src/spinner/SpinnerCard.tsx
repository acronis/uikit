import * as React from 'react'
import { Spinner, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerCard() {
  const [dataLoading, setDataLoading] = React.useState(false)

  const simulateDataLoad = () => {
    setDataLoading(true)
    setTimeout(() => setDataLoading(false), 2000)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>View your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground mt-4">
              Loading profile data...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">John Doe</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
            <Button onClick={simulateDataLoad} variant="outline" className="w-full">
              Reload Data
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
