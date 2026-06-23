import { Input } from '@acronis-platform/ui-react';

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
    <Forced tier="input-text" state={s}>
      <Field width={160}>
        <Input
          aria-label={`${row} ${state}`}
          placeholder="Placeholder"
          defaultValue={row === 'filled' ? 'Value' : undefined}
          disabled={s === 'disabled'}
        />
      </Field>
    </Forced>
  );
}

export function InputSpecimen() {
  return (
    <SpecimenPage
      title="Input"
      description="A single-line text input. The box fill and normal border are wired per state — idle / hover / focus (border + 3px ring) / disabled. The error state is driven by aria-invalid."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={88} />
      </Subsection>

      <Subsection title="Invalid" description="Driven by aria-invalid: the error border, plus an error ring on real focus.">
        <SampleRow>
          <Field width={200}>
            <Input aria-label="Invalid" aria-invalid defaultValue="Bad value" />
          </Field>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
