import * as React from 'react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

export function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div>
      <div className="flex justify-center rounded-lg border p-4">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
      {date && (
        <p className="mt-4 text-sm text-gray-600">
          Selected date: <strong>{date.toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  )
}
