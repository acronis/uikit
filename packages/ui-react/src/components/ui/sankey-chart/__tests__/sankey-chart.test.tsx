import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SankeyChart } from '../sankey-chart';
import { type ChartConfig } from '../../chart';

const data = {
  nodes: [
    { name: 'all' },
    { name: 'certified' },
    { name: 'noCert' },
    { name: 'valid' },
    { name: 'expired' },
  ],
  links: [
    { source: 0, target: 1, value: 209 },
    { source: 0, target: 2, value: 31 },
    { source: 1, target: 3, value: 195 },
    { source: 1, target: 4, value: 14 },
  ],
};

const config = {
  all: { label: 'All tenants', color: 'rgb(23 99 207)' },
  certified: { label: 'Certified', color: 'rgb(40 167 69)' },
  noCert: { label: 'No certification', color: 'rgb(108 117 125)' },
  valid: { label: 'Valid', color: 'rgb(52 199 89)' },
  expired: { label: 'Expired', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof SankeyChart>> = {}
) {
  return render(<SankeyChart config={config} data={data} {...props} />);
}

describe('SankeyChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each node color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-all: rgb(23 99 207)');
    expect(style).toContain('--color-expired: rgb(220 53 69)');
  });

  // happy-dom can't lay out recharts, so the node/link SVG isn't measurable here
  // (the visuals are covered by the VR stories) — assert the toggles render
  // cleanly instead.
  it('renders with labels and tooltip toggled off', () => {
    const { container } = renderChart({ showLabels: false, showTooltip: false });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The legend is plain DOM (not recharts SVG), so happy-dom renders it — assert
  // a node's config label shows when showLegend is on, and not when it's off.
  it('renders a node legend with value + % from config when showLegend is on', () => {
    const off = renderChart();
    expect(off.container.textContent).not.toContain('All tenants');
    const on = renderChart({ showLegend: true });
    expect(on.container.textContent).toContain('All tenants');
    expect(on.container.textContent).toContain('Expired');
    // "all" is the largest node (outgoing 209 + 31 = 240) → its value + 100% share.
    expect(on.container.textContent).toContain('240');
    expect(on.container.textContent).toContain('100%');
  });

  it('accepts a per-link color override without throwing', () => {
    const { container } = renderChart({
      data: {
        nodes: [{ name: 'all' }, { name: 'certified' }],
        links: [
          {
            source: 0,
            target: 1,
            value: 209,
            color: 'var(--ui-background-brand-primary-disabled)',
          },
        ],
      },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with sort enabled', () => {
    const { container } = renderChart({ sort: true });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders a single-link graph without throwing', () => {
    const { container } = renderChart({
      data: {
        nodes: [{ name: 'all' }, { name: 'certified' }],
        links: [{ source: 0, target: 1, value: 209 }],
      },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SankeyChart ref={ref} config={config} data={data} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[500px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[500px]');
  });
});
