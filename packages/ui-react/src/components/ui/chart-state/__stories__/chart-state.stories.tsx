import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { ChartState } from '../chart-state';

const meta = {
  title: 'Widgets/ChartState',
  component: ChartState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error'],
    },
    variant: {
      control: 'select',
      options: [
        undefined,
        'area',
        'bar',
        'line',
        'donut',
        'radial',
        'funnel',
        'radar',
        'sankey',
        'scatter',
        'treemap',
        'table',
        'text',
      ],
      description:
        'The chart type whose silhouette the `empty` state draws. Ignored by `loading` and `error`.',
    },
    description: { control: 'text' },
    action: { control: false },
  },
} satisfies Meta<typeof ChartState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ChartState fills a chart slot, and a ChartContainer is transparent by design,
// so the stories supply the slot: a chart-sized box on a themed surface, legible
// in both colour modes. Applied per story rather than on the meta, because
// Storybook *composes* story decorators with the meta's instead of replacing
// them — a grid story would end up inside this box and overflow it.
const slot = (Story: () => React.ReactElement) => (
  <div className="flex h-[280px] w-[440px] rounded-lg border border-border bg-background p-6 text-foreground">
    <Story />
  </div>
);

// Spinner + "Data is loading…" while the series are being fetched.
export const Loading: Story = {
  decorators: [slot],
  args: { state: 'loading' },
};

// Warning glyph + "Something went wrong" when the data failed to load.
export const Error: Story = {
  decorators: [slot],
  args: { state: 'error' },
};

// The error state with a retry affordance (matches the Figma "Try again").
export const ErrorWithRetry: Story = {
  decorators: [slot],
  args: {
    state: 'error',
    action: <Button variant="ghost">Try again</Button>,
  },
};

/**
 * Long unbroken CTI error paths stay inside the slot: `break-all` wraps the
 * text and `overflow-y-auto` lets the user scroll when the message is taller
 * than the card. The icon and "Try again" stay visible (top-aligned, not
 * centered) so the user always sees the call-to-action.
 */
export const ErrorLongDescription: Story = {
  decorators: [slot],
  args: {
    state: 'error',
    description:
      "failed to execute 'cti.a.p.dts.func.v1.0~a.ax_core.query.v1.0~a.ax_core.widget.v1.0~a.ax_core.daily_activity_table.v1.0': failed to execute node 'func': failed to build return: failed to execute expression '$func[cti.a.p.dts.func.v1.0~a.ax_core.platform.daily_activity_table.v1.0](query=$.params.query)': failed to execute module function 'Platform.GetDailyActivityTableQuery': failed to query daily_activity_table: unmarshaling error",
    action: <Button variant="ghost">Try again</Button>,
  },
};

// Empty state with no variant: no silhouette, just the default label.
// Covers the path a caller that hasn't migrated to per-type empties still hits.
export const EmptyNoVariant: Story = {
  decorators: [slot],
  args: { state: 'empty' },
};

// A consumer-supplied description overrides the default "No data found".
export const CustomDescription: Story = {
  decorators: [slot],
  args: { state: 'empty', variant: 'bar', description: 'No results for the selected range' },
};

/**
 * The per-type empty states. The design draws a silhouette per chart type, so an
 * empty widget still says what it *would* have shown — which a generic inbox
 * glyph can't.
 *
 * `donut` and `radial` share one ring: a radial-bar widget with no data has
 * nothing to tell it apart from a donut.
 *
 * All eleven are one colour, set on the container and inherited via
 * `currentColor`, so a brand or theme override reaches the artwork.
 */
export const Variants: Story = {
  args: { state: 'empty' },
  parameters: { snapshot: { fullPage: true } },
  render: (args) => (
    <div className="grid grid-cols-4 gap-4">
      {(
        [
          'area',
          'bar',
          'line',
          'donut',
          'radial',
          'funnel',
          'radar',
          'sankey',
          'scatter',
          'treemap',
          'table',
          'text',
        ] as const
      ).map((variant) => (
        <div
          key={variant}
          className="flex h-[220px] w-[240px] flex-col rounded-lg border border-border bg-background p-4 text-foreground"
        >
          <p className="mb-2 shrink-0 text-xs text-muted-foreground">
            {variant}
          </p>
          <ChartState {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

