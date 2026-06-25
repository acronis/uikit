// Figma Code Connect — status: COMPLETE
// Mapped to the "InputDatePicker" component set in the shadcn-uikit Figma file.
// This is the trigger field; the calendar popup is composed by the consumer.
import figma from '@figma/code-connect';

import { InputDatePicker } from './input-date-picker';

figma.connect(
  InputDatePicker,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=3034-966',
  {
    props: {
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      pickerType: figma.enum('pickerType', {
        date: 'date',
        dateRange: 'dateRange',
      }),
      placeholder: figma.string('Date'),
      value: figma.enum('content', { value: figma.string('value') }),
      startDate: figma.string('startDate'),
      endDate: figma.string('endDate'),
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      // The `error` text drives the error treatment — only meaningful for
      // `variant="error"`.
      error: figma.enum('variant', { error: figma.string('error') }),
      // `state` (idle / hover / active / focused / disabled) is otherwise a pure
      // interaction pseudo-state, not a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({
      label,
      required,
      pickerType,
      placeholder,
      value,
      startDate,
      endDate,
      description,
      error,
      disabled,
    }) => (
      <InputDatePicker
        label={label}
        required={required}
        pickerType={pickerType}
        placeholder={placeholder}
        value={value}
        startDate={startDate}
        endDate={endDate}
        description={description}
        error={error}
        disabled={disabled}
      />
    ),
  }
);
