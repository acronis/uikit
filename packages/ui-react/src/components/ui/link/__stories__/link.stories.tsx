import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from '../link';

const meta = {
  title: 'UI/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'inverse'],
      description:
        'Which surface the link sits on (Figma `background`): `normal` for ordinary surfaces, `inverse` for a backdrop/scrim.',
      table: {
        type: { summary: "'normal' | 'inverse'" },
        defaultValue: { summary: 'normal' },
        category: 'Appearance',
      },
    },
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
      description:
        'Append a trailing external-link icon. No effect when `variant="inverse"`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description:
        'Render inert: disabled color, not focusable, no navigation. Ignored when `variant="inverse"`.',
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

// The `inverse` surface is authored for links over a scrim, so the story supplies the
// same backdrop the Figma frame previews it against.
const OnBackdrop = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-6 rounded-sm bg-[var(--ui-background-backdrop-screen)] p-6">
    {children}
  </div>
);

// No `external` or `disabled` counterpart: the Figma set defines neither on this
// surface, so both props are ignored here.
export const Inverse: Story = {
  render: (args) => (
    <OnBackdrop>
      <Link {...args} />
    </OnBackdrop>
  ),
  args: { variant: 'inverse' },
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
