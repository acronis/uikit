import * as React from 'react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

export function CalendarMinMax() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div>
      <div className="flex justify-center rounded-lg border p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={new Date()}
          toDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Only dates within the next 3 months can be selected.
      </p>
    </div>
  )
}
