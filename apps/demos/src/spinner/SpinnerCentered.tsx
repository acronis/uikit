import { Spinner } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerCentered() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-12">
      <Spinner size="lg" />
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  )
}
