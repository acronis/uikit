'use client';

import { InputText } from '@acronis-platform/ui-react';

export function InputTextDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
      <InputText label="Workload name" placeholder="e.g. web-server-01" description="A friendly name for the workload." />
      <InputText label="Email" required placeholder="you@example.com" error="Enter a valid email address." defaultValue="not-an-email" />
    </div>
  );
}
