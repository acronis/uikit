import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

import { CalendarIcon } from '@acronis-platform/shadcn-uikit'
export function DatePickerSmall() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'h-8 w-[240px] justify-start text-left text-sm font-normal',
              !date && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-3 w-3" />
        {date ? format(date, 'PP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
