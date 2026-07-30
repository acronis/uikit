import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ClipboardTextIcon,
  MessageTextIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { ChatMenuItemCollapsed } from '../chat-menu-item-collapsed';

const meta = {
  title: 'UI/ChatMenuItemCollapsed',
  component: ChatMenuItemCollapsed,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['idle'],
      description:
        'Fill wiring — mirrors the Figma ChatMenuItemCollapsed `variant` property. `idle` is the only signed-off value; hover / active / focus are painted as real interaction states, not prop values.',
      table: {
        type: { summary: "'idle'" },
        defaultValue: { summary: 'idle' },
        category: 'Appearance',
      },
    },
    icon: {
      control: false,
      description:
        'The 16px glyph shown in place of the label while the rail is collapsed. Mono icons inherit `--ui-chat-menu-item-icon-color`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    hasAlert: {
      control: 'boolean',
      description:
        'Show the red alert dot over the glyph. Decorative — repeat the alert in `aria-label`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    'aria-label': {
      control: 'text',
      description:
        'Required accessible name — the item is icon-only, so there is no visible label to read.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    onClick: {
      control: false,
      description: 'Fired when the item is activated (click, Enter, Space).',
      table: { type: { summary: '(event) => void' }, category: 'Events' },
    },
  },
  args: {
    'aria-label': 'Chats',
    icon: <MessageTextIcon />,
  },
} satisfies Meta<typeof ChatMenuItemCollapsed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAlert: Story = {
  args: { hasAlert: true, 'aria-label': 'Chats, unread messages' },
};

export const WithoutIcon: Story = {
  args: { icon: undefined },
};

/** The collapsed 48px rail: a stack of items, which is how the design ships. */
export const CollapsedRail: Story = {
  render: (args) => (
    <div className="flex w-12 flex-col bg-background">
      <ChatMenuItemCollapsed
        {...args}
        aria-label="New chat"
        icon={<PlusIcon />}
      />
      <ChatMenuItemCollapsed
        {...args}
        aria-label="Chats, unread messages"
        icon={<MessageTextIcon />}
        hasAlert
      />
      <ChatMenuItemCollapsed
        {...args}
        aria-label="Notes"
        icon={<ClipboardTextIcon />}
      />
    </div>
  ),
};
