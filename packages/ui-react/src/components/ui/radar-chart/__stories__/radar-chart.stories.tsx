import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from 'recharts';

import { RadarChart } from '../radar-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  alice: { label: 'Alice', color: 'var(--ui-background-brand-secondary)' },
  bob: { label: 'Bob', color: 'var(--ui-background-status-strong-danger)' },
  carol: { label: 'Carol', color: 'var(--ui-background-status-strong-success)' },
} satisfies ChartConfig;

const meta = {
  title: 'UI/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark; without it, dark mode flips the token-driven
  // web/labels but leaves the backdrop unthemed.
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
    dataKeys: ['alice', 'bob', 'carol'],
    angleKey: 'subject',
    fillOpacity: 0.3,
    strokeWidth: 2,
    showDots: false,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    className: 'h-[380px] w-[420px]',
  },
  argTypes: {
    gridType: { control: 'inline-radio', options: ['polygon', 'circle'] },
    fillOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    strokeWidth: { control: { type: 'number', min: 0, max: 6 } },
    showDots: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default polygon (straight-edged) web.
export const Polygon: Story = {
  args: { gridType: 'polygon' },
};

// A circular web instead of straight polygon rings.
export const Circle: Story = {
  args: { gridType: 'circle' },
};

// Grid + tooltip + legend toggled off — the baseline that would catch a toggle
// silently becoming a no-op (the unit env can't paint recharts chrome).
export const NoChrome: Story = {
  args: { showGrid: false, showTooltip: false, showLegend: false },
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
