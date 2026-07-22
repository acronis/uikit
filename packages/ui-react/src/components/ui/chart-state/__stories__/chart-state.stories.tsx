import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { ChartState } from '../chart-state';

const meta = {
  title: 'UI/ChartState',
  component: ChartState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // ChartState fills a chart slot, and a ChartContainer is transparent by
  // design. Render the stories in a chart-sized box on a themed surface so the
  // placeholder is legible in both light and dark (mirrors the chart stories).
  decorators: [
    (Story) => (
      <div className="h-[280px] w-[440px] rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error'],
    },
    message: { control: 'text' },
    action: { control: false },
  },
} satisfies Meta<typeof ChartState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Spinner + "Data is loading…" while the series are being fetched.
export const Loading: Story = {
  args: { state: 'loading' },
};

// Inbox glyph + "No data found" when the query returns nothing to plot.
export const Empty: Story = {
  args: { state: 'empty' },
};

// Warning glyph + "Something went wrong" when the data failed to load.
export const Error: Story = {
  args: { state: 'error' },
};

// The error state with a retry affordance (matches the Figma "Try again").
export const ErrorWithRetry: Story = {
  args: {
    state: 'error',
    action: <Button variant="ghost">Try again</Button>,
  },
};

// A caller-supplied label overrides the per-state default.
export const CustomMessage: Story = {
  args: { state: 'empty', message: 'No results for the selected range' },
};
