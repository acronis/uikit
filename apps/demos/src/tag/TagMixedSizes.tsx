import { Tag } from '@acronis-platform/shadcn-uikit/react'
import { CheckCircleIcon, ClockIcon } from '@acronis-platform/shadcn-uikit'
export function TagMixedSizes() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Project Alpha</h4>
          <Tag variant="success" icon={<CheckCircleIcon className="h-4 w-4" />}>
            Active
          </Tag>
        </div>
        <p className="mb-3 text-sm text-gray-600">
          A high-priority project with multiple components.
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag variant="danger" size="small">
            Urgent
          </Tag>
          <Tag variant="info" size="small">
            Frontend
          </Tag>
          <Tag variant="success" size="small">
            Backend
          </Tag>
          <Tag variant="warning" size="small">
            v2.0
          </Tag>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Project Beta</h4>
          <Tag variant="warning" icon={<ClockIcon className="h-4 w-4" />}>
            In Progress
          </Tag>
        </div>
        <p className="mb-3 text-sm text-gray-600">
          A medium-priority project in development phase.
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag variant="info" size="small">
            Medium
          </Tag>
          <Tag variant="neutral" size="small">
            Design
          </Tag>
          <Tag variant="info" size="small">
            Development
          </Tag>
          <Tag variant="warning" size="small">
            Beta
          </Tag>
        </div>
      </div>
    </div>
  )
}
