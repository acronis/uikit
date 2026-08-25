// Figma Code Connect — status: COMPLETE
// Re-checked 2026-08-24: the Figma component set exposes `label` (TEXT) plus one
// top-level VARIANT property, `type` (Current/Completed/Future) — renamed from
// `variant` in an earlier revision, hence the `figma.enum('type', ...)` below.
// The nested `Completed` sub-component's `state` property only enumerates
// `idle` as a selectable variant (hover/active/focus are Figma interactive
// states layered on top, not separate variant symbols), so it stays unmapped
// here — but the synced `--ui-stepper-item-completed-container-color-*` tokens
// in @acronis-platform/tokens-pd confirm all four looks are real design colors,
// which is why `StepperItem`'s own `state` prop still covers all four.
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
      variant: figma.enum('type', {
        Current: 'current',
        Completed: 'completed',
        Future: 'future',
      }),
    },
    example: ({ label, variant }) => (
      <StepperItem
        variant={variant}
        label={label}
        avatar={
          <Avatar color="blue" className="[box-shadow:none]">
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        }
      />
    ),
  }
);
