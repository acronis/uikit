// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy (composed from InputDatePicker + Popover + Calendar); no
// "ready for dev" Figma node exists yet, so the node URL below is a placeholder.
// Props are mapped from the ported contract. Fill in the real node URL and set
// status to COMPLETE via `/figma-component DateRangePicker <url> --update`.
import figma from '@figma/code-connect';

import { DateRangePicker } from './date-range-picker';

figma.connect(DateRangePicker, 'FIGMA_NODE_URL', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    disabled: figma.boolean('Disabled'),
    required: figma.boolean('Required'),
  },
  example: ({
    label,
    placeholder,
    disabled,
    required,
  }: {
    label: string;
    placeholder: string;
    disabled: boolean;
    required: boolean;
  }) => (
    <DateRangePicker
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      onValueChange={() => {}}
    />
  ),
});
