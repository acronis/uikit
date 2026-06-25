'use client';

import { InputDatePicker } from '@acronis-platform/ui-react';

export function InputDatePickerDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
      <InputDatePicker label="Due date" placeholder="Pick a date" description="When the backup must complete." />
      <InputDatePicker label="Start" placeholder="Pick a date" disabled />
    </div>
  );
}
