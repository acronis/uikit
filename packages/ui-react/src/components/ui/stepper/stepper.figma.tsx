// Figma Code Connect — status: COMPLETE
// The Figma component exposes `breakpoint` (VARIANT: "0-1024" | ">1025"), four
// TEXT properties — `current`, `currentStep`, `next`, `totalSteps` — and a
// `steps` SLOT holding the StepperItem row that only the wide variant draws.
// Verified via get_context_for_code_connect against node 10364:64390.
//
// `breakpoint` is deliberately left unmapped: the React component renders both
// layouts and lets a CSS media query pick one (see the comment block in
// `stepper.tsx`), so there is no prop for either option to resolve to. Mapping
// it with `figma.enum` would have to invent a prop that does not exist; both
// Figma variants correctly produce the same single `<Stepper>` snippet, and the
// developer picks the viewport, not the code.
//
// `steps` is a SLOT, not a fixed child count — `figma.children('steps')`
// resolves whatever StepperItem instances a designer actually placed there
// (each already Code-Connected via `stepper-item.figma.tsx`), so the generated
// snippet reflects the real sequence instead of a fixed 3-step fixture.
import figma from '@figma/code-connect';

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
      steps: figma.children('steps'),
    },
    example: ({ current, currentStep, next, totalSteps, steps }) => (
      <Stepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        current={current}
        next={next}
      >
        {steps}
      </Stepper>
    ),
  }
);
