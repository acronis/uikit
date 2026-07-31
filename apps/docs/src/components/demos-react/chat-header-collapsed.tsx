'use client';

import { ChatHeaderCollapsed } from '@acronis-platform/ui-react';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';

export function ChatHeaderCollapsedDemo() {
  return (
    <div style={{ display: 'flex', width: 48, flexDirection: 'column' }}>
      <ChatHeaderCollapsed icon={<AcronisAiMultiIcon size={16} />} />
    </div>
  );
}
