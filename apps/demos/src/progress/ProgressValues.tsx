import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressValues() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>25% Complete</span>
          <span className="text-gray-500">25%</span>
        </div>
        <Progress value={25} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>50% Complete</span>
          <span className="text-gray-500">50%</span>
        </div>
        <Progress value={50} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>75% Complete</span>
          <span className="text-gray-500">75%</span>
        </div>
        <Progress value={75} className="w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Task Completed</span>
          <span className="text-gray-500">100%</span>
        </div>
        <Progress value={100} className="w-full" />
      </div>
    </div>
  )
}
