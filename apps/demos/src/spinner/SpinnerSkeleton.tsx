import { Spinner } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center gap-3 p-3 rounded border">
          <Spinner size="sm" />
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
