import * as React from 'react'
import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupPriority() {
  const [value, setValue] = React.useState('medium')

  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="low" id="priority-low" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="priority-low">Low Priority</Label>
            <p className="text-sm text-muted-foreground">Can be completed when time permits.</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="medium" id="priority-medium" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="priority-medium">Medium Priority</Label>
            <p className="text-sm text-muted-foreground">Should be completed within a week.</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="high" id="priority-high" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="priority-high">High Priority</Label>
            <p className="text-sm text-muted-foreground">Needs immediate attention.</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="urgent" id="priority-urgent" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="priority-urgent">Urgent</Label>
            <p className="text-sm text-muted-foreground">
              Critical issue requiring immediate action.
            </p>
          </div>
        </div>
      </RadioGroup>
      <p className="text-sm text-gray-600">Selected priority: {value}</p>
    </div>
  )
}
