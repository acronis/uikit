// Figma Code Connect — status: COMPLETE
// Mapped to the "InputTextArea" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { InputTextArea } from './input-text-area';

figma.connect(
  InputTextArea,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2797-2876',
  {
    props: {
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      placeholder: figma.string('placeholder'),
      defaultValue: figma.enum('content', {
        value: figma.string('value'),
      }),
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      // The `error` text drives the error treatment — only meaningful for
      // `variant="error"`.
      error: figma.enum('variant', { error: figma.string('error') }),
      // `state` (idle / hover / focused / disabled) is otherwise a pure
      // interaction pseudo-state, not a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({
      label,
      required,
      placeholder,
      defaultValue,
      description,
      error,
      disabled,
    }) => (
      <InputTextArea
        label={label}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        description={description}
        error={error}
        disabled={disabled}
      />
    ),
  }
);
