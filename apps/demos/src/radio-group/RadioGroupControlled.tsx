import * as React from 'react'
import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupControlled() {
  const [value, setValue] = React.useState('option-one')

  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="r1-option-one" />
          <Label htmlFor="r1-option-one">Option One</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="r1-option-two" />
          <Label htmlFor="r1-option-two">Option Two</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-three" id="r1-option-three" />
          <Label htmlFor="r1-option-three">Option Three</Label>
        </div>
      </RadioGroup>
      <p className="text-sm text-gray-600">Selected: {value}</p>
    </div>
  )
}
