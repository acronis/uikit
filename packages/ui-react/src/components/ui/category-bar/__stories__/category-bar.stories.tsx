import type { Meta, StoryObj } from '@storybook/react-vite';

import { CategoryBar } from '../category-bar';
import { type ChartConfig } from '../../chart';

// Default: a simple three-part status split (passed / warnings / failed) that
// sums to 100, so the base stories read cleanly. Segment `key`s are CSS-safe;
// labels + colors come from `config`, referencing chromatic status tokens (no
// chart token tier yet — design-pending v1).
const data = [
  { key: 'passed', value: 68 },
  { key: 'warnings', value: 22 },
  { key: 'failed', value: 10 },
];

const config = {
  passed: {
    label: 'Passed',
    color: 'var(--ui-background-status-strong-success)',
  },
  warnings: {
    label: 'Warnings',
    color: 'var(--ui-background-status-strong-warning)',
  },
  failed: {
    label: 'Failed',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'UI/CategoryBar',
  component: CategoryBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The bar is full-width; give it a fixed width on a themed surface so both the
  // light and dark baselines are legible.
  decorators: [
    (Story) => (
      <div className="w-[640px] rounded-lg border border-border bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    data,
    config,
    size: 'md',
    showLegend: false,
    showTooltip: true,
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    showLegend: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    defaultOpenIndex: { control: { type: 'number' } },
  },
} satisfies Meta<typeof CategoryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// The bare bar: proportional segments, hover for the per-segment tooltip.
export const Default: Story = {};

// The onboarding-stages breakdown — the reference card. Five stages with the
// built-in legend (color dot + label + value + %), like the Sankey legend.
// The exact mockup hues (a light blue, a purple) aren't in the semantic palette
// yet, so `Trained` borrows the periwinkle brand-disabled tint and `Certified`
// borrows a distinct chromatic token; a `--ui-chart-*` palette is pending.
const onboardingData = [
  { key: 'registered', value: 42 },
  { key: 'trained', value: 32 },
  { key: 'firstDeal', value: 37 },
  { key: 'certified', value: 41 },
  { key: 'fullyActive', value: 88 },
];

const onboardingConfig = {
  registered: {
    label: 'Registered',
    color: 'var(--ui-background-status-strong-neutral)',
  },
  trained: {
    label: 'Trained',
    color: 'var(--ui-background-brand-primary-disabled)',
  },
  firstDeal: {
    label: 'First deal',
    color: 'var(--ui-background-status-strong-info)',
  },
  certified: {
    label: 'Certified',
    color: 'var(--ui-background-status-strong-critical)',
  },
  fullyActive: {
    label: 'Fully active',
    color: 'var(--ui-background-status-strong-success)',
  },
} satisfies ChartConfig;

export const OnboardingStages: Story = {
  args: {
    data: onboardingData,
    config: onboardingConfig,
    showLegend: true,
  },
};

// The three track heights side by side.
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-full flex-col gap-6">
      <CategoryBar {...args} size="sm" />
      <CategoryBar {...args} size="md" />
      <CategoryBar {...args} size="lg" />
    </div>
  ),
};

// The tooltip is hover-only, so a normal story never snapshots it.
// `defaultOpenIndex` opens one segment's tooltip so the card is covered by VR.
export const TooltipOpen: Story = {
  args: { defaultOpenIndex: 0 },
};

// Custom tooltip content via `tooltipContent` (a per-segment render), forced open
// with `defaultOpenIndex` so the custom card is covered by VR. Unlike a recharts
// chart, the Base UI tooltip genuinely holds open for the snapshot.
export const CustomTooltipOpen: Story = {
  args: {
    defaultOpenIndex: 0,
    tooltipContent: (seg) => (
      <div>
        <div className="flex items-center gap-1.5 font-semibold">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: seg.color }}
          />
          {seg.label}
        </div>
        <div className="text-muted-foreground">
          {seg.value} checks — {seg.percent}% of total
        </div>
      </div>
    ),
  },
};

// Chrome off — no legend, no tooltip triggers — so a toggle silently becoming a
// no-op changes this baseline (the bar alone).
export const NoChrome: Story = {
  args: { showLegend: false, showTooltip: false },
};
