import * as React from 'react'
import {
  CalendarSingle,
  CalendarMultiple,
  CalendarRange,
  CalendarDualMonth,
  CalendarDropdown,
  CalendarDisabled,
  CalendarWeekNumbers,
  CalendarCustomStart,
  CalendarNoOutside,
  CalendarFixedWeeks,
  CalendarWeekStart,
  CalendarMinMax,
} from '@acronis-platform/shadcn-uikit-demos/calendar'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import calendarSingleCode from '../../../demos/src/calendar/CalendarSingle.tsx?raw'
import calendarMultipleCode from '../../../demos/src/calendar/CalendarMultiple.tsx?raw'
import calendarRangeCode from '../../../demos/src/calendar/CalendarRange.tsx?raw'
import calendarDualMonthCode from '../../../demos/src/calendar/CalendarDualMonth.tsx?raw'
import calendarDropdownCode from '../../../demos/src/calendar/CalendarDropdown.tsx?raw'
import calendarDisabledCode from '../../../demos/src/calendar/CalendarDisabled.tsx?raw'
import calendarWeekNumbersCode from '../../../demos/src/calendar/CalendarWeekNumbers.tsx?raw'
import calendarCustomStartCode from '../../../demos/src/calendar/CalendarCustomStart.tsx?raw'
import calendarNoOutsideCode from '../../../demos/src/calendar/CalendarNoOutside.tsx?raw'
import calendarFixedWeeksCode from '../../../demos/src/calendar/CalendarFixedWeeks.tsx?raw'
import calendarWeekStartCode from '../../../demos/src/calendar/CalendarWeekStart.tsx?raw'
import calendarMinMaxCode from '../../../demos/src/calendar/CalendarMinMax.tsx?raw'

export function CalendarDemo() {
  return (
    <section className="demo-section">
      <h2>Calendar Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A date calendar component that allows users to select dates with various modes and
        configurations.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Single Date Selection"
          description="Select a single date from the calendar."
          code={calendarSingleCode}
        >
          <CalendarSingle />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Date Selection"
          description="Select multiple dates from the calendar."
          code={calendarMultipleCode}
        >
          <CalendarMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="Date Range Selection"
          description="Select a range of dates (from and to)."
          code={calendarRangeCode}
        >
          <CalendarRange />
        </DemoWithCode>

        <DemoWithCode
          title="Dual Month View"
          description="Display two months side by side for easier range selection."
          code={calendarDualMonthCode}
        >
          <CalendarDualMonth />
        </DemoWithCode>

        <DemoWithCode
          title="With Dropdown Navigation"
          description="Calendar with month and year dropdown selectors."
          code={calendarDropdownCode}
        >
          <CalendarDropdown />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled Dates"
          description="Calendar with certain dates disabled (past dates in this example)."
          code={calendarDisabledCode}
        >
          <CalendarDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="With Week Numbers"
          description="Display week numbers alongside the calendar."
          code={calendarWeekNumbersCode}
        >
          <CalendarWeekNumbers />
        </DemoWithCode>

        <DemoWithCode
          title="Custom Start Month"
          description="Calendar starting at a specific month and year."
          code={calendarCustomStartCode}
        >
          <CalendarCustomStart />
        </DemoWithCode>

        <DemoWithCode
          title="Without Outside Days"
          description="Calendar that doesn't show days from adjacent months."
          code={calendarNoOutsideCode}
        >
          <CalendarNoOutside />
        </DemoWithCode>

        <DemoWithCode
          title="Fixed Weeks"
          description="Calendar that always shows 6 weeks for consistent height."
          code={calendarFixedWeeksCode}
        >
          <CalendarFixedWeeks />
        </DemoWithCode>

        <DemoWithCode
          title="Custom Week Start Day"
          description="Calendar starting the week on Sunday instead of Monday."
          code={calendarWeekStartCode}
        >
          <CalendarWeekStart />
        </DemoWithCode>

        <DemoWithCode
          title="Date Range with Min/Max"
          description="Calendar with minimum and maximum selectable dates."
          code={calendarMinMaxCode}
        >
          <CalendarMinMax />
        </DemoWithCode>
      </div>
    </section>
  );
}
