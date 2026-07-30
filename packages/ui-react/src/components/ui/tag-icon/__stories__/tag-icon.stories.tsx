import {
  ClipboardTextIcon,
  MessageTextIcon,
  SquareDashedIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TagIcon } from '../tag-icon';

const meta = {
  title: 'UI/TagIcon',
  component: TagIcon,
  tags: ['autodocs'],
  args: { color: 'violet', icon: <SquareDashedIcon /> },
  argTypes: {
    color: {
      control: 'select',
      options: ['violet'],
      description:
        'Palette scheme that tints the container and the glyph. Maps to the `--ui-avatar-color-<scheme>` / `--ui-avatar-label-color-<scheme>` token pair. Only `violet` is exposed today — the Figma set declares eight schemes but the Avatar token tier defines five and none of blue/gray/green.',
      table: {
        type: { summary: "'violet'" },
        defaultValue: { summary: 'violet' },
        category: 'Appearance',
      },
    },
    icon: {
      control: false,
      description:
        'The icon to render, centered at 16px. Backs the `Icon` slot in Figma.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the badge root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof TagIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The glyph is swappable — the badge only owns the 32px box, the tint, and the
// 16px icon size, so any icons-react icon drops in unchanged.
export const Icons: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <TagIcon {...args} icon={<SquareDashedIcon />} />
      <TagIcon {...args} icon={<MessageTextIcon />} />
      <TagIcon {...args} icon={<ClipboardTextIcon />} />
    </div>
  ),
};

// When the glyph carries meaning that isn't repeated nearby, the consumer labels
// the badge through the forwarded span attributes rather than a dedicated prop.
export const Labelled: Story = {
  render: (args) => (
    <TagIcon {...args} role="img" aria-label="Draft" icon={<SquareDashedIcon />} />
  ),
};
