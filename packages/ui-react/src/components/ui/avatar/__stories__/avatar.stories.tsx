import type { Meta, StoryObj } from '@storybook/react-vite';

import { UserIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { color: 'teal' },
  argTypes: {
    color: {
      control: 'select',
      options: [
        'teal',
        'violet',
        'red',
        'yellow',
        'orange',
        'blue',
        'gray',
        'green',
      ],
      description:
        'Color scheme that tints the fallback background and the initials. Maps to the `--ui-avatar-color-<scheme>` / `--ui-avatar-label-color-<scheme>` token pair.',
      table: {
        type: {
          summary:
            "'teal' | 'violet' | 'red' | 'yellow' | 'orange' | 'blue' | 'gray' | 'green'",
        },
        defaultValue: { summary: 'teal' },
        category: 'Appearance',
      },
    },
    variant: {
      control: 'select',
      options: ['text', 'icon'],
      description:
        'Selects the auto-rendered content when no `children` are composed: `label` (initials) or `icon`. Ignored once `children` are composed.',
      table: {
        type: { summary: "'text' | 'icon'" },
        defaultValue: { summary: 'text' },
        category: 'Appearance',
      },
    },
    label: {
      control: 'text',
      description:
        'Initials shown for the `text` variant when no `children` are composed.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'SB' },
        category: 'Content',
      },
    },
    icon: {
      control: false,
      description:
        'Icon shown for the `icon` variant when no `children` are composed — typically a 16px icon from `@acronis-platform/icons-react`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: false,
      description:
        'Avatar content — compose `AvatarImage` and/or `AvatarFallback` here. Takes precedence over `variant`/`label`/`icon`.',
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

const COLORS = [
  'teal',
  'violet',
  'red',
  'yellow',
  'orange',
  'blue',
  'gray',
  'green',
] as const;

export const Default: Story = {
  render: (args) => <Avatar {...args} />,
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {COLORS.map((color) => (
        <Avatar
          key={color}
          color={color}
          label={color.slice(0, 2).toUpperCase()}
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar color="blue" variant="text" label="SB" />
      <Avatar color="blue" variant="icon" icon={<UserIcon size={16} />} />
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

// Figma's AvatarGroup ships four fixed sizes (one/two/three/four avatars),
// each optionally paired with a trailing label — this demonstrates the full
// range via the same flexible, children-driven `AvatarGroup` composition.
const GROUP_MEMBERS = [
  { color: 'teal', label: 'SN' },
  { color: 'violet', label: 'GA' },
  { color: 'red', label: 'DR' },
  { color: 'yellow', label: 'FW' },
] as const;

export const GroupSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((count) => (
        <div
          key={count}
          className="flex items-center gap-[var(--ui-avatar-global-container-gap)]"
        >
          <AvatarGroup>
            {GROUP_MEMBERS.slice(0, count).map(({ color, label }) => (
              <Avatar key={label} color={color} label={label} />
            ))}
          </AvatarGroup>
          <span className="text-sm leading-6 text-[var(--ui-avatar-global-text-color)]">
            On this ticket
          </span>
        </div>
      ))}
    </div>
  ),
};

export const GroupWithIconAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--ui-avatar-global-container-gap)]">
      <AvatarGroup>
        <Avatar color="teal" variant="icon" icon={<UserIcon size={16} />} />
        <Avatar color="violet" variant="icon" icon={<UserIcon size={16} />} />
        <Avatar color="gray" variant="icon" icon={<UserIcon size={16} />} />
      </AvatarGroup>
      <span className="text-sm leading-6 text-[var(--ui-avatar-global-text-color)]">
        On this ticket
      </span>
    </div>
  ),
};
