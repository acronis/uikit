import { Checkbox } from '@acronis-platform/ui-react';

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
  { key: 'indeterminate', label: 'Indeterminate' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Active' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(row: string, state: string) {
  return (
    <Forced tier="checkbox" state={state as ForceState}>
      <Checkbox
        aria-label={`${row} ${state}`}
        defaultChecked={row === 'checked'}
        indeterminate={row === 'indeterminate'}
        disabled={state === 'disabled'}
      />
    </Forced>
  );
}

export function CheckboxSpecimen() {
  return (
    <SpecimenPage
      title="Checkbox"
      description="A 16px box with three logical states — unchecked, checked, indeterminate — each with its own per-interaction fill, border, and glyph tokens."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} />
      </Subsection>

      <Subsection title="With label & description">
        <SampleRow align="flex-start">
          <Checkbox label="Email notifications" />
          <Checkbox label="Auto-renew" defaultChecked />
          <Checkbox
            label="Share usage data"
            description="Anonymous analytics to help improve the product."
          />
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
