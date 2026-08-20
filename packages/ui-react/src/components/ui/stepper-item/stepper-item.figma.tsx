// Figma Code Connect — status: COMPLETE
// The Figma component set exposes `label` (TEXT) plus two VARIANT properties,
// `state` (idle/active/hover/disabled) and `variant` (current/completed/future),
// but only five of the twelve combinations are actually drawn: active+current,
// idle/hover/active+completed, and disabled+future. `state="disabled"` therefore
// has no code counterpart — it only ever appears on `variant="future"`, which is
// disabled by definition — so it is left out of the `state` map and Code Connect
// falls back to the component's own `idle` default for that one combo.
// The avatar is consumer-supplied, so the example composes a representative one.
import figma from '@figma/code-connect';

import { Avatar, AvatarFallback } from '../avatar';
import { StepperItem } from './stepper-item';

figma.connect(
  StepperItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=10345-23659',
  {
    props: {
      label: figma.string('label'),
      variant: figma.enum('variant', {
        current: 'current',
        completed: 'completed',
        future: 'future',
      }),
      state: figma.enum('state', {
        idle: 'idle',
        hover: 'hover',
        active: 'active',
      }),
    },
    example: ({ label, variant, state }) => (
      <StepperItem
        variant={variant}
        state={state}
        label={label}
        avatar={
          <Avatar color="blue">
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        }
      />
    ),
  }
);
