'use client';

import { Checkbox } from '@acronis-platform/ui-react';

export function CheckboxDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Enable notifications" />
      <Checkbox label="Run nightly backup" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Locked policy" defaultChecked disabled />
    </div>
  );
}
