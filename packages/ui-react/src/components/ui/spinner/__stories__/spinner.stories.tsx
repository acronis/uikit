import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from '../spinner';

const meta = {
  title: 'UI/Spinner [Internal, Deprecated]',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Internal.** Not exported from the public entry point — consumed by `Loading`/`Toast`.\n\n' +
          '**Deprecated.** Use `Loading` for a standalone loading indicator.',
      },
    },
  },
  tags: ['autodocs', 'internal', 'deprecated'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Diameter — sm 16 · md 24 · lg 32 · xl 48 (px).',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' },
        category: 'Appearance',
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};
