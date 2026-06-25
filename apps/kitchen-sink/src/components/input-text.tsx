import { InputText } from '@acronis-platform/ui-react';

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
  const value = row === 'filled' ? 'Value' : '';
  return (
    <Forced tier="input-text" state={s}>
      <Field width={260}>
        <InputText
          label="Label"
          required
          placeholder="Placeholder"
          value={value}
          clearable
          onChange={() => {}}
          onClear={() => {}}
          description="Description message"
          disabled={s === 'disabled'}
        />
      </Field>
    </Forced>
  );
}

export function InputTextSpecimen() {
  return (
    <SpecimenPage
      title="InputText"
      description="A full text field with label, required marker, description, error, and clear button."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={88} />
      </Subsection>

      <Subsection title="Error">
        <SampleRow align="flex-start">
          <Field width={260}>
            <InputText
              label="Email"
              value="bad@email"
              onChange={() => {}}
              error="Invalid email address"
            />
          </Field>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
