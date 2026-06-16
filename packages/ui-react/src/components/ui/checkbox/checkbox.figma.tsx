// Figma Code Connect — status: COMPLETE
// Mapped to the "Checkbox" component set in the shadcn-uikit Figma file.
// `variant` chooses checked vs indeterminate (unchecked maps to neither);
// `state=disabled` maps to the disabled prop (idle/hover/active/focus are purely
// visual). `label` / `description` are composed by Checkbox itself, gated by the
// hasLabel / hasDescription booleans.
import figma from '@figma/code-connect';

import { Checkbox } from './checkbox';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2238-43890',
  {
    props: {
      checked: figma.enum('variant', {
        checked: true,
      }),
      indeterminate: figma.enum('variant', {
        indeterminate: true,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
    },
    example: ({ checked, indeterminate, disabled, label, description }) => (
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        label={label}
        description={description}
      />
    ),
  }
);
