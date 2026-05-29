import { Badge } from '@acronis-platform/shadcn-uikit/react'

export function BadgeDefaultVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
