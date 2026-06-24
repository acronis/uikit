// Figma Code Connect — status: COMPLETE
// Mapped to the "InputText" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { InputText } from './input-text';

figma.connect(
  InputText,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2624-248',
  {
    props: {
      label: figma.string('label'),
      placeholder: figma.string('placeholder'),
      required: figma.boolean('required'),
      clearable: figma.boolean('clearable'),
      // `hasDescription` gates the description text; map straight to the string.
      description: figma.string('description'),
      // The `error` text drives the error treatment — only meaningful for
      // `variant="error"`.
      error: figma.enum('variant', { error: figma.string('error') }),
      // `state` (idle / hover / focused / focused-clear / disabled) and `content`
      // (placeholder / value) are pure interaction/runtime pseudo-states, not props.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, placeholder, required, clearable, description, error }) => (
      <InputText
        label={label}
        placeholder={placeholder}
        required={required}
        clearable={clearable}
        description={description}
        error={error}
      />
    ),
  }
);
