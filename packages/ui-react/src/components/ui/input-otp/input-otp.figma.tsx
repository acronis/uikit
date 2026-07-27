// Figma Code Connect — status: COMPLETE
// Mapped to the "inputOTP" component in the ui-react Figma file.
import figma from '@figma/code-connect';

import { InputOTP } from './input-otp';

figma.connect(
  InputOTP,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6327-27477',
  {
    props: {
      // The top-level `state` variant (autofocus / filled / error) is a demo
      // preset composed from the per-slot `state`/`variant`/`content`
      // properties, not a real prop — it maps to `autoFocus`/`error` (and a
      // sample value for the "filled" preset) on the real component.
      autoFocus: figma.enum('state', { autofocus: true }),
      error: figma.enum('state', { error: true }),
      defaultValue: figma.enum('state', { filled: '123456' }),
    },
    example: ({ autoFocus, error, defaultValue }) => (
      <InputOTP autoFocus={autoFocus} error={error} defaultValue={defaultValue} />
    ),
  }
);
