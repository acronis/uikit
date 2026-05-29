import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

export function PopoverAlignments() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Align Start
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <p className="text-sm">Aligned to the start.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Align Center
        </PopoverTrigger>
        <PopoverContent align="center" className="w-64">
          <p className="text-sm">Aligned to the center.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Align End
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <p className="text-sm">Aligned to the end.</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
