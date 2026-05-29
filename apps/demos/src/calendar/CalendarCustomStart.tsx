import * as React from 'react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

export function CalendarCustomStart() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex justify-center rounded-lg border p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(1990, 0)}
      />
    </div>
  )
}
