'use client';

import * as React from 'react';
import {
  CalendarPanel,
  type CalendarPanelRangeProps,
} from '@acronis-platform/ui-react';

const JULY_2026 = new Date(2026, 6, 1);

export function CalendarPanelDemo() {
  const [single, setSingle] = React.useState<Date | undefined>(
    new Date(2026, 6, 9)
  );
  const [multiple, setMultiple] = React.useState<Date[]>([
    new Date(2026, 6, 9),
    new Date(2026, 6, 10),
    new Date(2026, 6, 15),
    new Date(2026, 6, 24),
  ]);
  const [range, setRange] = React.useState<CalendarPanelRangeProps['selected']>({
    from: new Date(2026, 6, 9),
    to: new Date(2026, 7, 10),
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h4 className="text-sm font-medium leading-none">single</h4>
        <CalendarPanel
          variant="single"
          defaultMonth={JULY_2026}
          selected={single}
          onSelect={setSingle}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium leading-none">multiple</h4>
        <CalendarPanel
          variant="multiple"
          defaultMonth={JULY_2026}
          selected={multiple}
          onSelect={(next) => setMultiple(next ?? [])}
          onCancel={() => setMultiple([])}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium leading-none">range</h4>
        <CalendarPanel
          variant="range"
          defaultMonth={JULY_2026}
          selected={range}
          onSelect={setRange}
          onCancel={() => setRange(undefined)}
        />
      </div>
    </div>
  );
}
