'use client';

import * as React from 'react';
import { DateRangePicker, type DateRange } from '@acronis-platform/ui-react';

export function DateRangePickerDemo() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(2026, 6, 1),
    to: new Date(2026, 6, 15),
  });

  return (
    <div style={{ width: 288 }}>
      <DateRangePicker
        label="Period"
        placeholder="Select a date range"
        value={range}
        onValueChange={setRange}
      />
    </div>
  );
}
