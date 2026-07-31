'use client';

import { AiChat } from '@acronis-platform/ui-react';

export function AiChatDemo() {
  return (
    <div style={{ height: 380, width: '100%', display: 'flex' }}>
      <AiChat defaultVariant="expanded" resizable>
        <p style={{ padding: 16, fontSize: 14 }}>
          Conversation content goes here.
        </p>
      </AiChat>
    </div>
  );
}
