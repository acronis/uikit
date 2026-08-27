import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from 'recharts';

import { RadarChart } from '../radar-chart';
import { ButtonIcon } from '../../button-icon';
import { ChartWidget } from '../../chart-widget';
import { paletteArgTypes } from '../../chart/__stories__/palette-control';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  formatCompactNumber,
  type ChartConfig,
} from '../../chart';

// Series colors are supplied by the caller via `config`. There is no chart token
// tier yet, so these reference the shared semantic brand/status tokens (a
// dedicated data-viz palette is pending an upstream design pass). The status
// tokens are chromatic in every brand; `brand-secondary` is brand-dependent.
const data = [
  { subject: 'Math', alice: 120, bob: 110, carol: 95 },
  { subject: 'Chinese', alice: 98, bob: 130, carol: 105 },
  { subject: 'English', alice: 86, bob: 130, carol: 140 },
  { subject: 'Geography', alice: 99, bob: 100, carol: 88 },
  { subject: 'Physics', alice: 85, bob: 90, carol: 120 },
  { subject: 'History', alice: 65, bob: 85, carol: 110 },
];

const config = {
  alice: { label: 'Alice' },
  bob: { label: 'Bob' },
  carol: { label: 'Carol' },
} satisfies ChartConfig;

const widgetData = [
  { subject: 'Math', desktop: 120, mobile: 110 },
  { subject: 'Chinese', desktop: 98, mobile: 130 },
  { subject: 'English', desktop: 86, mobile: 140 },
  { subject: 'Geography', desktop: 99, mobile: 100 },
  { subject: 'Physics', desktop: 85, mobile: 90 },
  { subject: 'History', desktop: 65, mobile: 110 },
];

const widgetConfig = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    config,
    data,
    dataKeys: ['alice', 'bob', 'carol'],
    angleKey: 'subject',
    fillOpacity: 0.3,
    strokeWidth: 2,
    showDots: true,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
  },
  argTypes: {
    ...paletteArgTypes,
    gridType: { control: 'inline-radio', options: ['polygon', 'circle'] },
    fillOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    strokeWidth: { control: { type: 'number', min: 0, max: 6 } },
    showDots: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
    animationDuration: { control: { type: 'number' } },
    animationBegin: { control: { type: 'number' } },
    animationEasing: {
      control: 'select',
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
    },
    showLabels: { control: 'boolean' },
    labelPosition: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'center',
        'insideTop',
        'insideBottom',
        'insideLeft',
        'insideRight',
        'insideStart',
        'insideEnd',
      ],
    },
    dotRadius: { control: { type: 'number', min: 1, max: 8 } },
    activeDot: { control: 'boolean' },
    radialLines: { control: 'boolean' },
    showAngleAxis: { control: 'boolean' },
    angleAxisOrientation: {
      control: 'inline-radio',
      options: ['outer', 'inner'],
    },
    angleAxisLine: { control: 'boolean' },
    angleAxisLineType: {
      control: 'inline-radio',
      options: ['polygon', 'circle'],
    },
    angleTickLine: { control: 'boolean' },
    angleTickSize: { control: { type: 'number', min: 0, max: 40 } },
    showRadiusAxis: { control: 'boolean' },
    radiusAxisAngle: { control: { type: 'number', min: -180, max: 180 } },
    radiusAxisOrientation: {
      control: 'inline-radio',
      options: ['left', 'right', 'middle'],
    },
    radiusAxisDomain: { control: 'inline-radio', options: ['auto', 'fixed'] },
    radiusAxisDomainMax: { control: { type: 'number' } },
    radiusAxisTickCount: { control: { type: 'number', min: 2, max: 10 } },
    radiusAxisReversed: { control: 'boolean' },
    startAngle: { control: { type: 'number', min: -360, max: 360 } },
    endAngle: { control: { type: 'number', min: -360, max: 360 } },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default polygon (straight-edged) web.
export const Polygon: Story = {
  args: {
    gridType: 'polygon',
    className: 'w-[420px]',
  },
};

// The Figma ChartRadar md variant (node 9005:73390), composed with the shared
// ChartWidget card. The widget owns the card chrome; RadarChart owns the plot.
export const WidgetExample: Story = {
  args: {
    config: widgetConfig,
    data: widgetData,
    dataKeys: ['desktop', 'mobile'],
    outerRadius: 78,
    dotRadius: 2,
  },
  render: () => (
    <ChartWidget
      className="h-[320px] w-[592px]"
      header={{
        title: 'Title',
        actions: (
          <ButtonIcon variant="ghost" aria-label="Widget actions">
            <EllipsisIcon size={16} />
          </ButtonIcon>
        ),
      }}
    >
      <RadarChart
        config={widgetConfig}
        data={widgetData}
        dataKeys={['desktop', 'mobile']}
        angleKey="subject"
        dotRadius={2}
        className="size-full"
      />
    </ChartWidget>
  ),
};

// A circular web instead of straight polygon rings.
export const Circle: Story = {
  args: { gridType: 'circle', outerRadius: 80 },
};

