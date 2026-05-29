import * as React from 'react'
import {
  DatePickerBasic,
  DatePickerSmall,
  DatePickerWithLabel,
  DatePickerRange,
  DatePickerForm,
  DatePickerFormats,
  DatePickerPresets,
  DatePickerDisabled,
} from '@acronis-platform/shadcn-uikit-demos/date-picker'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import datePickerBasicCode from '../../../demos/src/date-picker/DatePickerBasic.tsx?raw'
import datePickerSmallCode from '../../../demos/src/date-picker/DatePickerSmall.tsx?raw'
import datePickerWithLabelCode from '../../../demos/src/date-picker/DatePickerWithLabel.tsx?raw'
import datePickerRangeCode from '../../../demos/src/date-picker/DatePickerRange.tsx?raw'
import datePickerFormCode from '../../../demos/src/date-picker/DatePickerForm.tsx?raw'
import datePickerFormatsCode from '../../../demos/src/date-picker/DatePickerFormats.tsx?raw'
import datePickerPresetsCode from '../../../demos/src/date-picker/DatePickerPresets.tsx?raw'
import datePickerDisabledCode from '../../../demos/src/date-picker/DatePickerDisabled.tsx?raw'

export function DatePickerDemo() {
  return (
    <section className="demo-section">
      <h2>DatePicker Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to choose a date from a dropdown-style calendar.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic DatePicker"
          description="Simple date picker with calendar dropdown."
          code={datePickerBasicCode}
        >
          <DatePickerBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Small DatePicker"
          description="Compact date picker with smaller height."
          code={datePickerSmallCode}
        >
          <DatePickerSmall />
        </DemoWithCode>

        <DemoWithCode
          title="With Label"
          description="Date picker with a label above the input."
          code={datePickerWithLabelCode}
        >
          <DatePickerWithLabel />
        </DemoWithCode>

        <DemoWithCode
          title="Date Range Picker"
          description="Select a range of dates (from and to)."
          code={datePickerRangeCode}
        >
          <DatePickerRange />
        </DemoWithCode>

        <DemoWithCode
          title="Form Example"
          description="Date picker used within a form with validation."
          code={datePickerFormCode}
        >
          <DatePickerForm />
        </DemoWithCode>

        <DemoWithCode
          title="Different Date Formats"
          description="Date pickers displaying dates in various formats."
          code={datePickerFormatsCode}
        >
          <DatePickerFormats />
        </DemoWithCode>

        <DemoWithCode
          title="With Presets"
          description="Date picker with quick selection presets."
          code={datePickerPresetsCode}
        >
          <DatePickerPresets />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled State"
          description="Date picker in disabled state."
          code={datePickerDisabledCode}
        >
          <DatePickerDisabled />
        </DemoWithCode>
      </div>
    </section>
  );
}
