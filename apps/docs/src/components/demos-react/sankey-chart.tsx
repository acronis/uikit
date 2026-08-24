'use client';

import { SankeyChart, type ChartConfig } from '@acronis-platform/ui-react';

// A certification-compliance flow: all tenants split into certified / uncertified,
// then certified by validity. Node `name`s are CSS-safe color keys; the display
// text + color come from `config`; pass `palette={{ type: 'status' }}` to route
// the `tone: { status }` entries through the status palette.
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
  ]
};

const config = {
  all: { label: 'All tenants' },
  certified: {
    label: 'Certified'
  },
  noCert: {
    label: 'No certification'
  },
  valid: {
    label: 'Valid'
  },
  expiring: {
    label: 'Expiring'
  },
  expired: {
    label: 'Expired'
  },
} satisfies ChartConfig;

export function SankeyChartDemo() {
  return (
    <SankeyChart config={config} data={data} style={{ height: 340, width: 620 }} />
  );
}
