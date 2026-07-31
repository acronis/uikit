'use client';

import * as React from 'react';
import {
  ChatHeaderExpanded,
  ChatHeaderExpandedTab,
  ChatHeaderExpandedTabs,
} from '@acronis-platform/ui-react';

export function ChatHeaderExpandedDemo() {
  const [view, setView] = React.useState<'chat' | 'tasks'>('chat');

  return (
    <div style={{ width: '100%', maxWidth: 512 }}>
      <ChatHeaderExpanded hasHistory>
        <ChatHeaderExpandedTabs>
          <ChatHeaderExpandedTab
            active={view === 'chat'}
            onClick={() => setView('chat')}
          >
            Acronis AI
          </ChatHeaderExpandedTab>
          <ChatHeaderExpandedTab
            active={view === 'tasks'}
            counter={7}
            onClick={() => setView('tasks')}
          >
            Tasks
          </ChatHeaderExpandedTab>
        </ChatHeaderExpandedTabs>
      </ChatHeaderExpanded>
    </div>
  );
}
