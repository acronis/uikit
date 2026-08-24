import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Funnel, FunnelChart as RechartsFunnelChart } from 'recharts';

import { FunnelChart } from '../funnel-chart';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
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
  Visits: { label: 'Visits' },
  Signups: {
    label: 'Signups',
  },
  Trials: {
    label: 'Trials',
  },
  Purchases: {
    label: 'Purchases',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/FunnelChart',
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
    ...paletteArgTypes,
    lastShape: { control: 'inline-radio', options: ['triangle', 'rectangle'] },
    reversed: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    labelFormat: {
      control: 'select',
      options: [
        'name',
        'value',
        'percent',
        'name-value',
        'name-percent',
        'value-percent',
      ],
    },
    labelPosition: {
      control: 'inline-radio',
      options: ['right', 'left', 'inside'],
    },
    showValueLabels: { control: 'boolean' },
    valuePosition: {
      control: 'inline-radio',
      options: ['right', 'left', 'inside'],
    },
    showLegend: { control: 'boolean' },
    legendPos: { control: 'inline-radio', options: ['top', 'bottom'] },
    colorMode: { control: 'inline-radio', options: ['palette', 'gradient'] },
    showActiveShape: { control: 'boolean' },
    funnelWidth: { control: { type: 'number' } },
    showTooltip: { control: 'boolean' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
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

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    nameKey="stage"
    hideLabel
    formatter={(value, name, item) => (
      <div className="flex w-full items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-muted-foreground">
          {config[name as keyof typeof config]?.label ?? name}
        </span>
        <span className="ms-auto font-mono font-medium tabular-nums">
          {Number(value).toLocaleString()}
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
    <ChartContainer config={config} className="h-[380px] w-[460px]">
      <RechartsFunnelChart margin={{ top: 8, right: 96, bottom: 8, left: 24 }}>
        <ChartTooltip defaultIndex={1} active content={customTooltipContent} />
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

// The legend names the stages below the funnel. Off by default — a funnel
// already labels its stages on the chart — so it's opt-in for the cases where
// the on-chart labels carry values instead of names.
export const WithLegend: Story = {
  args: { showLegend: true, labelFormat: 'value', labelPosition: 'right' },
};

// The same legend on the top edge.
export const LegendTop: Story = {
  args: {
    showLegend: true,
    legendPos: 'top',
    labelFormat: 'value',
  },
};

// One hue ramped from the widest stage to the narrowest, instead of a colour per
// stage. The ramp's base is the first stage's own `config` colour unless
// `gradientColor` names another.
export const GradientColors: Story = {
  args: {
    colorMode: 'gradient',
    showLegend: true,
    labelFormat: 'name-percent',
  },
};

// A ramp off a caller-supplied hue.
export const GradientBrandHue: Story = {
  args: {
    colorMode: 'gradient',
    gradientColor: 'var(--ui-background-brand-primary)',
    labelFormat: 'name-percent',
  },
};

// `stageSettings` recolours one stage and drops another. A hidden stage leaves
// the funnel entirely, so the conversions are measured over what's left.
export const PerStage: Story = {
  args: {
    stageSettings: {
      // The `strong` status tokens are the data-viz-weight ones; the plain
      // `status-*` backgrounds are tints for banners and wash out as a fill.
      Trials: { color: 'var(--ui-background-status-strong-info)' },
      Purchases: { hidden: true },
    },
    labelFormat: 'name-percent',
  },
};

// Both label lists at once: the name on one side of the funnel, its value on the
// other. The default `valuePosition`, so the last stage's number stays legible —
// a funnel narrows, so its tail segments can't hold a label.
export const ValueLabels: Story = {
  args: { showValueLabels: true },
};

// Labels on the segments. Only the short formats fit down there, so this pairs an
// `inside` conversion with the legend carrying the names.
export const InsideLabels: Story = {
  args: {
    labelPosition: 'inside',
    labelFormat: 'percent',
    showLegend: true,
  },
};

// The stage names on the left instead. `valuePosition` isn't set: the values
// default to the side opposite the names, so they follow them to the right.
export const LeftLabels: Story = {
  args: {
    labelPosition: 'left',
    labelFormat: 'name-percent',
    showValueLabels: true,
  },
};

// `showActiveShape` outlines the hovered segment instead of recolouring it. The
// hover itself is not deterministic, so this is excluded from VR (it exists for
// the docs/controls); the outline is asserted in the unit tests.
export const ActiveShape: Story = {
  args: { showActiveShape: true, labelFormat: 'name-percent' },
  parameters: { snapshot: { skip: true } },
};

// Segment borders + a narrowed funnel: `stroke` / `strokeWidth` separate the
// stages, `funnelWidth` keeps the shape off the labels.
export const SegmentBorders: Story = {
  args: {
    stroke: 'var(--ui-border-on-surface-border)',
    strokeWidth: 2,
    funnelWidth: '65%',
    showValueLabels: true,
  },
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};
