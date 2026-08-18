// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroupItem } from '../../button-group';
import {
  CirclePauseIcon,
  PencilIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { Timer } from '../timer';

const meta = {
  title: 'UI/Timer/All States (generated)',
  component: Timer,
  args: { value: '12:01:45' },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Timer value="12:01:45">
        <ButtonGroupItem aria-label="Pause">
          <CirclePauseIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Rename">
          <PencilIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Add entry">
          <PlusIcon size={16} />
        </ButtonGroupItem>
      </Timer>
    </div>
  ),
};
