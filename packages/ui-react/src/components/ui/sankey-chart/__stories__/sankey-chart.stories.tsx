import type { Meta, StoryObj } from '@storybook/react-vite';

import { SankeyChart } from '../sankey-chart';
import { type ChartConfig } from '../../chart';

// Default: a small, simple flow (sign-ups → active / churned) so the base stories
// stay legible and don't all look like the same big graph. Node `name`s are
// CSS-safe color keys; labels + colors come from `config`. Colors reference
// shared semantic status tokens (no chart token tier yet — design-pending v1;
// chromatic in every brand).
const data = {
  nodes: [{ name: 'signups' }, { name: 'active' }, { name: 'churned' }],
  links: [
    { source: 0, target: 1, value: 68 },
    { source: 0, target: 2, value: 32 },
  ],
};

const config = {
  signups: {
    label: 'Sign-ups',
    color: 'var(--ui-background-status-strong-info)',
  },
  active: {
    label: 'Active',
    color: 'var(--ui-background-status-strong-success)',
  },
  churned: {
    label: 'Churned',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

const meta = {
  title: 'Widgets/SankeyChart',
  component: SankeyChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // The ChartContainer is transparent by design (it inherits the surface it sits
  // on — usually a Card). Render the stories on a themed surface so the chart is
  // legible in both light and dark.
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
    nodePadding: 24,
    nodeWidth: 12,
    linkCurvature: 0.5,
    showLabels: true,
    showLegend: false,
    showTooltip: true,
    className: 'h-[280px] w-[520px]',
  },
  argTypes: {
    nodePadding: { control: { type: 'number', min: 0, max: 48 } },
    nodeWidth: { control: { type: 'number', min: 4, max: 24 } },
    linkCurvature: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    sort: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
  },
} satisfies Meta<typeof SankeyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// NOTE: there is no forced-open-tooltip VR story here, unlike the other charts.
// recharts DOES accept a statically-open tooltip on `Sankey` — its payload
// searcher takes a string `defaultIndex` like "link-0" — but only on a raw
// `<ChartTooltip active defaultIndex>` inside a hand-composed `<Sankey>`, the way
// `BarChart`'s `TooltipOpen` story does it. Here that would mean duplicating this
// component's custom `node`/`link` renderers in the story, where they would drift
// from the real ones and make the baseline lie. The tooltip renderer is a plain
// function instead, unit-tested branch by branch in
// `__tests__/sankey-chart.test.tsx` ("SankeyChart default tooltip").

// The simple default flow with on-chart labels + tooltip.
export const Default: Story = {};

// On-chart labels off — the bare flow.
export const NoLabels: Story = {
  args: { showLabels: false },
};

// A legend (color dot + label per node) below the chart, in place of on-chart
// labels.
export const WithLegend: Story = {
  args: { showLabels: false, showLegend: true },
};

// A deeper, differently-shaped flow (visits → sign-up → trial → paid, with bounce
// and a shared churn sink) — exercises multi-level depth and a node fed from two
// columns. Reused by the geometry/sort stories below.
const trafficData = {
  nodes: [
    { name: 'visits' },
    { name: 'signup' },
    { name: 'bounce' },
    { name: 'trial' },
    { name: 'churn' },
    { name: 'paid' },
  ],
  links: [
    { source: 0, target: 1, value: 320 },
    { source: 0, target: 2, value: 680 },
    { source: 1, target: 3, value: 240 },
    { source: 1, target: 4, value: 80 },
    { source: 3, target: 5, value: 150 },
    { source: 3, target: 4, value: 90 },
  ],
};

const trafficConfig = {
  visits: {
    label: 'Visits',
    color: 'var(--ui-background-status-strong-neutral)',
  },
  signup: {
    label: 'Sign-ups',
    color: 'var(--ui-background-status-strong-info)',
  },
  bounce: {
    label: 'Bounced',
    color: 'var(--ui-background-status-strong-danger)',
  },
  trial: {
    label: 'Trials',
    color: 'var(--ui-background-status-strong-warning)',
  },
  churn: {
    label: 'Churned',
    color: 'var(--ui-background-status-strong-critical)',
  },
  paid: { label: 'Paid', color: 'var(--ui-background-status-strong-success)' },
} satisfies ChartConfig;

export const MultiLevelFlow: Story = {
  args: {
    config: trafficConfig,
    data: trafficData,
    className: 'h-[360px] w-[620px]',
  },
};

// Straight ribbons (linkCurvature 0) instead of the default bezier.
export const StraightLinks: Story = {
  args: {
    config: trafficConfig,
    data: trafficData,
    linkCurvature: 0,
    className: 'h-[360px] w-[620px]',
  },
};

// Geometry: thin bars, tight vertical spacing.
export const CompactNodes: Story = {
  args: {
    config: trafficConfig,
    data: trafficData,
    nodeWidth: 6,
    nodePadding: 12,
    className: 'h-[360px] w-[620px]',
  },
};

// `sort` on: recharts reorders nodes vertically to minimize link crossings —
// visibly different from the given order on the deeper flow.
export const AutoSorted: Story = {
  args: {
    config: trafficConfig,
    data: trafficData,
    sort: true,
    className: 'h-[360px] w-[620px]',
  },
};

// Per-link `color` override — both ribbons forced to one accent instead of the
// default target-node tint (still at 35% opacity).
export const CustomLinkColors: Story = {
  args: {
    data: {
      nodes: data.nodes,
      // Light per-link colors (full opacity) so the on-chart node labels stay
      // readable over the ribbons.
      links: [
        {
          source: 0,
          target: 1,
          value: 68,
          color: 'var(--ui-background-status-success)',
        },
        {
          source: 0,
          target: 2,
          value: 32,
          color: 'var(--ui-background-status-danger)',
        },
      ],
    },
  },
};

// Custom tooltip via `tooltipContent` — a colored render (dot + custom text).
// A ChartTooltipContent `formatter` would drop the color indicator, so a custom
// element keeps the dot while changing the copy.
export const CustomTooltip: Story = {
  args: {
    tooltipContent: ({ active, payload }) => {
      if (!active || !payload?.length) return null;
      const targetKey = String(payload[0]?.name ?? '').split(' - ').pop() ?? '';
      return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-md">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: (config as ChartConfig)[targetKey]?.color }}
          />
          <span className="font-medium">
            {Number(payload[0]?.value).toLocaleString()} users
          </span>
        </div>
      );
    },
  },
};

