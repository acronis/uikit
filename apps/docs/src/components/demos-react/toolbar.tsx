'use client';

import { useState } from 'react';
import {
  Button,
  Toolbar,
  ToolbarActionList,
  ToolbarActions,
  type ToolbarActionListItem,
} from '@acronis-platform/ui-react';

const SELECTED_COUNT = 6;

// Module-level so the array identity is stable: ToolbarActionList re-runs its
// measurement effect whenever `actions` changes identity.
const ACTIONS: ToolbarActionListItem[] = [
  { key: 'protect', label: 'Protect', onSelect: () => {} },
  { key: 'backup', label: 'Back up now', onSelect: () => {} },
  { key: 'recover', label: 'Recover', onSelect: () => {} },
  { key: 'group', label: 'Move to group', onSelect: () => {} },
  { key: 'delete', label: 'Delete', onSelect: () => {} },
];

export function ToolbarDemo() {
  const [selected, setSelected] = useState(SELECTED_COUNT);

  return (
    <div className="flex w-full flex-col gap-6">
      <Toolbar aria-label="Workload actions">
        <ToolbarActionList actions={ACTIONS} />
        <ToolbarActions>
          {selected > 0 ? (
            <>
              <span className="text-sm text-[var(--ui-text-on-surface-primary)]">
                {selected} items selected:
              </span>
              <Button variant="ghost" onClick={() => setSelected(0)}>
                Deselect
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-[var(--ui-text-on-surface-secondary)]">
                No items selected
              </span>
              <Button
                variant="ghost"
                onClick={() => setSelected(SELECTED_COUNT)}
              >
                Select 6 workloads
              </Button>
            </>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* Same actions in a narrow container: the ones that no longer fit
          collapse into the "More actions" menu. */}
      <div className="w-[360px]">
        <Toolbar aria-label="Workload actions, narrow container">
          <ToolbarActionList actions={ACTIONS} />
        </Toolbar>
      </div>
    </div>
  );
}
