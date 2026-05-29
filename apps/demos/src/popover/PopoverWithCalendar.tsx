import * as React from 'react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

export function PopoverWithCalendar() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex justify-center rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          {date ? date.toLocaleDateString() : 'Pick a date'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}
