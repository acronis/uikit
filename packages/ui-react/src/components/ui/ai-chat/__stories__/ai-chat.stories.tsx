import type { Meta, StoryObj } from '@storybook/react-vite';

import { AiChat } from '../ai-chat';

const meta = {
  title: 'UI/AiChat',
  component: AiChat,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The root AI-chat shell (Figma `AiChat`, node 7329:24933), composed from ' +
          '`ChatHeaderCollapsed`, `ChatHeaderExpanded`, `ChatMenuItem`, and `ChatMenuItemCollapsed`. ' +
          'It switches between three layouts via `variant`: a 48px icon-only rail, a 384–512px ' +
          'tabbed panel, and a full-width two-pane view. The root prop surface is intentionally ' +
          'limited to `variant` — the header tabs, chat-history list, per-conversation title, and ' +
          'the variant-switch actions render fixed placeholder content pending open questions to ' +
          'design/product (see the README in `packages/ui-spec/components/ai-chat`).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['collapsed', 'expanded', 'full-width'],
      description: 'Which of the three AI-chat layouts to render.',
      table: {
        type: { summary: "'collapsed' | 'expanded' | 'full-width'" },
        defaultValue: { summary: "'full-width'" },
        category: 'Appearance',
      },
    },
    children: {
      control: false,
      description:
        'The chat feed/content area. Only rendered for `expanded` and `full-width` — the ' +
        '`collapsed` rail has no room to show it.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<aside>` element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] bg-[var(--ui-chat-container-color)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AiChat>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma `variant=full-width` default: chat-list sidebar + conversation body. */
export const Default: Story = {};

/** The Figma `variant=collapsed` instance (node 7329:24930): a 48px icon-only rail. */
export const Collapsed: Story = {
  args: { variant: 'collapsed' },
};

/** The Figma `variant=expanded` instance (node 7329:24931): a tabbed panel with a feed. */
export const Expanded: Story = {
  args: {
    variant: 'expanded',
    children: (
      <p className="p-4 text-sm text-muted-foreground">
        Conversation content goes here.
      </p>
    ),
  },
};

/** The Figma `variant=full-width` instance (node 7329:24932) with feed content supplied. */
export const FullWidth: Story = {
  args: {
    variant: 'full-width',
    children: (
      <p className="p-4 text-sm text-muted-foreground">
        Conversation content goes here.
      </p>
    ),
  },
};

/** All three variants side by side, matching the Figma frame that shows them together. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex h-[600px] items-stretch">
      <AiChat variant="collapsed" />
      <AiChat variant="expanded" />
      <AiChat variant="full-width" />
    </div>
  ),
};
