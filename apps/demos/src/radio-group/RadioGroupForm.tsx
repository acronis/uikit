import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupForm() {
  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <div className="space-y-2">
        <h4 className="font-semibold">Notification Preferences</h4>
        <p className="text-sm text-gray-600">How would you like to receive notifications?</p>
      </div>
      <RadioGroup defaultValue="email">
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="email" id="notify-email" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="notify-email">Email</Label>
            <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="sms" id="notify-sms" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="notify-sms">SMS</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via text message.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="push" id="notify-push" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="notify-push">Push Notification</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications on your device.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="none" id="notify-none" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="notify-none">None</Label>
            <p className="text-sm text-muted-foreground">Do not send me any notifications.</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
