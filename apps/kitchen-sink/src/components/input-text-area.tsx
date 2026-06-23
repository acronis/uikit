import { InputTextArea } from '@acronis-platform/ui-react';

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
    <Forced tier="input-text-area" state={s}>
      <Field width={220}>
        <InputTextArea
          aria-label={`${row} ${state}`}
          placeholder="Placeholder"
          rows={3}
          defaultValue={row === 'filled' ? 'Multi-line value\nsecond line' : undefined}
          disabled={s === 'disabled'}
        />
      </Field>
    </Forced>
  );
}

export function InputTextAreaSpecimen() {
  return (
    <SpecimenPage
      title="InputTextArea"
      description="A multiline text area. Box fill and border are wired per state — idle / hover / focus (focus border + 3px ring) / disabled. The error state keeps the border and swaps the focus ring to the error color."
    >
      <Subsection title="States">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={88} />
      </Subsection>

      <Subsection title="Invalid" description="Driven by aria-invalid.">
        <SampleRow align="flex-start">
          <Field width={260}>
            <InputTextArea aria-label="Invalid" aria-invalid rows={3} defaultValue="Bad value" />
          </Field>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
