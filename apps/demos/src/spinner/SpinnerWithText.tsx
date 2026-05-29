import { Spinner } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerWithText() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Spinner size="sm" />
        <span className="text-sm text-muted-foreground">Loading data...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="md" />
        <span className="text-sm text-muted-foreground">Please wait...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="lg" />
        <span className="text-base text-muted-foreground">Loading content...</span>
      </div>
    </div>
  )
}
