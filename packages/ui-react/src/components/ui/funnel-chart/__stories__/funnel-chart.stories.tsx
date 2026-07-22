import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Funnel, FunnelChart as RechartsFunnelChart } from 'recharts';

import { FunnelChart } from '../funnel-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// Stage colors are supplied by the caller via `config`, keyed by each stage's
// nameKey value. There is no chart token tier yet, so these reference the shared
// semantic brand/status tokens (a dedicated data-viz palette is pending an
// upstream design pass). The status tokens are chromatic in every brand;
// `brand-secondary` is brand-dependent.
const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

const config = {
  Visits: { label: 'Visits', color: 'var(--ui-background-brand-secondary)' },
  Signups: {
    label: 'Signups',
    color: 'var(--ui-background-status-strong-success)',
  },
  Trials: {
    label: 'Trials',
    color: 'var(--ui-background-status-strong-warning)',
  },
  Purchases: {
    label: 'Purchases',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'UI/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // text/labels but leaves the backdrop unthemed.
  decorators: [
    (Story) => (
      <div className="rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    config,
    data,
    dataKey: 'value',
    nameKey: 'stage',
    reversed: false,
    showLabels: true,
    showTooltip: true,
    className: 'h-[380px] w-[460px]',
  },
  argTypes: {
    lastShape: { control: 'inline-radio', options: ['triangle', 'rectangle'] },
    reversed: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// The classic funnel narrowing to a point.
export const Triangle: Story = {
  args: { lastShape: 'triangle' },
};

// A flat-bottomed funnel (stacked trapezoids).
export const Rectangle: Story = {
  args: { lastShape: 'rectangle' },
};

// Labels + tooltip toggled off — the baseline that would catch a toggle silently
// becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showLabels: false, showTooltip: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[380px] w-[460px]">
      <RechartsFunnelChart margin={{ top: 8, right: 96, bottom: 8, left: 24 }}>
        <ChartTooltip
          defaultIndex={1}
          active
          content={<ChartTooltipContent nameKey="stage" hideLabel />}
        />
        <Funnel
          dataKey="value"
          nameKey="stage"
          data={data.map((d) => ({ ...d, fill: `var(--color-${d.stage})` }))}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.stage} fill={`var(--color-${entry.stage})`} />
          ))}
        </Funnel>
      </RechartsFunnelChart>
    </ChartContainer>
  ),
};
