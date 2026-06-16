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
    label: { control: 'text' },
    description: { control: 'text' },
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
  args: { label: 'Accept terms', defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Get notified when someone mentions you.',
    defaultChecked: true,
  },
};

export const LabelledVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Unchecked option" />
      <Checkbox label="Checked option" defaultChecked />
      <Checkbox label="Indeterminate option" indeterminate />
      <Checkbox
        label="Disabled option"
        description="This one can't be changed."
        disabled
        defaultChecked
      />
    </div>
  ),
};
