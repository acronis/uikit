import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorInForms() {
  return (
    <div className="max-w-md space-y-6 rounded-lg border p-6">
      <div className="space-y-2">
        <h4 className="font-semibold">Personal Information</h4>
        <p className="text-sm text-muted-foreground">Enter your personal details</p>
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="font-semibold">Contact Information</h4>
        <p className="text-sm text-muted-foreground">How can we reach you?</p>
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="font-semibold">Preferences</h4>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </div>
    </div>
  )
}
