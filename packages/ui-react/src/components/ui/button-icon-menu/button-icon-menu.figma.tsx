// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonIconMenu" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { ButtonIconMenu } from './button-icon-menu';

figma.connect(
  ButtonIconMenu,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3116-62813',
  {
    props: {
      // The Figma `state` variant encodes interaction states. `active` is the
      // open state; `disabled` maps to the prop. idle / hover / focus are visual
      // pseudo-states with no prop of their own.
      open: figma.enum('state', {
        active: true,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: ({ open, disabled }) => (
      <ButtonIconMenu
        open={open}
        disabled={disabled}
        ariaLabel="More options"
      />
    ),
  }
);
