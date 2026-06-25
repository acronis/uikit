// Figma Code Connect — status: COMPLETE
// Mapped to the "InputSearch" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { InputSearch } from './input-search';

figma.connect(
  InputSearch,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2617-339',
  {
    props: {
      // `hasLabel` gates the label; map straight through to the label text.
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      placeholder: figma.string('placeholder'),
      // `content=value` seeds a value, which reveals the clear button (the
      // wrapped `Search` shows it whenever the field is non-empty and enabled).
      defaultValue: figma.enum('content', {
        value: figma.string('value'),
      }),
      // `state` (idle / hover / focused / focused-clear / disabled) is otherwise
      // a pure interaction pseudo-state, not a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, placeholder, defaultValue, disabled }) => (
      <InputSearch
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
      />
    ),
  }
);
