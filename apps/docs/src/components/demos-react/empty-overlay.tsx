'use client';

import { EmptyOverlay } from '@acronis-platform/ui-react';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

export function EmptyOverlayDemo() {
  return (
    <div className="relative h-72 overflow-hidden rounded-lg border border-border">
      <EmptyOverlay
        icon={<InboxIcon />}
        title="No object yet"
        description="Short description."
      />
    </div>
  );
}
