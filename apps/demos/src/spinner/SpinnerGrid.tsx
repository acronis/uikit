import { Spinner, Button } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-lg border p-6 flex flex-col items-center justify-center gap-3">
        <Spinner size="md" />
        <p className="text-sm text-center text-muted-foreground">Data is loading</p>
      </div>
      <div className="rounded-lg border p-6 flex flex-col items-center justify-center gap-3">
        <Spinner size="md" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Data is loading
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Wait until it is completed.
          </p>
        </div>
      </div>
      <div className="rounded-lg border p-6 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Data is loading
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Wait until it is completed.
          </p>
          <Button variant="outline" size="sm" className="mt-3">
            Action
          </Button>
        </div>
      </div>
      <div className="rounded-lg border p-6">
        <div className="flex items-start gap-3">
          <Spinner size="sm" className="mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Processing request
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
