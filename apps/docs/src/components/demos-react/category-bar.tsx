'use client';

import { CategoryBar, type ChartConfig } from '@acronis-platform/ui-react';

// The onboarding-stages breakdown: partners split across five funnel stages, with
// the built-in count/% legend. Segment `key`s are CSS-safe color keys; the display
// text + color come from `config`. There's no chart token tier yet, so the light
// blue / purple mockup hues borrow the nearest semantic tokens (brand-dependent).
const data = [
  { key: 'registered', value: 42 },
  { key: 'trained', value: 32 },
  { key: 'firstDeal', value: 37 },
  { key: 'certified', value: 41 },
  { key: 'fullyActive', value: 88 },
];

const config = {
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

export function CategoryBarDemo() {
  return (
    <div style={{ width: 620 }}>
      <CategoryBar config={config} data={data} showLegend />
    </div>
  );
}
