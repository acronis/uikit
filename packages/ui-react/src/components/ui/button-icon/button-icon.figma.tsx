// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonIcon" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { ButtonIcon } from './button-icon';

figma.connect(
  ButtonIcon,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2236-6286',
  {
    props: {
      // ButtonIcon has no Style property — a single style with the interaction
      // states encoded as a variant. Only Disabled maps to a code prop
      // (Idle/Hover/Active/Focus are visual).
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: ({ disabled }) => (
      <ButtonIcon aria-label="Action" disabled={disabled}>
        {/* icon */}
      </ButtonIcon>
    ),
  }
);
