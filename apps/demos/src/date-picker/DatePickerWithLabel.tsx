import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

import { CalendarIcon } from '@acronis-platform/shadcn-uikit'
export function DatePickerWithLabel() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="space-y-2">
      <label htmlFor="birth-date" className="text-sm font-medium">
        Date of Birth
      </label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="birth-date"
              variant="outline"
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Select your birth date</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            defaultMonth={new Date(1990, 0)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
