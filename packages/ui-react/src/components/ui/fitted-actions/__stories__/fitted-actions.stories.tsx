import type { Meta, StoryObj } from '@storybook/react-vite';

import { FittedActions } from '../fitted-actions';
import type { FittedAction } from '../fitted-actions';

const meta = {
  title: 'UI/FittedActions',
  component: FittedActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof FittedActions>;

export default meta;
type Story = StoryObj<typeof meta>;

const actions: FittedAction[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'tag', label: 'Tag' },
  { id: 'export', label: 'Export' },
];

/** All actions fit inline — no overflow menu. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <FittedActions actions={actions} />
    </div>
  ),
};

/** Container is narrow — trailing actions collapse into "More". */
export const WithOverflow: Story = {
  render: () => (
    <div style={{ width: 140 }}>
      <FittedActions actions={actions} />
    </div>
  ),
};
