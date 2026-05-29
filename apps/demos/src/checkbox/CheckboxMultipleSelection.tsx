import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxMultipleSelection() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <p className="text-sm font-medium mb-3">Select your interests:</p>
      <div className="flex items-center space-x-2">
        <Checkbox id="design" />
        <Label htmlFor="design" className="text-sm font-normal cursor-pointer">
          Design
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="development" />
        <Label htmlFor="development" className="text-sm font-normal cursor-pointer">
          Development
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="text-sm font-normal cursor-pointer">
          Marketing
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="sales" />
        <Label htmlFor="sales" className="text-sm font-normal cursor-pointer">
          Sales
        </Label>
      </div>
    </div>
  )
}
