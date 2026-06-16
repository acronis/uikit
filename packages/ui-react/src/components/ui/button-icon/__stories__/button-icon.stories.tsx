import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonIcon } from '../button-icon';

const PlusIcon = () => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: 'UI/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['ghost', 'secondary'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Add',
    children: <PlusIcon />,
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonIcon aria-label="Add">
        <PlusIcon />
      </ButtonIcon>
      <ButtonIcon aria-label="Add" variant="secondary">
        <PlusIcon />
      </ButtonIcon>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonIcon aria-label="Add">
          <PlusIcon />
        </ButtonIcon>
        <ButtonIcon aria-label="Add" disabled>
          <PlusIcon />
        </ButtonIcon>
      </div>
      <div className="flex items-center gap-3">
        <ButtonIcon aria-label="Add" variant="secondary">
          <PlusIcon />
        </ButtonIcon>
        <ButtonIcon aria-label="Add" variant="secondary" disabled>
          <PlusIcon />
        </ButtonIcon>
      </div>
    </div>
  ),
};
