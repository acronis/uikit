// Figma Code Connect — status: COMPLETE
// The Figma component exposes `breakpoint` (VARIANT: "0-1024" | ">1025") plus
// four TEXT properties — `current`, `currentStep`, `next`, `totalSteps` — and a
// `children` slot holding the StepperItem row that only the wide variant draws.
//
// `breakpoint` is deliberately left unmapped: the React component renders both
// layouts and lets a CSS media query pick one (see the comment block in
// `stepper.tsx`), so there is no prop for either option to resolve to. Mapping
// it with `figma.enum` would have to invent a prop that does not exist; both
// Figma variants correctly produce the same single `<Stepper>` snippet, and the
// developer picks the viewport, not the code.
import figma from '@figma/code-connect';

import { Avatar, AvatarFallback } from '../avatar';
import { StepperItem } from '../stepper-item';
import { Stepper } from './stepper';

figma.connect(
  Stepper,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=10364-64390',
  {
    props: {
      current: figma.string('current'),
      currentStep: figma.string('currentStep'),
      next: figma.string('next'),
      totalSteps: figma.string('totalSteps'),
    },
    example: ({ current, currentStep, next, totalSteps }) => (
      <Stepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        current={current}
        next={next}
      >
        <StepperItem
          variant="completed"
          label="Create an account"
          avatar={
            <Avatar color="green">
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          }
        />
        <StepperItem
          variant="current"
          label={current}
          avatar={
            <Avatar color="blue">
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
          }
        />
        <StepperItem
          variant="future"
          label={next}
          avatar={
            <Avatar color="gray">
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
          }
        />
      </Stepper>
    ),
  }
);
