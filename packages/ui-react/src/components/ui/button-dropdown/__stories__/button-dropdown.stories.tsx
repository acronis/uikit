import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonDropdown } from '../button-dropdown';

const meta = {
  title: 'UI/ButtonDropdown',
  component: ButtonDropdown,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
    },
    open: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Label',
  },
} satisfies Meta<typeof ButtonDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Open: Story = {
  args: { open: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonDropdown variant="primary">Label</ButtonDropdown>
      <ButtonDropdown variant="secondary">Label</ButtonDropdown>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonDropdown variant="primary">Label</ButtonDropdown>
        <ButtonDropdown variant="primary" open>
          Label
        </ButtonDropdown>
        <ButtonDropdown variant="primary" disabled>
          Label
        </ButtonDropdown>
      </div>
      <div className="flex items-center gap-3">
        <ButtonDropdown variant="secondary">Label</ButtonDropdown>
        <ButtonDropdown variant="secondary" open>
          Label
        </ButtonDropdown>
        <ButtonDropdown variant="secondary" disabled>
          Label
        </ButtonDropdown>
      </div>
    </div>
  ),
};
