import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

import { CalendarIcon } from '@acronis-platform/shadcn-uikit'
export function DatePickerPresets() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, 'PPP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="border-r p-3 space-y-2">
            <p className="text-sm font-medium">Quick Select</p>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => setDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  setDate(tomorrow)
                }}
              >
                Tomorrow
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  const nextWeek = new Date()
                  nextWeek.setDate(nextWeek.getDate() + 7)
                  setDate(nextWeek)
                }}
              >
                In a week
              </Button>
            </div>
          </div>
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </div>
      </PopoverContent>
    </Popover>
  )
}
