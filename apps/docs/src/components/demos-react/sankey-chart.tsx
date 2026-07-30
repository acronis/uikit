'use client';

import { SankeyChart, type ChartConfig } from '@acronis-platform/ui-react';

// A certification-compliance flow: all tenants split into certified / uncertified,
// then certified by validity. Node `name`s are CSS-safe color keys; the display
// text + color come from `config` (no chart token tier yet, so colors reference
// shared semantic status tokens — chromatic in every brand).
const data = {
  nodes: [
    { name: 'all' },
    { name: 'certified' },
    { name: 'noCert' },
    { name: 'valid' },
    { name: 'expiring' },
    { name: 'expired' },
  ],
  links: [
    { source: 0, target: 1, value: 209 },
    { source: 0, target: 2, value: 31 },
    { source: 1, target: 3, value: 174 },
    { source: 1, target: 4, value: 21 },
    { source: 1, target: 5, value: 14 },
  ],
};

const config = {
  all: { label: 'All tenants', color: 'var(--ui-background-status-strong-info)' },
  certified: {
    label: 'Certified',
    color: 'var(--ui-background-status-strong-info)',
  },
  noCert: {
    label: 'No certification',
    color: 'var(--ui-background-status-strong-neutral)',
  },
  valid: {
    label: 'Valid',
    color: 'var(--ui-background-status-strong-success)',
  },
  expiring: {
    label: 'Expiring',
    color: 'var(--ui-background-status-strong-warning)',
  },
  expired: {
    label: 'Expired',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

export function SankeyChartDemo() {
  return (
    <SankeyChart config={config} data={data} style={{ height: 340, width: 620 }} />
  );
}
