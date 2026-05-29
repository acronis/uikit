import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressSizes() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm">Small (h-1)</p>
        <Progress value={50} className="h-1 w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Default (h-2)</p>
        <Progress value={50} className="h-2 w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Medium (h-3)</p>
        <Progress value={50} className="h-3 w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Large (h-4)</p>
        <Progress value={50} className="h-4 w-full" />
      </div>
    </div>
  )
}
