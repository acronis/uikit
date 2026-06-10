// Figma Code Connect — status: COMPLETE
// Mapped to the "Button" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Button } from './button';

figma.connect(
  Button,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1173-2789',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'default',
        Secondary: 'secondary',
        Ghost: 'ghost',
        Destructive: 'destructive',
        Ai: 'ai',
        Inverted: 'inverted',
      }),
      // The Figma button encodes interaction state as a variant; only the
      // Disabled state maps to a code prop (Idle/Hover/Active/Focus are visual).
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: ({ variant, disabled }) => (
      <Button variant={variant} disabled={disabled}>
        Label
      </Button>
    ),
  }
);
