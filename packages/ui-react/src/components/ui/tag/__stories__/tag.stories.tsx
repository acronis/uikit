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
      options: ['info', 'success', 'warning', 'critical', 'danger', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['default', 'sm'] },
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
