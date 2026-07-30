'use client';

import { InputPassword } from '@acronis-platform/ui-react';

export function InputPasswordDemo() {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}
    >
      <InputPassword
        label="Password"
        required
        placeholder="Enter a password"
        description="At least 8 characters."
      />
      <InputPassword
        label="Password"
        defaultValue="short"
        error="Enter at least 8 characters."
      />
    </div>
  );
}
