'use client';

import { ChatMenuItem, ChatMenuItemExtras } from '@acronis-platform/ui-react';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';

export function ChatMenuItemExtrasDemo() {
  return (
    <div style={{ display: 'flex', width: 256, flexDirection: 'column' }}>
      <ChatMenuItem
        label="Assistant"
        icon={<MessageTextIcon size={16} />}
        hasExtras
        extras={<ChatMenuItemExtras variant="tag" labelTag="Beta" />}
      />
      <ChatMenuItem
        label="Maximize chat"
        icon={<MessageTextIcon size={16} />}
        hasExtras
        extras={<ChatMenuItemExtras variant="shortcut" labelShortcut="⌘H" />}
      />
    </div>
  );
}
