import { Tag } from '@acronis-platform/shadcn-uikit/react'

export function TagVersion() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" size="small">
        v2.0
      </Tag>
      <Tag variant="info" size="small">
        v1.5
      </Tag>
      <Tag variant="neutral" size="small">
        v1.0
      </Tag>
      <Tag variant="warning" size="small">
        Deprecated
      </Tag>
    </div>
  )
}
