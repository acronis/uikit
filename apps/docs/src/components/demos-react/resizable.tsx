'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@acronis-platform/ui-react';

const cellStyle: React.CSSProperties = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
};

export function ResizableDemo() {
  return (
    <div
      style={{
        height: 200,
        width: 420,
        borderRadius: 8,
        border: '1px solid var(--ui-resizable-border-color-hover)',
        overflow: 'hidden',
      }}
    >
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={40} minSize={20}>
          <div style={cellStyle}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <div style={cellStyle}>Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
