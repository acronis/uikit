import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChatMenuItemExtras } from '../chat-menu-item-extras';

const meta = {
  title: 'UI/ChatMenuItemExtras',
  component: ChatMenuItemExtras,
  tags: ['autodocs'],
  args: { variant: 'tag', labelTag: 'Label', labelShortcut: '⌘H' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['tag', 'shortcut'],
      description:
        'Which trailing affordance to render. A discriminant, not a style axis — the cluster itself is identical for both values; only the child changes.',
      table: {
        type: { summary: "'tag' | 'shortcut'" },
        category: 'Appearance',
      },
    },
    labelTag: {
      control: 'text',
      description:
        'Tag text for the `tag` variant. Rendered through the shipped `Tag` component, which Figma constrains here to `variant="info" size="sm"`.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    labelShortcut: {
      control: 'text',
      description:
        'Keyboard-shortcut text for the `shortcut` variant (e.g. `⌘H`). Rendered at the body/default type scale in the muted shortcut color.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the cluster root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ChatMenuItemExtras>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TagVariant: Story = {
  name: 'Variant: tag',
  args: { variant: 'tag', labelTag: 'Label' },
};

export const ShortcutVariant: Story = {
  name: 'Variant: shortcut',
  args: { variant: 'shortcut', labelShortcut: '⌘H' },
};

// `alignItems: flex-start` keeps each cluster shrink-wrapped: the root is
// `inline-flex`, so a stretching column would blow it out to the full viewport
// width and push its content to the far edge.
export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <ChatMenuItemExtras {...args} variant="tag" labelTag="Label" />
      <ChatMenuItemExtras {...args} variant="shortcut" labelShortcut="⌘H" />
    </div>
  ),
};

// The cluster is right-aligned inside a fixed-width row — the shape it takes on
// a real chat menu item. `justify-end` is flex-end (direction-aware), so this
// also demonstrates the RTL mirroring without a physical `right-`/`mr-` utility.
export const InAMenuItemRow: Story = {
  name: 'In a menu item row',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 280 }}>
      {(
        [
          { variant: 'tag', labelTag: 'Beta', label: 'Assistant' },
          { variant: 'shortcut', labelShortcut: '⌘H', label: 'History' },
          { variant: 'shortcut', labelShortcut: '⌘N', label: 'New chat' },
        ] as const
      ).map((row) => (
        <div
          key={row.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            height: 40,
            paddingInline: 16,
          }}
        >
          <span className="ui-chat-menu-item-label-text-style text-[var(--ui-chat-menu-item-label-color)]">
            {row.label}
          </span>
          <ChatMenuItemExtras
            {...args}
            variant={row.variant}
            labelTag={'labelTag' in row ? row.labelTag : undefined}
            labelShortcut={
              'labelShortcut' in row ? row.labelShortcut : undefined
            }
          />
        </div>
      ))}
    </div>
  ),
};

// A long tag label proves the Tag's own ellipsis truncation still governs inside
// the cluster (the extras root clips overflow, it does not re-implement it).
export const LongTagLabel: Story = {
  name: 'Long tag label',
  args: { variant: 'tag', labelTag: 'Preview build — internal only' },
};
