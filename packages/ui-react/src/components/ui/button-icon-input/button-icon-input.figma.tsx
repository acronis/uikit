// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonIconInput" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { ButtonIconInput } from './button-icon-input';

figma.connect(
  ButtonIconInput,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=5304-5404',
  {
    props: {
      // `variant` maps to the Figma `variant` property (normal / error).
      variant: figma.enum('variant', {
        normal: 'normal',
        error: 'error',
      }),
      // `state` encodes interaction states; only Disabled maps to a code prop
      // (idle/hover/active/focus are visual pseudo-states).
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: ({ variant, disabled }) => (
      <ButtonIconInput aria-label="Action" variant={variant} disabled={disabled}>
        {/* icon */}
      </ButtonIconInput>
    ),
  }
);
