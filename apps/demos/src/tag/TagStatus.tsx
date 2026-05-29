import { Tag } from '@acronis-platform/shadcn-uikit/react'
import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  TimesCircleIcon,
  WarningCircleIcon,
} from '@acronis-platform/shadcn-uikit'
export function TagStatus() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<CheckCircleIcon className="h-4 w-4" />}>
        Completed
      </Tag>
      <Tag variant="info" icon={<ClockIcon className="h-4 w-4" />}>
        In Progress
      </Tag>
      <Tag variant="warning" icon={<WarningCircleIcon className="h-4 w-4" />}>
        Pending
      </Tag>
      <Tag variant="danger" icon={<TimesCircleIcon className="h-4 w-4" />}>
        Failed
      </Tag>
      <Tag variant="neutral" icon={<CircleIcon className="h-4 w-4" />}>
        Draft
      </Tag>
    </div>
  )
}
