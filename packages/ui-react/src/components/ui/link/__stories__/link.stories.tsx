import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from '../link';

const meta = {
  title: 'UI/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The link label.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    href: {
      control: 'text',
      description: 'Navigation target (dropped when `disabled`).',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    external: {
      control: 'boolean',
      description: 'Append a trailing external-link icon.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Render inert: disabled color, not focusable, no navigation.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    render: {
      control: false,
      description: 'Render as another element/component (e.g. a router link).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    children: 'Link',
    href: '#',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: { external: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// Inline within a sentence — the common usage.
export const InProse: Story = {
  render: (args) => (
    <p className="text-sm leading-6 text-[var(--ui-text-on-surface-primary)]">
      Read the <Link {...args}>documentation</Link> for more details.
    </p>
  ),
  args: { children: 'documentation' },
};
