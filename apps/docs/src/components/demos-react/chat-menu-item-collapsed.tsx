'use client';

import { ChatMenuItemCollapsed } from '@acronis-platform/ui-react';
import {
  ClipboardTextIcon,
  MessageTextIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function ChatMenuItemCollapsedDemo() {
  return (
    <div style={{ display: 'flex', width: 48, flexDirection: 'column' }}>
      <ChatMenuItemCollapsed
        aria-label="New chat"
        icon={<PlusIcon size={16} />}
      />
      <ChatMenuItemCollapsed
        aria-label="Chat"
        icon={<MessageTextIcon size={16} />}
      />
      <ChatMenuItemCollapsed
        aria-label="Tasks (new activity)"
        icon={<ClipboardTextIcon size={16} />}
        hasAlert
      />
    </div>
  );
}
