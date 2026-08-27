// Figma Code Connect — status: COMPLETE
// The connected node is `ChartFunnel` (8811:175245). Its one Figma property is
// `size` (sm/md/lg), which sets the width of the *widget card* wrapping the
// plot — 288/592/896 — not anything about the chart. FunnelChart is card-less
// and parent-responsive by design, so `size` is deliberately neither mapped nor
// mirrored as a prop: the card belongs to `ChartWidget`, and the width belongs
// to the dashboard grid.
//
// The mockup's header, ⋯ menu and metric row are likewise part of the widget
// composition. See the `WidgetExample` story for the whole assembly.
import figma from '@figma/code-connect';

import { FunnelChart } from './funnel-chart';

figma.connect(
  FunnelChart,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8811-175245',
  {
    example: () => (
      <FunnelChart
        dataKey="value"
        nameKey="stage"
        config={{
          Visits: { label: 'Visits' },
          Signups: { label: 'Signups' },
          Trials: { label: 'Trials' },
          Purchases: { label: 'Purchases' },
        }}
        data={[
          { stage: 'Visits', value: 5000 },
          { stage: 'Signups', value: 2600 },
          { stage: 'Trials', value: 1400 },
          { stage: 'Purchases', value: 620 },
        ]}
        className="size-full"
      />
    ),
  }
);
