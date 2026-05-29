import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

type DateRange = { from: Date | undefined; to?: Date | undefined }

import { CalendarIcon } from '@acronis-platform/shadcn-uikit'
export function DatePickerRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'w-[320px] justify-start text-left font-normal',
              !dateRange.from && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateRange.from ? (
          dateRange.to ? (
            <>
              {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
            </>
          ) : (
            format(dateRange.from, 'LLL dd, y')
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
