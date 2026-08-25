// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback } from '../../avatar';
import { StepperItem } from '../../stepper-item';
import { Stepper } from '../stepper';

const meta = {
  title: 'UI/Stepper/All States (generated)',
  component: Stepper,
  args: { currentStep: 2, totalSteps: 3, current: 'Choose a plan' },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Stepper
        currentStep={2}
        totalSteps={3}
        current="Choose a plan"
        next="Confirm and pay"
      >
        <StepperItem
          variant="completed"
          label="Create an account"
          avatar={
            <Avatar color="green" className="[box-shadow:none]">
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          }
        />
        <StepperItem
          variant="current"
          label="Choose a plan"
          avatar={
            <Avatar
              color="blue"
              className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
            >
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
          }
        />
        <StepperItem
          variant="future"
          label="Confirm and pay"
          avatar={
            <Avatar
              color="gray"
              className="[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]"
            >
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
          }
        />
      </Stepper>
    </div>
  ),
};
