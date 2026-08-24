'use client';

import { CategoryBar, type ChartConfig } from '@acronis-platform/ui-react';

// The onboarding-stages breakdown: partners split across five funnel stages, with
// the built-in count/% legend. Segment `key`s are CSS-safe color keys; the display
// text + color come from `config`; pass `palette={{ type: 'status' }}` to route
// the `tone: { status }` entries through the status palette.
const data = [
  { key: 'registered', value: 42 },
  { key: 'trained', value: 32 },
  { key: 'firstDeal', value: 37 },
  { key: 'certified', value: 41 },
  { key: 'fullyActive', value: 88 },
];

const config = {
  registered: {
    label: 'Registered'
  },
  trained: {
    label: 'Trained'
  },
  firstDeal: {
    label: 'First deal'
  },
  certified: {
    label: 'Certified'
  },
  fullyActive: {
    label: 'Fully active'
  },
} satisfies ChartConfig;

export function CategoryBarDemo() {
  return (
    <div style={{ width: 620 }}>
      <CategoryBar config={config} data={data} showLegend />
    </div>
  );
}
