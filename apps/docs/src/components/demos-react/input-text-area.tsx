'use client';

import { InputTextArea } from '@acronis-platform/ui-react';

export function InputTextAreaDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
      <InputTextArea label="Description" placeholder="Describe the policy…" description="Markdown is supported." />
      <InputTextArea label="Notes" required placeholder="Required notes" error="This field is required." />
    </div>
  );
}
