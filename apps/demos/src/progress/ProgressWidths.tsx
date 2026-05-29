import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressWidths() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm">Small width</p>
        <Progress value={50} className="w-48" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Medium width</p>
        <Progress value={50} className="w-64" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Large width</p>
        <Progress value={50} className="w-96" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Full width</p>
        <Progress value={50} className="w-full" />
      </div>
    </div>
  )
}
