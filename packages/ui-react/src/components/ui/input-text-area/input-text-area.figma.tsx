// Figma Code Connect — status: NEEDS_FIGMA_URL
// Mapped to the "InputTextArea" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { InputTextArea } from './input-text-area';

figma.connect(InputTextArea, 'FIGMA_NODE_URL', {
  props: {
    placeholder: figma.string('placeholder'),
    defaultValue: figma.enum('content', {
      value: figma.string('value'),
    }),
    disabled: figma.enum('state', {
      disabled: true,
    }),
    invalid: figma.enum('variant', {
      error: true,
    }),
  },
  example: ({ placeholder, defaultValue, disabled, invalid }) => (
    <InputTextArea
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      aria-invalid={invalid}
    />
  ),
});
