// Figma Code Connect — status: COMPLETE
// Mapped to the "Checkbox" component set in the shadcn-uikit Figma file.
// `State` chooses checked vs indeterminate (Unchecked maps to neither);
// `Interaction=Disabled` maps to the disabled prop (Default/Hover/Focus are
// purely visual pseudo-states). The Label/Description booleans are composed by a
// separate Field component, not by Checkbox itself.
import figma from '@figma/code-connect';

import { Checkbox } from './checkbox';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=728-3781',
  {
    props: {
      checked: figma.enum('State', {
        Checked: true,
      }),
      indeterminate: figma.enum('State', {
        Indeterminate: true,
      }),
      disabled: figma.enum('Interaction', {
        Disabled: true,
      }),
    },
    example: ({ checked, indeterminate, disabled }) => (
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
      />
    ),
  }
);
