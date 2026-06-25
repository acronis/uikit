import { InputDatePicker } from '@acronis-platform/ui-react';

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
  { key: 'value', label: 'With value' },
  { key: 'range', label: 'Date range' },
];

const STATES: GridAxis[] = [
  { key: 'idle', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'active', label: 'Open' },
  { key: 'disabled', label: 'Disabled' },
];

function cell(row: string, state: string) {
  const disabled = state === 'disabled';
  const open = state === 'active';
  const content =
    row === 'range' ? (
      <InputDatePicker
        pickerType="dateRange"
        placeholder="Date range"
        startDate="Jun 1, 2026"
        endDate="Jun 30, 2026"
        open={open}
        disabled={disabled}
      />
    ) : (
      <InputDatePicker
        placeholder="Select date"
        value={row === 'value' ? 'Jun 15, 2026' : undefined}
        open={open}
        disabled={disabled}
      />
    );

  return (
    <Forced tier="input-date-picker" state={state as ForceState}>
      <Field width={240}>{content}</Field>
    </Forced>
  );
}

export function InputDatePickerSpecimen() {
  return (
    <SpecimenPage
      title="InputDatePicker"
      description="A date-trigger field with single-date and range modes."
    >
      <Subsection title="Trigger states">
        <StateGrid rows={ROWS} columns={STATES} renderCell={cell} rowHeaderWidth={108} />
      </Subsection>

      <Subsection title="Label, required, description, and error">
        <SampleRow align="flex-start">
          <Field width={260}>
            <InputDatePicker label="Start date" required description="Select a start date" />
          </Field>
          <Field width={260}>
            <InputDatePicker label="End date" value="Jun 15, 2026" error="Pick a valid date" />
          </Field>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
