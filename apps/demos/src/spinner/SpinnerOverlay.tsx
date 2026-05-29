import * as React from 'react'
import { Spinner, Button } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerOverlay() {
  const [dataLoading, setDataLoading] = React.useState(false)

  return (
    <div className="relative rounded-lg border p-8">
      <div className="space-y-4">
        <h4 className="font-medium">Content Area</h4>
        <p className="text-sm text-muted-foreground">
          This is some content that will be covered by the loading overlay.
        </p>
        <Button onClick={() => setDataLoading(!dataLoading)}>
          {dataLoading ? 'Hide' : 'Show'} Loading Overlay
        </Button>
      </div>
      {dataLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}
