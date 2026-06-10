// Figma Code Connect — status: COMPLETE
// Mapped to the "Input" component set in the shadcn-uikit Figma file.
// This maps the input *control* only: `State=Disabled` → disabled,
// `State=Error`/`Error-Focused` → aria-invalid, and the Placeholder boolean →
// a placeholder string. Hover/Focused/Filled are visual states with no prop.
// Label / Description / Mandatory / Clearable are composed by a Field component
// (future work), not by Input itself.
import figma from '@figma/code-connect';

import { Input } from './input';

figma.connect(
  Input,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1256-1240',
  {
    props: {
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      invalid: figma.enum('State', {
        Error: true,
        'Error-Focused': true,
      }),
      placeholder: figma.boolean('Placeholder', {
        true: 'Placeholder',
        false: undefined,
      }),
    },
    example: ({ disabled, invalid, placeholder }) => (
      <Input
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
      />
    ),
  }
);
