import { Badge } from '@acronis-platform/shadcn-uikit/react'

export function BadgeSmall() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="success" className="text-[10px] py-0">
        TAG
      </Badge>
      <Badge variant="info" className="text-[10px] py-0">
        TAG
      </Badge>
      <Badge variant="warning" className="text-[10px] py-0">
        TAG
      </Badge>
      <Badge variant="critical" className="text-[10px] py-0">
        TAG
      </Badge>
      <Badge variant="danger" className="text-[10px] py-0">
        TAG
      </Badge>
      <Badge variant="neutral" className="text-[10px] py-0">
        TAG
      </Badge>
    </div>
  )
}
