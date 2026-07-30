import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageTextIcon } from '@acronis-platform/icons-react/stroke-mono';

import { ChatHeaderCollapsed } from '../chat-header-collapsed';

const meta = {
  title: 'UI/ChatHeaderCollapsed',
  component: ChatHeaderCollapsed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Header bar of the collapsed AI-chat rail (Figma `ChatHeaderCollapsed`, node 7329:24771). ' +
          'A static 48px band centering one branding glyph, composed through the shared `TagIcon`.',
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description:
        'The branding glyph, centered at 16px inside the composed `TagIcon`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    hasHistory: {
      control: 'boolean',
      description:
        'Mirrors the Figma `hasHistory` property. Currently a no-op — the captured instance shows no visible change for either value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<header>` element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    icon: <MessageTextIcon />,
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--ui-chat-container-color)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatHeaderCollapsed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutIcon: Story = {
  args: { icon: undefined },
};

/** `hasHistory` currently renders identically either way — see the docs note. */
export const WithHistory: Story = {
  args: { hasHistory: true },
};

/** The collapsed rail: the header band sitting above a stack of menu rows. */
export const CollapsedRail: Story = {
  render: (args) => (
    <div className="flex w-12 flex-col bg-[var(--ui-chat-container-color)]">
      <ChatHeaderCollapsed {...args} />
    </div>
  ),
};
