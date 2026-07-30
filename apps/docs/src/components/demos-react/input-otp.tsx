'use client';

import * as React from 'react';
import { InputOTP } from '@acronis-platform/ui-react';

export function InputOTPDemo() {
  const [code, setCode] = React.useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputOTP
        aria-label="Verification code"
        value={code}
        onChange={setCode}
      />
      <InputOTP aria-label="Expired code" defaultValue="123456" error />
    </div>
  );
}
