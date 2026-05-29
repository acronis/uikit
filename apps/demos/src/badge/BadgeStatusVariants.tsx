import { Badge } from '@acronis-platform/shadcn-uikit/react'

export function BadgeStatusVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="success">Success</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="critical">Critical</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="ai">AI</Badge>
      <Badge variant="ai-solid">AI</Badge>
    </div>
  )
}
