import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxStates() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-sm font-medium">Unchecked States</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="state-default" />
          <Label htmlFor="state-default" className="text-sm font-normal">
            Default
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="state-disabled-unchecked" disabled />
          <Label
            htmlFor="state-disabled-unchecked"
            className="text-sm font-normal text-[hsl(var(--checkbox-disabled-text)/0.4)]"
          >
            Disabled
          </Label>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Checked States</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="state-checked" checked />
          <Label htmlFor="state-checked" className="text-sm font-normal">
            Checked
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="state-indeterminate" checked="indeterminate" />
          <Label htmlFor="state-indeterminate" className="text-sm font-normal">
            Indeterminate
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="state-disabled-checked" disabled checked />
          <Label
            htmlFor="state-disabled-checked"
            className="text-sm font-normal text-[hsl(var(--checkbox-disabled-text)/0.4)]"
          >
            Disabled checked
          </Label>
        </div>
      </div>
    </div>
  )
}
