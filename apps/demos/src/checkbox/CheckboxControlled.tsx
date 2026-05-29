import * as React from 'react'
import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxControlled() {
  const [checked, setChecked] = React.useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="controlled" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="controlled" className="text-sm font-normal cursor-pointer">
          {checked ? 'Checked' : 'Unchecked'}
        </Label>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className="text-sm text-primary hover:underline"
      >
        Toggle checkbox
      </button>
    </div>
  )
}
