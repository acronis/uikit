import { Radio, RadioGroup } from '@acronis-platform/ui-react';

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
  { key: 'unchecked', label: 'Unchecked' },
  { key: 'checked', label: 'Checked' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

// Radios are owned by their group, so a single forced radio is wrapped in a
// group whose value selects (or doesn't) the one item.
function cell(row: string, state: string) {
  const checked = row === 'checked';
  return (
    <Forced tier="radio" state={state as ForceState}>
      <RadioGroup
        defaultValue={checked ? 'item' : 'other'}
        aria-label={`${row} ${state}`}
      >
        <Radio value="item" disabled={state === 'disabled'} />
      </RadioGroup>
    </Forced>
  );
}

export function RadioSpecimen() {
  return (
    <SpecimenPage
      title="Radio"
      description="Mutually exclusive options owned by a RadioGroup. The 16px circle has unchecked and checked states, each with its own per-interaction fill and border tokens."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} />
      </Subsection>

      <Subsection title="Group">
        <SampleRow align="flex-start">
          <RadioGroup defaultValue="standard" aria-label="Plan">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <Radio value="standard" /> Standard
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <Radio value="pro" /> Pro
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                color: 'var(--ui-text-on-surface-secondary)',
              }}
            >
              <Radio value="enterprise" disabled /> Enterprise (disabled)
            </label>
          </RadioGroup>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
