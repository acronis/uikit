import { InputSearch } from '@acronis-platform/ui-react';

import {
  Field,
  Forced,
  SampleRow,
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
      <Field width={240}>
        <InputSearch
          label="Search"
          required
          placeholder="Search"
          defaultValue={row === 'filled' ? 'Query' : undefined}
          disabled={s === 'disabled'}
        />
      </Field>
    </Forced>
  );
}

export function InputSearchSpecimen() {
  return (
    <SpecimenPage
      title="InputSearch"
      description="A labeled search field variant that composes Search with field furniture."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={88} />
      </Subsection>

      <Subsection title="Without label">
        <SampleRow>
          <Field width={240}>
            <InputSearch aria-label="Search without label" placeholder="Search" />
          </Field>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
