import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/ui-react';

import { Field, SampleRow, SpecimenPage, Subsection } from '@/lib/specimen';

const FRUITS = { apple: 'Apple', banana: 'Banana', cherry: 'Cherry' };

function Fruit({
  label,
  value,
  disabled,
}: {
  label: string;
  value?: string;
  disabled?: boolean;
}) {
  return (
    <Field width={220}>
      <Select items={FRUITS} defaultValue={value} disabled={disabled}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}

export function SelectSpecimen() {
  return (
    <SpecimenPage
      title="Select"
      description="A single-choice dropdown. Note: Select still consumes the legacy --ui-form-* tokens, not a dedicated --ui-input-select-* tier, so brand overrides and the static state remap don't apply yet — hover / open / focus are shown by interacting with the control."
    >
      <Subsection title="Trigger states">
        <SampleRow>
          <Fruit label="Placeholder" />
          <Fruit label="With value" value="banana" />
          <Fruit label="Disabled" value="banana" disabled />
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
