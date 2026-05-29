import * as React from 'react'
import { Calendar } from '@acronis-platform/shadcn-uikit/react'

export function CalendarMultiple() {
  const [multipleDate, setMultipleDate] = React.useState<Date[]>([])

  return (
    <div>
      <div className="flex justify-center rounded-lg border p-4">
        <Calendar mode="multiple" selected={multipleDate} onSelect={setMultipleDate} />
      </div>
      {multipleDate.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Selected dates:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {multipleDate.map((d, i) => (
              <span key={i} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                {d.toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
