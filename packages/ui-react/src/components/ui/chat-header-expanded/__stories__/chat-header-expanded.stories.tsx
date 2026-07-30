import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  ChatHeaderExpanded,
  ChatHeaderExpandedTab,
  ChatHeaderExpandedTabs,
} from '../chat-header-expanded';

/**
 * The tab content every story composes. Tabs are PLACEHOLDER markup standing in
 * for the not-yet-shipped standalone `SegmentControl` component — see the block
 * comment in `chat-header-expanded.tsx`.
 */
const tabs = (
  <ChatHeaderExpandedTabs>
    <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
    <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
  </ChatHeaderExpandedTabs>
);

const meta = {
  title: 'UI/ChatHeaderExpanded',
  component: ChatHeaderExpanded,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Header bar of the expanded AI-chat panel (Figma `ChatHeaderExpanded`, node 7329:24759). ' +
          'Tab content is composed via `ChatHeaderExpandedTabs` / `ChatHeaderExpandedTab` children — ' +
          'those two parts are a temporary placeholder for the standalone `SegmentControl` component, ' +
          'which is still in progress in Figma.',
      },
    },
  },
  argTypes: {
    hasHistory: {
      control: 'boolean',
      description:
        'Show the secondary conversation-history icon button before the primary "new chat" action. Mirrors the Figma `hasHistory` property.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    newChatLabel: {
      control: 'text',
      description:
        'Accessible name for the "new chat" action button. Exposed as a prop so consumers can localize it.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'New chat'" },
        category: 'Content',
      },
    },
    historyLabel: {
      control: 'text',
      description:
        'Accessible name for the conversation-history button. Exposed as a prop so consumers can localize it.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Chat history'" },
        category: 'Content',
      },
    },
    children: {
      control: false,
      description:
        'The composed tab group (`ChatHeaderExpandedTabs` + `ChatHeaderExpandedTab`). Labels stay under the consumer’s control.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<header>` element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    children: tabs,
  },
  decorators: [
    (Story) => (
      <div className="w-[512px] bg-[var(--ui-chat-container-color)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatHeaderExpanded>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma `variant=chat` default: first tab active, new-chat action only. */
export const Default: Story = {};

/** The Figma `hasHistory=true` state: history button before the new-chat action. */
export const WithHistory: Story = {
  args: { hasHistory: true },
};

/**
 * The Figma `variant=tasks` selection state. Reached by composition — which tab
 * carries `active` — not by a `variant` prop on the header.
 */
export const TasksTabActive: Story = {
  args: {
    hasHistory: true,
    children: (
      <ChatHeaderExpandedTabs>
        <ChatHeaderExpandedTab>Acronis AI</ChatHeaderExpandedTab>
        <ChatHeaderExpandedTab active counter={7}>
          Tasks
        </ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    ),
  },
};

/** A single tab with no counter — the minimum composition. */
export const SingleTab: Story = {
  args: {
    children: (
      <ChatHeaderExpandedTabs>
        <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    ),
  },
};

/**
 * The tab group's overflow-scroll affordance (Figma `hasScroll`). The chevron
 * buttons render the design's chrome; the real scrolling behavior will land with
 * the standalone `SegmentControl` component.
 */
export const TabsWithScrollAffordance: Story = {
  args: {
    children: (
      <ChatHeaderExpandedTabs hasScroll className="max-w-[214px]">
        <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
        <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
        <ChatHeaderExpandedTab>Automations</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    ),
  },
};

/**
 * Both header states side by side — the design's two rows (Figma
 * `variant=chat` above, `variant=tasks` below).
 */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <ChatHeaderExpanded {...args}>{tabs}</ChatHeaderExpanded>
      <ChatHeaderExpanded {...args} hasHistory>
        <ChatHeaderExpandedTabs>
          <ChatHeaderExpandedTab>Acronis AI</ChatHeaderExpandedTab>
          <ChatHeaderExpandedTab active counter={7}>
            Tasks
          </ChatHeaderExpandedTab>
        </ChatHeaderExpandedTabs>
      </ChatHeaderExpanded>
    </div>
  ),
};
