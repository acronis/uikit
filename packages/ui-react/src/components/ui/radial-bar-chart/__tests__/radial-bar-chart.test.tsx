import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RadialBarChart } from '../radial-bar-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'rgb(23 99 207)' },
  Safari: { label: 'Safari', color: 'rgb(220 53 69)' },
  Firefox: { label: 'Firefox', color: 'rgb(34 139 79)' },
  Edge: { label: 'Edge', color: 'rgb(212 149 42)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof RadialBarChart>> = {}
) {
  return render(
    <RadialBarChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      {...props}
    />
  );
}

describe('RadialBarChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each arc color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Chrome: rgb(23 99 207)');
    expect(style).toContain('--color-Edge: rgb(212 149 42)');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the arcs/track/chrome can't
  // be asserted here. This exercises the geometry + chrome-toggle prop paths
  // against a plumbing/crash regression; the visual output is covered by the VR
  // stories.
  it('renders a half-circle gauge with the background and chrome toggled off', () => {
    const { container } = renderChart({
      startAngle: 180,
      endAngle: 0,
      showBackground: false,
      showTooltip: false,
      showLegend: false,
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
    const { container } = renderChart({ className: 'h-[360px] w-[360px]' });
    expect(container.firstElementChild).toHaveClass('h-[360px]', 'w-[360px]');
  });

  // The `tooltipContent` prop forwards a custom (library-owned) ChartTooltipContent
  // to recharts' Tooltip; happy-dom doesn't paint the tooltip, so this only guards
  // the prop path — consumers customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent formatter={(value) => <span>{String(value)}</span>} />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

});

// recharts needs a laid-out container, which happy-dom does not provide, so the
// rendered labels/animation are covered by the visual-regression stories. These
// assert the prop contract itself: the composition accepts every new prop and
// mounts, and the animation resolves to the reduced-motion-aware value rather
// than a literal `true`.
describe('RadialBarChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 800 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 800 });
  });

  it('accepts the full animation prop set without throwing', () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts the data-label props without throwing', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormatter: (value) => `${value} u`,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts an explicit labelPosition override', () => {
    const { container } = renderChart({
      showLabels: true,
      labelPosition: 'insideEnd',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
