'use client';

import { Radio, RadioGroup } from '@acronis-platform/ui-react';

export function RadioDemo() {
  return (
    <RadioGroup
      defaultValue="weekly"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Radio value="daily" />
        Daily
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Radio value="weekly" />
        Weekly
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Radio value="monthly" />
        Monthly
      </label>
    </RadioGroup>
  );
}
