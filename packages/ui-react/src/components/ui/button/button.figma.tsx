// Figma Code Connect — status: COMPLETE
// Mapped to the "Button" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Button } from './button';

figma.connect(
  Button,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2236-5696',
  {
    props: {
      variant: figma.enum('variant', {
        primary: 'default',
        secondary: 'secondary',
        ghost: 'ghost',
        destructive: 'destructive',
        ai: 'ai',
      }),
      // The Figma button encodes interaction state as a variant; only the
      // Disabled state maps to a code prop (Idle/Hover/Active/Focus are visual).
      disabled: figma.enum('state', {
        disabled: true,
      }),
      // The leading icon — the Figma button's `icon` instance-swap, rendered as
      // the button's first child. (The companion `hasIcon` boolean toggle isn't
      // mapped; the snippet just shows the icon slot.)
      icon: figma.instance('icon'),
    },
    example: ({ variant, disabled, icon }) => (
      <Button variant={variant} disabled={disabled}>
        {icon}
        Label
      </Button>
    ),
  }
);
