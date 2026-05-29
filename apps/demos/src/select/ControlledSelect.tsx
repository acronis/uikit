import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit';
import { Label } from '@acronis-platform/shadcn-uikit/react'

export function ControlledSelect() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="framework">Framework</Label>
        <Select value={value} onValueChange={(newValue) => setValue(newValue as string)}>
          <SelectTrigger id="framework" className="w-[280px]">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {value && <p className="text-sm text-muted-foreground">Selected framework: {value}</p>}
    </div>
  )
}
