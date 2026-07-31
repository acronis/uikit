'use client';

import { TagIcon } from '@acronis-platform/ui-react';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';
import {
  ClipboardTextIcon,
  MessageTextIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function TagIconDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <TagIcon icon={<AcronisAiMultiIcon size={16} />} />
      <TagIcon
        role="img"
        aria-label="Chat transcript"
        icon={<MessageTextIcon size={16} />}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TagIcon icon={<ClipboardTextIcon size={16} />} />
        <span style={{ fontSize: 14 }}>Tasks</span>
      </div>
    </div>
  );
}
