import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';

import { PieChart } from '../pie-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../chart';

// Slice colors are supplied by the caller via `config`, keyed by the slice's
// nameKey value. There is no chart token tier yet, so these reference the shared
// semantic brand/status tokens (a dedicated data-viz palette is pending an
// upstream design pass). The status tokens are chromatic in every brand;
// `brand-secondary` is brand-dependent.
const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
  { browser: 'Edge', value: 173 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: { label: 'Safari', color: 'var(--ui-background-status-strong-danger)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // text/legend but leaves the backdrop unthemed.
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
    nameKey: 'browser',
    innerRadius: 60,
    paddingAngle: 0,
    showTooltip: true,
    showLegend: true,
    className: 'h-[360px] w-[360px]',
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['pie', 'donut'] },
    innerRadius: { control: { type: 'number', min: 0, max: 120 } },
    outerRadius: { control: { type: 'number', min: 40, max: 160 } },
    paddingAngle: { control: { type: 'number', min: 0, max: 10 } },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// A filled pie.
export const Pie_: Story = {
  args: { shape: 'pie' },
};

// A hollow-centre donut.
export const Donut: Story = {
  args: { shape: 'donut' },
};

// Chrome (tooltip + legend) toggled off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { shape: 'donut', showTooltip: false, showLegend: false },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsPieChart>
        <ChartTooltip
          defaultIndex={0}
          active
          content={<ChartTooltipContent nameKey="browser" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="browser"
          outerRadius={120}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.browser} fill={`var(--color-${entry.browser})`} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  ),
};
