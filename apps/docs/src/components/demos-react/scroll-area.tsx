'use client';

import { ScrollArea } from '@acronis-platform/ui-react';

const rowStyle: React.CSSProperties = {
  borderRadius: 6,
  background: 'var(--ui-background-surface-secondary)',
  padding: '8px 12px',
  fontSize: 14,
};

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-64 rounded-md border border-border">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={rowStyle}>
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
