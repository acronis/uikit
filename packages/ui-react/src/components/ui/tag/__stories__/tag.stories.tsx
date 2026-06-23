import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheckIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Tag } from '../tag';

const meta = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'Label', variant: 'neutral', size: 'default' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'info',
        'success',
        'warning',
        'critical',
        'danger',
        'neutral',
        'ai',
      ],
      description:
        'Status/category style. Wires container fill, border, label, and icon to the matching `--ui-tag-<variant>-*` token set. The `ai` variant paints a gradient border.',
      table: {
        type: {
          summary:
            "'info' | 'success' | 'warning' | 'critical' | 'danger' | 'neutral' | 'ai'",
        },
        defaultValue: { summary: 'neutral' },
        category: 'Appearance',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      description:
        'Tag height: `default` (24px) or `sm` (20px). Padding is uniform across sizes.',
      table: {
        type: { summary: "'default' | 'sm'" },
        defaultValue: { summary: 'default' },
        category: 'Appearance',
      },
    },
    icon: {
      control: false,
      description: 'Optional leading icon, rendered at 16px before the label.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: 'text',
      description: 'Tag label. Truncates with an ellipsis when it exceeds the max width.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the tag root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = [
  'info',
  'success',
  'warning',
  'critical',
  'danger',
  'neutral',
  'ai',
] as const;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((v) => (
        <Tag key={v} variant={v}>
          {v[0].toUpperCase() + v.slice(1)}
        </Tag>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tag variant="info" size="default">
        Default
      </Tag>
      <Tag variant="info" size="sm">
        Small
      </Tag>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { variant: 'success', icon: <CircleCheckIcon />, children: 'Active' },
};

export const Truncated: Story = {
  args: { variant: 'neutral', children: 'A very long tag label that exceeds the maximum width and truncates' },
};
