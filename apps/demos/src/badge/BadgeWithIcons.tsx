import { Badge } from '@acronis-platform/shadcn-uikit/react'

export function BadgeWithIcons() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="success" className="gap-1">
        <span className="text-xs">✓</span> Success
      </Badge>
      <Badge variant="info" className="gap-1">
        <span className="text-xs">ℹ</span> Info
      </Badge>
      <Badge variant="warning" className="gap-1">
        <span className="text-xs">⚠</span> Warning
      </Badge>
      <Badge variant="danger" className="gap-1">
        <span className="text-xs">✕</span> Danger
      </Badge>
    </div>
  )
}
