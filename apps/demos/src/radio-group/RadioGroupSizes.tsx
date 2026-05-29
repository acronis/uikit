import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupSizes() {
  return (
    <RadioGroup defaultValue="medium" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="small" id="size-small" />
        <Label htmlFor="size-small">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="medium" id="size-medium" />
        <Label htmlFor="size-medium">Medium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="large" id="size-large" />
        <Label htmlFor="size-large">Large</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="xlarge" id="size-xlarge" />
        <Label htmlFor="size-xlarge">X-Large</Label>
      </div>
    </RadioGroup>
  )
}
