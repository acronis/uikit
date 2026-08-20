// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback } from '../../avatar';
import { StepperItem } from '../stepper-item';

const meta = {
  title: 'UI/StepperItem/All States (generated)',
  component: StepperItem,
  args: {
    avatar: (
      <Avatar color="blue">
        <AvatarFallback>1</AvatarFallback>
      </Avatar>
    ),
  },
} satisfies Meta<typeof StepperItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['current', 'completed', 'future'] as const;

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {VARIANTS.map((v) => (
        <StepperItem
          label="Step name"
          avatar={
            <Avatar color="blue">
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          }
          key={v}
          variant={v}
        />
      ))}
    </div>
  ),
};
