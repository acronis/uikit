import { Search } from '@acronis-platform/ui-react';

import {
  Field,
  Forced,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const ROWS: GridAxis[] = [
  { key: 'empty', label: 'Empty' },
  { key: 'filled', label: 'Filled' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(row: string, state: string) {
  const s = state as ForceState;
  return (
    <Forced tier="input-search" state={s}>
      <Field width={200}>
        <Search
          aria-label={`${row} ${state}`}
          placeholder="Search"
          defaultValue={row === 'filled' ? 'Query' : undefined}
          disabled={s === 'disabled'}
        />
      </Field>
    </Forced>
  );
}

export function SearchSpecimen() {
  return (
    <SpecimenPage
      title="Search"
      description="A search field: a bordered box with a leading magnifier, a borderless input, and a trailing clear button shown once there's a value."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={88} />
      </Subsection>
    </SpecimenPage>
  );
}
