import * as React from 'react'
import { Switch, Label } from '@acronis-platform/shadcn-uikit/react'

export function SwitchForm() {
  const [notifications, setNotifications] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)
  const [social, setSocial] = React.useState(true)

  return (
    <div className="max-w-md space-y-6 rounded-lg border p-6">
      <div>
        <h4 className="mb-4 font-semibold">Notification Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your device.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new products and features.
              </p>
            </div>
            <Switch id="marketing" checked={marketing} onCheckedChange={setMarketing} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="social">Social Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone follows you.
              </p>
            </div>
            <Switch id="social" checked={social} onCheckedChange={setSocial} />
          </div>
        </div>
      </div>
    </div>
  )
}
