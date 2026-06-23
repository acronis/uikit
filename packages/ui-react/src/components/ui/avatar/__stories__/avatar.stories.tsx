import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { color: 'teal' },
  argTypes: {
    color: {
      control: 'select',
      options: ['teal', 'violet', 'red', 'yellow', 'orange'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = ['teal', 'violet', 'red', 'yellow', 'orange'] as const;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>SN</AvatarFallback>
    </Avatar>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {COLORS.map((color) => (
        <Avatar key={color} color={color}>
          <AvatarFallback>{color.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://i.pravatar.cc/64?img=12"
        alt="Sam Nguyen"
      />
      <AvatarFallback>SN</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar color="teal">
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
      <Avatar color="violet">
        <AvatarFallback>GA</AvatarFallback>
      </Avatar>
      <Avatar color="red">
        <AvatarFallback>SI</AvatarFallback>
      </Avatar>
      <Avatar color="yellow">
        <AvatarFallback>IG</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const GroupWithText: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--ui-avatar-global-container-gap)]">
      <AvatarGroup>
        <Avatar color="teal">
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
        <Avatar color="violet">
          <AvatarFallback>GA</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <span className="text-sm leading-6 text-[var(--ui-avatar-global-text-color)]">
        On this ticket
      </span>
    </div>
  ),
};
