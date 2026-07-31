'use client';

import { useState } from 'react';
import { InputOTP } from '@acronis-platform/ui-react';

export function InputOTPDemo() {
  const [code, setCode] = useState('');
  const [completed, setCompleted] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputOTP
        aria-label="Verification code"
        value={code}
        onChange={(next) => {
          setCode(next);
          if (next.length < 6) setCompleted(false);
        }}
        onComplete={() => setCompleted(true)}
      />
      <span style={{ fontSize: 13, opacity: 0.7 }}>
        {completed ? `Code entered: ${code}` : 'Enter the 6-digit code we sent you.'}
      </span>
      <InputOTP aria-label="Rejected verification code" error defaultValue="123456" />
    </div>
  );
}
