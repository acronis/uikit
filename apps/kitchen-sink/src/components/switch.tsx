import { Switch } from '@acronis-platform/ui-react';

import {
  Forced,
  SampleRow,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const ROWS: GridAxis[] = [
  { key: 'off', label: 'Off' },
  { key: 'on', label: 'On' },
];

// The switch design has no hover/active color change (those token stops equal
// idle), so the meaningful states are default / focus / disabled.
const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(row: string, state: string) {
  const checked = row === 'on';
  return (
    <Forced tier="switch" state={state as ForceState}>
      <Switch
        aria-label={`${row} ${state}`}
        defaultChecked={checked}
        disabled={state === 'disabled'}
      />
    </Forced>
  );
}

export function SwitchSpecimen() {
  return (
    <SpecimenPage
      title="Switch"
      description="A binary on/off toggle: a 32×16 track with a 12px thumb. The track fill is wired per checked-state; keyboard focus paints a 3px ring."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} />
      </Subsection>

      <Subsection title="With label" description="An optional label composes the full field row.">
        <SampleRow>
          <Switch label="Notifications" />
          <Switch label="Auto-update" defaultChecked />
          <Switch label="Disabled" disabled defaultChecked />
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
