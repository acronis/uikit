import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

export function PopoverPlacements() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Top
        </PopoverTrigger>
        <PopoverContent side="top" className="w-64">
          <p className="text-sm">This popover appears on top.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Bottom
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-64">
          <p className="text-sm">This popover appears on bottom.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Left
        </PopoverTrigger>
        <PopoverContent side="left" className="w-64">
          <p className="text-sm">This popover appears on left.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Right
        </PopoverTrigger>
        <PopoverContent side="right" className="w-64">
          <p className="text-sm">This popover appears on right.</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
