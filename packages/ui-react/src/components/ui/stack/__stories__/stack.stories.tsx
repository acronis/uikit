import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '../stack';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-4 py-2 text-sm">
    {children}
  </div>
);

const meta = {
  title: 'UI/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// args drive the Controls panel; render spreads them so changing a control
// re-renders the Stack.
export const Vertical: Story = {
  args: { direction: 'vertical', gap: 'md' },
  render: (args) => (
    <Stack {...args} className="w-[240px]">
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: { direction: 'horizontal', gap: 'sm' },
  render: (args) => (
    <Stack {...args}>
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};
