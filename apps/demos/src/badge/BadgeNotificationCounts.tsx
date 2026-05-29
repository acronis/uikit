import { Badge } from '@acronis-platform/shadcn-uikit/react'

export function BadgeNotificationCounts() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="relative">
        <button className="rounded-lg border p-3">Messages</button>
        <Badge
          variant="danger"
          className="absolute -right-2 -top-2 rounded-full px-2 py-0.5 text-[10px]"
        >
          5
        </Badge>
      </div>
      <div className="relative">
        <button className="rounded-lg border p-3">Notifications</button>
        <Badge
          variant="info"
          className="absolute -right-2 -top-2 rounded-full px-2 py-0.5 text-[10px]"
        >
          12
        </Badge>
      </div>
      <div className="relative">
        <button className="rounded-lg border p-3">Updates</button>
        <Badge
          variant="success"
          className="absolute -right-2 -top-2 rounded-full px-2 py-0.5 text-[10px]"
        >
          3
        </Badge>
      </div>
    </div>
  )
}
