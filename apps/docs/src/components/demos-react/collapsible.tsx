'use client';

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@acronis-platform/ui-react';

export function CollapsibleDemo() {
  return (
    <div style={{ width: 320 }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          render={<Button variant="ghost" className="w-full justify-start" />}
        >
          Show advanced settings
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
            These options change how backups are scheduled and retained.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
