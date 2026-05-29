import * as React from 'react'
import { ButtonGroup } from '@acronis-platform/shadcn-uikit/react'

export function ButtonGroupDaySelectorSmall() {
  const [selectedDay, setSelectedDay] = React.useState<string>('Mon')
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <ButtonGroup className="border border-border/30 rounded bg-background p-1 h-8">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`px-2 text-sm font-semibold leading-6 transition-colors rounded ${
            selectedDay === day
              ? 'bg-primary text-primary-foreground'
              : 'text-primary hover:bg-accent/5'
          }`}
        >
          {day}
        </button>
      ))}
    </ButtonGroup>
  )
}
