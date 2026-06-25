import type { CSSProperties } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@acronis-platform/ui-react';

import { SpecimenPage, Subsection } from '@/lib/specimen';

const cellStyle: CSSProperties = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  fontSize: 14,
};

const shell: CSSProperties = {
  height: 240,
  width: 520,
  borderRadius: 8,
  border: '1px solid var(--ui-resizable-border-color-hover)',
  overflow: 'hidden',
  background: 'var(--ui-background-surface-primary)',
};

export function ResizableSpecimen() {
  return (
    <SpecimenPage
      title="Resizable"
      description="ResizablePanelGroup with horizontal and vertical handles."
    >
      <Subsection title="Horizontal">
        <div style={shell}>
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={35} minSize={20}>
              <div style={cellStyle}>Sidebar</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65}>
              <div style={cellStyle}>Content</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Subsection>

      <Subsection title="Vertical">
        <div style={shell}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={60}>
              <div style={cellStyle}>Editor</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <div style={cellStyle}>Preview</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Subsection>
    </SpecimenPage>
  );
}
