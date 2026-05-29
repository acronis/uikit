import * as React from 'react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

type DateRange = { from: Date | undefined; to?: Date | undefined }

export function CalendarRange() {
  const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  return (
    <div>
      <div className="flex justify-center rounded-lg border p-4">
        <Calendar
          mode="range"
          selected={rangeDate}
          onSelect={(range) => setRangeDate(range || { from: undefined, to: undefined })}
        />
      </div>
      {rangeDate.from && (
        <p className="mt-4 text-sm text-gray-600">
          Selected range:{' '}
          <strong>
            {rangeDate.from.toLocaleDateString()}
            {rangeDate.to && ` - ${rangeDate.to.toLocaleDateString()}`}
          </strong>
        </p>
      )}
    </div>
  )
}