// The "Certification compliance" dashboard card — its own six-node dataset, with
// on-chart labels off and the built-in `showLegend` legend, which carries each
// node's count and its share of the largest node (240 here). Shown as the
// reference usage: the card is just `showLabels={false}` + `showLegend`.
const certData = {
  nodes: [
    { name: 'all' },
    { name: 'certified' },
    { name: 'noCert' },
    { name: 'valid' },
    { name: 'expiring' },
    { name: 'expired' },
  ],
  links: [
    // The total → certified flow reuses the muted "All tenants" color rather
    // than tinting to the (strong blue) target, matching the dashboard card.
    {
      source: 0,
      target: 1,
      value: 209,
      color: 'var(--ui-background-brand-primary-disabled)',
    },
    { source: 0, target: 2, value: 31 },
    { source: 1, target: 3, value: 174 },
    { source: 1, target: 4, value: 21 },
    { source: 1, target: 5, value: 14 },
  ],
};

const certConfig = {
  all: {
    label: 'All tenants',
    color: 'var(--ui-background-brand-primary-disabled)',
  },
  certified: {
    label: 'Certified',
    color: 'var(--ui-background-status-strong-info)',
  },
  noCert: {
    label: 'No certification',
    color: 'var(--ui-background-status-strong-neutral)',
  },
  valid: {
    label: 'Valid certifications',
    color: 'var(--ui-background-status-strong-success)',
  },
  expiring: {
    label: 'Expiring ≤ 90 days',
    color: 'var(--ui-background-status-strong-warning)',
  },
  expired: {
    label: 'Expired',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

export const CertificationCompliance: Story = {
  args: {
    config: certConfig,
    data: certData,
    showLabels: false,
    showLegend: true,
    className: 'h-[340px] w-[620px]',
  },
};
