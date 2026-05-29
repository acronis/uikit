import { Tag } from '@acronis-platform/shadcn-uikit/react'

export function TagDefault() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success">Success</Tag>
      <Tag variant="info">Info</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="critical">Critical</Tag>
      <Tag variant="danger">Danger</Tag>
      <Tag variant="neutral">Neutral</Tag>
    </div>
  )
}
