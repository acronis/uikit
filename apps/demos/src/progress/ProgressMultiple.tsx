import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressMultiple() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Downloading assets</span>
          <span className="text-gray-500">85%</span>
        </div>
        <Progress value={85} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Installing dependencies</span>
          <span className="text-gray-500">60%</span>
        </div>
        <Progress value={60} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Configuring settings</span>
          <span className="text-gray-500">40%</span>
        </div>
        <Progress value={40} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Running tests</span>
          <span className="text-gray-500">20%</span>
        </div>
        <Progress value={20} className="w-full" />
      </div>
    </div>
  )
}
