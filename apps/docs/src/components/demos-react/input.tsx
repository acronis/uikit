'use client';

import { Input } from '@acronis-platform/ui-react';

export function InputDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
      <Input placeholder="you@example.com" />
      <Input defaultValue="invalid value" aria-invalid />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}
