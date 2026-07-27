// Figma Code Connect — status: COMPLETE
// Mapped to the "InputPassword" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { InputPassword } from './input-password';

figma.connect(
  InputPassword,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6325-11375',
  {
    props: {
      // `hasLabel` gates the label; map straight through to the label text.
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      // `hasDescription` gates the helper text; hidden once `error` is set.
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      // `variant=error` carries the error message; its presence switches the
      // field to the error treatment.
      error: figma.enum('variant', { error: figma.string('error') }),
      placeholder: figma.string('placeholder'),
      // `content=value` seeds a value.
      defaultValue: figma.enum('content', {
        value: figma.string('value'),
      }),
      // `state` (idle / hover / focused / focused-icon / disabled) is otherwise
      // a pure interaction pseudo-state, not a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, required, description, error, placeholder, defaultValue, disabled }) => (
      <InputPassword
        label={label}
        required={required}
        description={description}
        error={error}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
      />
    ),
  }
);
