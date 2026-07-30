import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ClipboardTextIcon,
  MessageTextIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ChatMenuItem } from '../chat-menu-item';
import { ChatMenuItemExtras } from '@/components/ui/chat-menu-item-extras';

const meta = {
  title: 'UI/ChatMenuItem',
  component: ChatMenuItem,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description:
        'The 16px glyph identifying the chat. Mono icons inherit `--ui-chat-menu-item-icon-color`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    label: {
      control: 'text',
      description: "The chat's title, rendered as the row's visible label.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    state: {
      control: 'select',
      options: ['idle', 'active'],
      description:
        'idle | active — mirrors the live Figma `state` property. `active` marks the currently-open chat (also sets `aria-current="page"`); `hover` / `focused` are painted as real interaction states, not prop values.',
      table: {
        type: { summary: "'idle' | 'active'" },
        defaultValue: { summary: 'idle' },
        category: 'State',
      },
    },
    hasExtras: {
      control: 'boolean',
      description: 'Show the trailing `extras` cluster.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Content',
      },
    },
    extras: {
      control: false,
      description:
        'The trailing affordance cluster, composed as a `ChatMenuItemExtras` element. Only rendered when `hasExtras` is set.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    onClick: {
      control: false,
      description: 'Fired when the item is activated (click, Enter, Space).',
      table: { type: { summary: '(event) => void' }, category: 'Events' },
    },
  },
  args: {
    label: 'Menu item',
    icon: <MessageTextIcon />,
  },
} satisfies Meta<typeof ChatMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { state: 'active' },
};

export const WithExtras: Story = {
  name: 'With extras',
  args: {
    hasExtras: true,
    extras: <ChatMenuItemExtras labelTag="Beta" />,
  },
};

/** The expanded 256px rail: a stack of items, which is how the design ships. */
export const ExpandedRail: Story = {
  render: () => (
    <div className="flex w-64 flex-col bg-background">
      <ChatMenuItem
        label="Assistant"
        icon={<MessageTextIcon />}
        hasExtras
        extras={<ChatMenuItemExtras labelTag="Beta" />}
      />
      <ChatMenuItem
        label="Q3 roadmap"
        icon={<MessageTextIcon />}
        state="active"
      />
      <ChatMenuItem label="Release notes" icon={<ClipboardTextIcon />} />
    </div>
  ),
};
