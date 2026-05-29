import * as React from 'react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

export function CalendarDropdown() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex justify-center rounded-lg border p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        fromYear={1900}
        toYear={2100}
      />
    </div>
  )
}
