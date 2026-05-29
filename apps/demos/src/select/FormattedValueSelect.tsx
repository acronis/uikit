import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit';
import { Label } from '@acronis-platform/shadcn-uikit/react'

export function FormattedValueSelect() {
  const [value, setValue] = React.useState<string>('')

  const _formatValue = (val: string) => {
    if (!val) return ''
    return `Selected: ${val.toUpperCase()}`
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Select value={value} onValueChange={(newValue) => setValue(newValue as string)}>
          <SelectTrigger id="color" className="w-[280px]">
            <SelectValue placeholder="Select a color">
              {value && (
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: value }}
                  />
                  {value}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="#ef4444">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border bg-red-500" />
                Red
              </span>
            </SelectItem>
            <SelectItem value="#3b82f6">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border bg-blue-500" />
                Blue
              </span>
            </SelectItem>
            <SelectItem value="#22c55e">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border bg-green-500" />
                Green
              </span>
            </SelectItem>
            <SelectItem value="#eab308">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border bg-yellow-500" />
                Yellow
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
