// Figma Code Connect — status: COMPLETE
// Mapped to the "InputSelect" field component set in the shadcn-uikit Figma file.
// The dropdown (InputSelectContent/Item/Section/Search/Status) is composed by the
// consumer; the field node drives label / placeholder / description / error / variant.
import figma from '@figma/code-connect';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from './input-select';

figma.connect(
  InputSelect,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2639-293',
  {
    props: {
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      placeholder: figma.string('placeholder'),
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
    example: ({ label, required, placeholder, description, error, disabled }) => (
      <InputSelect disabled={disabled}>
        <InputSelectField>
          <InputSelectLabel required={required}>{label}</InputSelectLabel>
          <InputSelectTrigger>
            <InputSelectValue placeholder={placeholder} />
          </InputSelectTrigger>
          <InputSelectDescription>{description}</InputSelectDescription>
          <InputSelectError>{error}</InputSelectError>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="1">Option 1</InputSelectItem>
          <InputSelectItem value="2">Option 2</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    ),
  }
);
