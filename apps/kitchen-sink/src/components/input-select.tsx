import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '@acronis-platform/ui-react';

import {
  Field,
  Forced,
  SpecimenPage,
  StateGrid,
  Subsection,
  type ForceState,
  type GridAxis,
} from '@/lib/specimen';

const FRUITS = { apple: 'Apple', banana: 'Banana', cherry: 'Cherry' };

const ROWS: GridAxis[] = [
  { key: 'placeholder', label: 'Placeholder' },
  { key: 'selected', label: 'Selected' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'disabled', label: 'Disabled' },
];

function field({
  state,
  row,
  error,
}: {
  state: ForceState;
  row: string;
  error?: boolean;
}) {
  const selected = row === 'selected' ? 'banana' : undefined;
  const disabled = state === 'disabled';
  return (
    <Forced tier="input-select" state={state}>
      <Field width={260}>
        <InputSelect items={FRUITS} defaultValue={selected} disabled={disabled}>
          <InputSelectField>
            <InputSelectLabel required>Fruit</InputSelectLabel>
            <InputSelectTrigger aria-invalid={error || undefined}>
              <InputSelectValue placeholder="Select an option" />
            </InputSelectTrigger>
            {error ? (
              <InputSelectError>Select a fruit</InputSelectError>
            ) : (
              <InputSelectDescription>Pick one item</InputSelectDescription>
            )}
          </InputSelectField>
          <InputSelectContent>
            <InputSelectSection>
              <InputSelectSectionLabel>Fruits</InputSelectSectionLabel>
              <InputSelectItem value="apple">Apple</InputSelectItem>
              <InputSelectItem value="banana">Banana</InputSelectItem>
              <InputSelectItem value="cherry">Cherry</InputSelectItem>
            </InputSelectSection>
          </InputSelectContent>
        </InputSelect>
      </Field>
    </Forced>
  );
}

export function InputSelectSpecimen() {
  return (
    <SpecimenPage
      title="InputSelect"
      description="The full field-style select with label, description/error messaging, and dropdown sections."
    >
      <Subsection title="States">
        <StateGrid
          rows={ROWS}
          columns={STATES}
          renderCell={(row, state) => field({ row, state: state as ForceState })}
          rowHeaderWidth={104}
        />
      </Subsection>

      <Subsection title="Error">
        <StateGrid
          rows={[{ key: 'error', label: 'Invalid' }]}
          columns={[{ key: 'idle', label: 'Default' }, { key: 'hover', label: 'Hover' }]}
          renderCell={(_, state) => field({ row: 'placeholder', state: state as ForceState, error: true })}
          rowHeaderWidth={104}
        />
      </Subsection>
    </SpecimenPage>
  );
}
