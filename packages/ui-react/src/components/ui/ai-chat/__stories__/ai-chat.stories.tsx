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
      description:
        'Controlled variant. Leave unset (use `defaultVariant` below) for ' +
        'uncontrolled use — otherwise variant-switch buttons/drag-resize only ' +
        'fire `onVariantChange` and never change the render themselves.',
      table: {
        type: { summary: "'collapsed' | 'expanded' | 'full-width'" },
        defaultValue: { summary: "'full-width'" },
        category: 'Appearance',
      },
    },
    defaultVariant: {
      control: 'select',
      options: ['collapsed', 'expanded', 'full-width'],
      description: 'Uncontrolled initial variant. Ignored when `variant` is set.',
      table: {
        type: { summary: "'collapsed' | 'expanded' | 'full-width'" },
        defaultValue: { summary: "'full-width'" },
        category: 'Appearance',
      },
    },
    onVariantChange: {
      control: false,
      description: 'Fires whenever a button or drag-resize changes the variant.',
      table: { type: { summary: '(variant) => void' }, category: 'Events' },
    },
    resizable: {
      control: 'boolean',
      description:
        'Enable the draggable resize edge on the start border. Dragging within ' +
        "`expanded`'s width range resizes it live; dragging past the floor snaps " +
        'to `collapsed` (and back out past the same threshold re-expands it) — ' +
        'mirroring `SidebarSecondary`. No edge renders for `full-width`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Behavior',
      },
    },
    width: {
      control: false,
      description: 'Controlled width in px while `variant="expanded"` (only meaningful with `resizable`).',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    onWidthChange: {
      control: false,
      description: 'Fires when the width changes due to a drag/keyboard interaction.',
      table: { type: { summary: '(width) => void' }, category: 'Events' },
    },
    resizeAriaLabel: {
      control: false,
      description: "Accessible label for the resize edge (`role=\"separator\"`).",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Resize chat'" },
        category: 'Accessibility',
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

/**
 * Uncontrolled + `resizable`: every variant-switch action is wired instead of
 * inert. Drag the panel's start edge — it resizes live while `expanded`,
 * snaps to `collapsed` past the floor, and re-expands dragging back out past
 * the same threshold (mirroring `SidebarSecondary`'s collapse-on-drag). Or
 * use the footer/rail buttons (Maximize/Minimize/Collapse chat, "Show
 * full-width chat"). This is one answer to the README's "how does a consumer
 * move between variants" open question — combining the discrete actions
 * Figma drew with a continuous drag, rather than picking one exclusively.
 */
export const Interactive: Story = {
  args: {
    defaultVariant: 'expanded',
    resizable: true,
    children: (
      <p className="p-4 text-sm text-muted-foreground">
        Conversation content goes here.
      </p>
    ),
  },
};
