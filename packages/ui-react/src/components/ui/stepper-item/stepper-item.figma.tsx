// Figma Code Connect — status: COMPLETE
// The Figma component set exposes one top-level VARIANT property, `type`
// (Current/Completed/Future), so the React `variant` prop maps to `type` below.
// The `label` text property lives inside each variant. The nested Completed
// instance exposes only `state=idle`; hover/active/focus are React/token states,
// not variant symbols or prototype interactions in this Figma component set, so
// Code Connect leaves `state` unmapped.
// The avatar is consumer-supplied, so the mapping picks the representative one
// for each `type` — matching the stories and the docs demo: a blue numbered
// avatar for `current`, a green check for `completed`, a gray numbered avatar
// for `future`, with the digit recolored to that step's own label-color token.
// The branching lives in the props mapping (a `figma.enum` whose values are
// literal JSX) rather than in a helper called from `example`: Code Connect
// serializes the example body statically, so a helper call would be published
// verbatim as `avatar={renderAvatar(variant)}` instead of real JSX.
import figma from '@figma/code-connect';
import { CheckIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Avatar, AvatarFallback } from '../avatar';
import { StepperItem } from './stepper-item';

figma.connect(
  StepperItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=10345-23659',
  {
    // Pinned explicitly: `Avatar`/`AvatarFallback`/`CheckIcon` only appear
    // inside the `avatar` figma.enum's values, which the parser stringifies —
    // so they never reach the auto-derived import list and the published
    // snippet would reference unimported components.
    imports: [
      "import { Avatar, AvatarFallback, StepperItem } from '@acronis-platform/ui-react';",
      "import { CheckIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    props: {
      label: figma.string('label'),
      variant: figma.enum('type', {
        Current: 'current',
        Completed: 'completed',
        Future: 'future',
      }),
      avatar: figma.enum('type', {
        Current: (
          <Avatar
            color="blue"
            className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
          >
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        ),
        Completed: (
          <Avatar color="green" className="[box-shadow:none]">
            <CheckIcon size={16} />
          </Avatar>
        ),
        Future: (
          <Avatar
            color="gray"
            className="[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]"
          >
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        ),
      }),
    },
    example: ({ label, variant, avatar }) => (
      <StepperItem variant={variant} label={label} avatar={avatar} />
    ),
  }
);
