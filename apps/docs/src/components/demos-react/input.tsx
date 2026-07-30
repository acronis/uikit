'use client';

import { InputBox } from '@acronis-platform/ui-react';

export function InputBoxDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
      <InputBox aria-label="Workload name" placeholder="e.g. web-server-01" />
      <InputBox aria-label="Email" type="email" defaultValue="not-an-email" aria-invalid />
      <InputBox aria-label="Tenant" defaultValue="acronis-prod" disabled />
    </div>
  );
}
