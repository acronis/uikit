'use client';

import { ChatMenuItem, ChatMenuItemExtras } from '@acronis-platform/ui-react';
import {
  MessageTextIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function ChatMenuItemDemo() {
  return (
    <div style={{ display: 'flex', width: 256, flexDirection: 'column' }}>
      <ChatMenuItem
        label="New chat"
        icon={<PlusIcon size={16} />}
        hasExtras
        extras={<ChatMenuItemExtras variant="shortcut" labelShortcut="⌘N" />}
      />
      <ChatMenuItem
        label="Q3 roadmap"
        icon={<MessageTextIcon size={16} />}
        state="active"
      />
      <ChatMenuItem
        label="Assistant"
        icon={<MessageTextIcon size={16} />}
        hasExtras
        extras={<ChatMenuItemExtras labelTag="Beta" />}
      />
    </div>
  );
}