// Grid + tooltip + legend toggled off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: {
    showGrid: false,
    showTooltip: false,
    showLegend: false,
    className: 'w-[420px]',
  },
};

// The tooltip is hover-only, so a normal story never snapshots it. This renders
// the raw composition so recharts' `defaultIndex` can open the tooltip
// statically for the visual-regression baseline (see the skill's VR note).
export const TooltipOpen: Story = {
  render: () => (
    <ChartContainer
      config={config}
      className="h-[380px] w-[420px] [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground"
    >
      <RechartsRadarChart data={data}>
        <ChartTooltip defaultIndex={0} active content={<ChartTooltipContent />} />
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          dataKey="alice"
          stroke="var(--color-alice)"
          fill="var(--color-alice)"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
        <Radar
          dataKey="bob"
          stroke="var(--color-bob)"
          fill="var(--color-bob)"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
      </RechartsRadarChart>
    </ChartContainer>
  ),
};

// A configured `ChartTooltipContent` (from this library, no recharts needed).
// Shared by the two stories below.
const customTooltipContent = (
  <ChartTooltipContent
    labelFormatter={(label) => `${label} · skill score`}
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
    <ChartContainer
      config={config}
      className="h-[380px] w-[420px] [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground"
    >
      <RechartsRadarChart data={data}>
        <ChartTooltip defaultIndex={0} active content={customTooltipContent} />
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          dataKey="alice"
          stroke="var(--color-alice)"
          fill="var(--color-alice)"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
        <Radar
          dataKey="bob"
          stroke="var(--color-bob)"
          fill="var(--color-bob)"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
      </RechartsRadarChart>
    </ChartContainer>
  ),
};

// Entrance animation on — a live example. Excluded from VR (snapshot.skip):
// the motion is non-deterministic, so it must not become a baseline.
export const Animated: Story = {
  parameters: { snapshot: { skip: true } },
  args: { animate: true, animationDuration: 800 },
};

// Value labels on each axis point. Reduced to one series so the labels
// don't collide.
export const Labels: Story = {
  args: {
    dataKeys: ['alice'],
    showLabels: true,
    labelFormatter: formatCompactNumber,
  },
};

// The same labels drawn over the area instead of on the surface above it. Covers
// the translucent-fill label token: a radar's fill is a flat `fillOpacity`, so an
// `inside*` label has to read against the *tinted surface*, not against the
// series color — the white on-fill token would vanish here in light mode.
export const LabelsInside: Story = {
  args: {
    dataKeys: ['alice'],
    showLabels: true,
    labelPosition: 'insideEnd',
    labelFormatter: formatCompactNumber,
  },
};

// The value scale, pinned to the subject maximum (150) rather than the largest
// value in the data — so the areas read as absolute scores. The scale is angled
// between two spokes: along one, its outermost tick lands on that category's own
// label.
export const RadiusAxis: Story = {
  args: {
    dataKeys: ['alice', 'bob'],
    showRadiusAxis: true,
    radiusAxisAngle: 60,
    radiusAxisDomain: 'fixed',
    radiusAxisDomainMax: 150,
    radiusAxisTickCount: 4,
  },
};

// The same scale inverted — 0 at the outer ring, the maximum at the centre — for
// a metric where less is better.
export const RadiusAxisReversed: Story = {
  args: {
    dataKeys: ['alice'],
    showRadiusAxis: true,
    radiusAxisAngle: 60,
    radiusAxisDomain: 'fixed',
    radiusAxisDomainMax: 150,
    radiusAxisReversed: true,
  },
};

// Spoke labels moved inside the web, with a circular outline matching the
// circular grid and no tick lines.
export const AngleAxisInside: Story = {
  args: {
    gridType: 'circle',
    angleAxisOrientation: 'inner',
    angleAxisLineType: 'circle',
    angleTickLine: false,
  },
};

// The web without its spokes — only the concentric rings.
export const NoRadialLines: Story = {
  args: { radialLines: false },
};

// Custom geometry: a hole at the centre (which separates the series where they
// all bottom out), a smaller web, and the sweep rotated off 12 o'clock.
export const Geometry: Story = {
  args: {
    innerRadius: 40,
    outerRadius: '70%',
    startAngle: 45,
    endAngle: -315,
    margin: { top: 16, right: 16, bottom: 16, left: 16 },
  },
};

// Per-series overrides: one series as a heavy outline over a barely-tinted fill
// with dots, the other recolored away from its `config` entry (which carries the
// new color into its legend swatch too). `alice` keeps its `config` color, so its
// swatch is unchanged — only a `color`/`stroke` override moves the marker.
export const SeriesStyling: Story = {
  args: {
    dataKeys: ['alice', 'bob'],
    seriesSettings: {
      alice: { fillOpacity: 0.05, strokeWidth: 3, dot: true, dotRadius: 4 },
      bob: {
        color: 'var(--ui-background-status-strong-warning)',
        fillOpacity: 0.4,
        strokeWidth: 1,
      },
    },
  },
};
