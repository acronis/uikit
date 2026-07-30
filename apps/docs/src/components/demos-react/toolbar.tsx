'use client';

import {
  Button,
  ButtonMenu,
  Toolbar,
  ToolbarActionList,
  ToolbarActions,
} from '@acronis-platform/ui-react';

const ACTIONS = [
  { key: 'protect', label: 'Protect' },
  { key: 'recover', label: 'Recover' },
  { key: 'move', label: 'Move to group' },
  { key: 'delete', label: 'Delete' },
];

export function ToolbarDemo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
      }}
    >
      <Toolbar>
        <Button variant="ghost">Protect</Button>
        <Button variant="ghost">Recover</Button>
        <ButtonMenu variant="secondary">More actions</ButtonMenu>
        <ToolbarActions>
          <span className="text-sm text-[var(--ui-text-on-surface-primary)]">
            6 items selected:
          </span>
          <Button variant="ghost">Deselect</Button>
        </ToolbarActions>
      </Toolbar>

      <div style={{ width: 340 }}>
        <Toolbar>
          <ToolbarActionList actions={ACTIONS} />
          <ToolbarActions>
            <span className="text-sm text-[var(--ui-text-on-surface-secondary)]">
              25 of 1250
            </span>
          </ToolbarActions>
        </Toolbar>
      </div>

      <Toolbar disabled>
        <Button variant="ghost">Protect</Button>
        <Button variant="ghost">Recover</Button>
        <ToolbarActions>
          <span className="text-sm text-[var(--ui-text-on-surface-secondary)]">
            No items selected
          </span>
        </ToolbarActions>
      </Toolbar>
    </div>
  );
}
