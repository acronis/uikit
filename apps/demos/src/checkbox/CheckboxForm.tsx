import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxForm() {
  return (
    <form className="space-y-4 rounded-lg border p-4">
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="notifications" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="notifications"
              className="text-sm font-normal cursor-pointer text-[hsl(var(--checkbox-label))]"
            >
              Enable notifications
            </Label>
            <p className="text-sm text-[hsl(var(--checkbox-description)/0.7)]">
              Get notified when someone mentions you
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="updates" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="updates"
              className="text-sm font-normal cursor-pointer text-[hsl(var(--checkbox-label))]"
            >
              Product updates
            </Label>
            <p className="text-sm text-[hsl(var(--checkbox-description)/0.7)]">
              Receive updates about new features
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="newsletter" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="newsletter"
              className="text-sm font-normal cursor-pointer text-[hsl(var(--checkbox-label))]"
            >
              Newsletter
            </Label>
            <p className="text-sm text-[hsl(var(--checkbox-description)/0.7)]">
              Weekly digest of what&apos;s new
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
