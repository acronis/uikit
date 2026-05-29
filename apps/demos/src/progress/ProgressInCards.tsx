import { Progress } from '@acronis-platform/shadcn-uikit/react'

export function ProgressInCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-semibold">Project Alpha</h4>
        <p className="mb-4 text-sm text-gray-600">Development in progress</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-gray-500">65%</span>
          </div>
          <Progress value={65} className="w-full" />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-semibold">Project Beta</h4>
        <p className="mb-4 text-sm text-gray-600">Testing phase</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-gray-500">90%</span>
          </div>
          <Progress value={90} className="w-full" />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-semibold">Project Gamma</h4>
        <p className="mb-4 text-sm text-gray-600">Planning stage</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-gray-500">25%</span>
          </div>
          <Progress value={25} className="w-full" />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-semibold">Project Delta</h4>
        <p className="mb-4 text-sm text-gray-600">Completed</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-gray-500">100%</span>
          </div>
          <Progress value={100} className="w-full" />
        </div>
      </div>
    </div>
  )
}
