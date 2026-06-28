import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '../grid';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-4 py-6 text-center text-sm">
    {children}
  </div>
);

const meta = {
  title: 'UI/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    cols: { control: 'select', options: [1, 2, 3, 4, 6, 12] },
    gap: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// args drive the Controls panel; render spreads them so changing a control
// re-renders the Grid.
export const Default: Story = {
  args: { cols: 3, gap: 'md' },
  render: (args) => (
    <Grid {...args} className="w-[520px]">
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i}>Cell {i + 1}</Box>
      ))}
    </Grid>
  ),
};

// With `container`, the columns respond to the grid's own width. The same
// `cols={3}` grid shows fewer columns in a narrow column than a wide one.
export const Container: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="w-[280px]">
        <Grid container cols={3}>
          {Array.from({ length: 3 }, (_, i) => (
            <Box key={i}>Cell {i + 1}</Box>
          ))}
        </Grid>
      </div>
      <div className="w-[640px]">
        <Grid container cols={3}>
          {Array.from({ length: 3 }, (_, i) => (
            <Box key={i}>Cell {i + 1}</Box>
          ))}
        </Grid>
      </div>
    </div>
  ),
};
