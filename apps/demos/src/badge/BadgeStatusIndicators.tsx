import { Badge } from '@acronis-platform/shadcn-uikit/react'

export function BadgeStatusIndicators() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg border p-3">
        <span className="text-sm">Server Status</span>
        <Badge variant="success">Online</Badge>
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <span className="text-sm">Database Connection</span>
        <Badge variant="info">Connected</Badge>
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <span className="text-sm">API Response Time</span>
        <Badge variant="warning">Slow</Badge>
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <span className="text-sm">Disk Space</span>
        <Badge variant="critical">Low</Badge>
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <span className="text-sm">Service Health</span>
        <Badge variant="danger">Down</Badge>
      </div>
    </div>
  )
}
