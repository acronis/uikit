import * as React from 'react'
import { Switch, Label } from '@acronis-platform/shadcn-uikit/react'

export function SwitchControlled() {
  const [enabled, setEnabled] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="feature" checked={enabled} onCheckedChange={setEnabled} />
        <Label htmlFor="feature">Enable Feature</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        Status: {enabled ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  )
}
