import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxDisabled() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label
          htmlFor="disabled-unchecked"
          className="text-sm font-normal text-[hsl(var(--checkbox-disabled-text)/0.4)]"
        >
          Disabled unchecked
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked />
        <Label
          htmlFor="disabled-checked"
          className="text-sm font-normal text-[hsl(var(--checkbox-disabled-text)/0.4)]"
        >
          Disabled checked
        </Label>
      </div>
    </div>
  )
}
