import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

import { CalendarIcon } from '@acronis-platform/shadcn-uikit'
export function DatePickerFormats() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex flex-wrap gap-4">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'MM/dd/yyyy') : <span>MM/DD/YYYY</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd.MM.yyyy') : <span>DD.MM.YYYY</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy-MM-dd') : <span>YYYY-MM-DD</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}
