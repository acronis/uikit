import { Tag } from '@acronis-platform/shadcn-uikit/react'

export function TagCategory() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="info">Frontend</Tag>
      <Tag variant="success">Backend</Tag>
      <Tag variant="warning">Database</Tag>
      <Tag variant="critical">DevOps</Tag>
      <Tag variant="neutral">Design</Tag>
    </div>
  )
}
