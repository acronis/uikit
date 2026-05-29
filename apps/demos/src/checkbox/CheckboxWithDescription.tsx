import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxWithDescription() {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox id="marketing" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="marketing"
          className="text-sm font-normal cursor-pointer text-[hsl(var(--checkbox-label))]"
        >
          Marketing emails
        </Label>
        <p className="text-sm text-[hsl(var(--checkbox-description)/0.7)]">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  )
}
