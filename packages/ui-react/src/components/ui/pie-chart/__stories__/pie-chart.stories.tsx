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
  title: 'Widgets/PieChart',
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
    centerLabel: {
      control: 'object',
      description:
        'Donut-only center content: `{ value, label }`. The object editor needs strict JSON — e.g. `{ "value": "835", "label": "Visitors" }`.',
    },
    innerRadius: { control: { type: 'number', min: 0, max: 120 } },
    outerRadius: { control: { type: 'number', min: 40, max: 160 } },
    paddingAngle: { control: { type: 'number', min: 0, max: 10 } },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
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

// Data labels (T15): each slice's value drawn on the arc.
export const Labels: Story = {
  args: { shape: 'pie', showLabels: true },
};

// A donut with a custom center metric (here the total) + a caption.
export const DonutWithCenterLabel: Story = {
  args: {
    shape: 'donut',
    centerLabel: { value: '835', label: 'Visitors' },
  },
};

// Center label with the legend hidden — exercises the `showLegend: false` branch
// of the center nudge (raw cy, no legend-row offset), which the legend-on
// DonutWithCenterLabel baseline can't cover.
export const DonutWithCenterLabelNoLegend: Story = {
  args: {
    shape: 'donut',
    centerLabel: { value: '835', label: 'Visitors' },
    showLegend: false,
  },
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

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    nameKey="browser"
    hideLabel
    formatter={(value, name, item) => (
      <div className="flex w-full items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="capitalize text-muted-foreground">
          {config[name as keyof typeof config]?.label ?? name}
        </span>
        <span className="ms-auto font-mono font-medium tabular-nums">
          {Number(value).toLocaleString()} users
        </span>
      </div>
    )}
  />
);

// Customize the tooltip through the component's `tooltipContent` prop — this is
// the usage example (autodocs). The tooltip is hover-only, so it isn't painted
// here; `CustomTooltipOpen` below is the visual-regression case.
export const CustomTooltip: Story = {
  args: { tooltipContent: customTooltipContent },
};

// The same custom tooltip, forced open for the VR baseline: like `TooltipOpen`,
// this renders the raw composition (recharts can't open a hover tooltip
// statically otherwise) with the shared custom content wired in.
export const CustomTooltipOpen: Story = {
  render: () => (
    <ChartContainer config={config} className="h-[360px] w-[360px]">
      <RechartsPieChart>
        <ChartTooltip defaultIndex={0} active content={customTooltipContent} />
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

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};
