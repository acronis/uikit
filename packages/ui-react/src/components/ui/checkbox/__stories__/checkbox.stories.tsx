import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Default checkbox' },
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" indeterminate />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Disabled unchecked" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      <Checkbox aria-label="Disabled indeterminate" disabled indeterminate />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <label className="inline-flex items-center gap-[var(--ui-checkbox-global-container-gap)] text-sm text-[var(--ui-checkbox-global-label-color)]">
      <Checkbox defaultChecked />
      Label
    </label>
  ),
};
