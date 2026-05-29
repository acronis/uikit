import { Tag } from '@acronis-platform/shadcn-uikit/react'

export function TagSmall() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" size="small">
        Success
      </Tag>
      <Tag variant="info" size="small">
        Info
      </Tag>
      <Tag variant="warning" size="small">
        Warning
      </Tag>
      <Tag variant="critical" size="small">
        Critical
      </Tag>
      <Tag variant="danger" size="small">
        Danger
      </Tag>
      <Tag variant="neutral" size="small">
        Neutral
      </Tag>
    </div>
  )
}
