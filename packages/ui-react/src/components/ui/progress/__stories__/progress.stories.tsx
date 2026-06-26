import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from '../progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    value: 40,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Completion 0–100, or `null` for an indeterminate bar.',
      table: {
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
        category: 'State',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Steps: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { value: null },
};
