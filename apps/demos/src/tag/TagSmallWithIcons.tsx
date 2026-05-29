import { Tag } from '@acronis-platform/shadcn-uikit/react'
import {
  CheckCircleIcon,
  CircleIcon,
  ExclamationCircleIcon,
  InfoIcon,
  TimesCircleIcon,
  WarningCircleIcon,
} from '@acronis-platform/shadcn-uikit'
export function TagSmallWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" size="small" icon={<CheckCircleIcon className="size-3" />}>
        Active
      </Tag>
      <Tag variant="info" size="small" icon={<InfoIcon className="size-3" />}>
        Info
      </Tag>
      <Tag variant="warning" size="small" icon={<WarningCircleIcon className="size-3" />}>
        Warning
      </Tag>
      <Tag variant="critical" size="small" icon={<ExclamationCircleIcon className="size-3" />}>
        Critical
      </Tag>
      <Tag variant="danger" size="small" icon={<TimesCircleIcon className="size-3" />}>
        Error
      </Tag>
      <Tag variant="neutral" size="small" icon={<CircleIcon className="size-3" />}>
        Neutral
      </Tag>
    </div>
  )
}
