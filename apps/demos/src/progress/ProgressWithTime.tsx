import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressWithTime() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm">12 minutes remaining...</p>
        <Progress value={30} className="w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">5 minutes remaining...</p>
        <Progress value={60} className="w-full" />
      </div>

      <div className="space-y-2">
        <p className="text-sm">Almost done...</p>
        <Progress value={90} className="w-full" />
      </div>
    </div>
  )
}
