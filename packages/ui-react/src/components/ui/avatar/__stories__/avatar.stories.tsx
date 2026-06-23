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
      description:
        'Color scheme that tints the fallback background and the initials. Maps to the `--ui-avatar-color-<scheme>` / `--ui-avatar-label-color-<scheme>` token pair.',
      table: {
        type: { summary: "'teal' | 'violet' | 'red' | 'yellow' | 'orange'" },
        defaultValue: { summary: 'teal' },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description:
        'Avatar content — compose `AvatarImage` and/or `AvatarFallback` here.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the avatar root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
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

// A self-contained data-URI image keeps the visual-regression snapshot
// deterministic — a remote URL renders differently when the network is blocked
// (e.g. in CI), which shifts the layout and breaks the baseline.
const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='32' height='32' fill='%234f46e5'/><circle cx='16' cy='13' r='6' fill='white'/><circle cx='16' cy='30' r='10' fill='white'/></svg>";

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src={SAMPLE_IMAGE} alt="Sam Nguyen" />
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
