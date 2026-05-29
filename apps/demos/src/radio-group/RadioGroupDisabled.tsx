import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="r3-option-one" />
        <Label htmlFor="r3-option-one">Available Option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="r3-option-two" disabled />
        <Label htmlFor="r3-option-two" className="opacity-50">
          Disabled Option
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="r3-option-three" />
        <Label htmlFor="r3-option-three">Another Available Option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-four" id="r3-option-four" disabled />
        <Label htmlFor="r3-option-four" className="opacity-50">
          Another Disabled Option
        </Label>
      </div>
    </RadioGroup>
  )
}
