import type { Meta, StoryObj } from '@storybook/react-vite';

import { Search } from '../search';

const meta = {
  title: 'UI/Search',
  component: Search,
  tags: ['autodocs'],
  args: { placeholder: 'Search table', 'aria-label': 'Search' },
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Search aria-label="Idle" placeholder="Search table" />
      <Search aria-label="Filled" defaultValue="Request" />
      <Search aria-label="Disabled" defaultValue="Request" disabled />
    </div>
  ),
};
