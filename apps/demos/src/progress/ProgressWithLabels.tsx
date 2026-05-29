import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressWithLabels() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm">Uploading files...</p>
        <Progress value={33} className="w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Processing data...</p>
        <Progress value={67} className="w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Installation complete</p>
        <Progress value={100} className="w-full" />
      </div>
    </div>
  )
}
