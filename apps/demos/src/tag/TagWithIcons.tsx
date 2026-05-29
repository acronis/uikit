import { Tag } from '@acronis-platform/shadcn-uikit/react'
import {
  CheckCircleIcon,
  CircleIcon,
  ExclamationCircleIcon,
  InfoIcon,
  TimesCircleIcon,
  WarningCircleIcon,
} from '@acronis-platform/shadcn-uikit'
export function TagWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<CheckCircleIcon className="h-4 w-4" />}>
        Active
      </Tag>
      <Tag variant="info" icon={<InfoIcon className="h-4 w-4" />}>
        Info
      </Tag>
      <Tag variant="warning" icon={<WarningCircleIcon className="h-4 w-4" />}>
        Warning
      </Tag>
      <Tag variant="critical" icon={<ExclamationCircleIcon className="h-4 w-4" />}>
        Critical
      </Tag>
      <Tag variant="danger" icon={<TimesCircleIcon className="h-4 w-4" />}>
        Error
      </Tag>
      <Tag variant="neutral" icon={<CircleIcon className="h-4 w-4" />}>
        Neutral
      </Tag>
    </div>
  )
}
