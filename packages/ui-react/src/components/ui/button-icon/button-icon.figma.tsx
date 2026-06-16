// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonIcon" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { ButtonIcon } from './button-icon';

figma.connect(
  ButtonIcon,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2236-6286',
  {
    props: {
      // `variant` maps to the Figma `variant` property (secondary / ghost).
      variant: figma.enum('variant', {
        secondary: 'secondary',
        ghost: 'ghost',
      }),
      // The `state` variant encodes interaction states; only Disabled maps to a
      // code prop (idle/hover/active/focus are visual pseudo-states).
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: ({ variant, disabled }) => (
      <ButtonIcon aria-label="Action" variant={variant} disabled={disabled}>
        {/* icon */}
      </ButtonIcon>
    ),
  }
);
