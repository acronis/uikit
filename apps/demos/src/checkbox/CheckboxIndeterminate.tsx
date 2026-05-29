import * as React from 'react'
import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxIndeterminate() {
  const [indeterminate, setIndeterminate] = React.useState<boolean | 'indeterminate'>(
    'indeterminate'
  )

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="indeterminate"
        checked={indeterminate}
        onCheckedChange={setIndeterminate}
      />
      <Label htmlFor="indeterminate" className="text-sm font-normal cursor-pointer">
        {indeterminate === 'indeterminate'
          ? 'Indeterminate'
          : indeterminate
            ? 'Checked'
            : 'Unchecked'}
      </Label>
    </div>
  )
}
