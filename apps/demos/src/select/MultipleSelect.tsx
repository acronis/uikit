import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit';
import { Label } from '@acronis-platform/shadcn-uikit/react'

export function MultipleSelect() {
  const [values, setValues] = React.useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Multiple)</Label>
        <Select
          value={values}
          onValueChange={(newValues) => setValues(newValues as string[])}
          multiple
        >
          <SelectTrigger id="tags" className="w-[280px]">
            <SelectValue placeholder="Select tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="tailwind">Tailwind CSS</SelectItem>
            <SelectItem value="nextjs">Next.js</SelectItem>
            <SelectItem value="vite">Vite</SelectItem>
            <SelectItem value="nodejs">Node.js</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {values.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p>Selected tags: {values.join(', ')}</p>
        </div>
      )}
    </div>
  )
}
