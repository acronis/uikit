import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Treemap } from '../treemap';
import type { ChartConfig } from '../../chart';

const data = [
  { name: 'React', size: 2400 },
  { name: 'Vue', size: 1200 },
  { name: 'Svelte', size: 800 },
  { name: 'Angular', size: 1600 },
];

const config = {
  React: { label: 'React', color: 'rgb(23 99 207)' },
  Vue: { label: 'Vue', color: 'rgb(34 139 79)' },
  Svelte: { label: 'Svelte', color: 'rgb(212 149 42)' },
  Angular: { label: 'Angular', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(props: Partial<React.ComponentProps<typeof Treemap>> = {}) {
  return render(
    <Treemap config={config} data={data} dataKey="size" nameKey="name" {...props} />
  );
}

describe('Treemap', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each leaf color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-React: rgb(23 99 207)');
    expect(style).toContain('--color-Angular: rgb(220 53 69)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the cells/labels/tooltip
  // can't be asserted here. This exercises the aspectRatio + labels/tooltip
  // toggle prop paths against a plumbing/crash regression; the visual output is
  // covered by the VR stories.
  it('renders with a custom aspectRatio and labels/tooltip toggled off', () => {
    const { container } = renderChart({
      aspectRatio: 1,
      showLabels: false,
      showTooltip: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[480px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[480px]');
  });
});
