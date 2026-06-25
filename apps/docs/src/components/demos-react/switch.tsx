'use client';

import { Switch } from '@acronis-platform/ui-react';

export function SwitchDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Switch label="Wi-Fi" defaultChecked />
      <Switch label="Airplane mode" />
      <Switch label="Locked on" defaultChecked disabled />
    </div>
  );
}
