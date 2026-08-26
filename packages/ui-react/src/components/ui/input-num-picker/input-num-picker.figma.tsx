// Figma Code Connect — status: COMPLETE
// Mapped to the "InputNumPicker" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { InputNumPicker } from './input-num-picker';

figma.connect(
  InputNumPicker,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8523-5382',
  {
    props: {
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      value: figma.string('value'),
      // `state` (idle / hover / focused / disabled) is a pure interaction
      // pseudo-state, handled in CSS — only `disabled` maps to a real prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, required, value, disabled }) => (
      <InputNumPicker
        label={label}
        required={required}
        defaultValue={Number(value)}
        disabled={disabled}
      />
    ),
  }
);
