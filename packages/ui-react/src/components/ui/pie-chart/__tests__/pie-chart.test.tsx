import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PieChart, pieChartLabelText } from '../pie-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
];

const config = {
  Chrome: { label: 'Chrome', color: 'rgb(23 99 207)' },
  Safari: { label: 'Safari', color: 'rgb(220 53 69)' },
  Firefox: { label: 'Firefox', color: 'rgb(34 139 79)' },
} satisfies ChartConfig;

function renderChart(props: Partial<React.ComponentProps<typeof PieChart>> = {}) {
  return render(
    <PieChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      {...props}
    />
  );
}

describe('PieChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each slice color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Chrome: rgb(23 99 207)');
    expect(style).toContain('--color-Safari: rgb(220 53 69)');
  });

  it('defaults to a pie shape', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'pie');
  });

  it('reflects the donut shape variant on the root', () => {
    const { container } = renderChart({ shape: 'donut' });
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'donut');
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the tooltip/legend toggles
  // can't be asserted on the rendered chrome here. This exercises the toggle +
  // donut/padding prop paths (guarding against a plumbing/crash regression); the
  // visual effect of the chrome toggles is covered by the `NoChrome` VR story.
  it('renders as a donut with chrome toggled off', () => {
    const { container } = renderChart({
      shape: 'donut',
      showTooltip: false,
      showLegend: false,
      paddingAngle: 2,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // recharts resolves the center Label's content against a computed polar
  // viewBox that happy-dom never provides, so the center text can't be asserted
  // here (it's covered by the DonutWithCenterLabel VR story). These guard the
  // prop path: a donut with centerLabel, and a pie that ignores it, both render.
  it('renders a donut with a center label', () => {
    const { container } = renderChart({
      shape: 'donut',
      centerLabel: { value: '835', label: 'Visitors' },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('ignores centerLabel for a pie shape', () => {
    const { container } = renderChart({
      shape: 'pie',
      centerLabel: { value: '835', label: 'Visitors' },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[300px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[300px]');
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
describe('PieChart animation and data labels', () => {
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

// The label text is the one piece of the slice-label work that doesn't need a
// laid-out chart, so it's asserted directly. `total` is the sum of every slice
// value (275 + 200 + 187 = 662 for the fixture above).
describe('pieChartLabelText', () => {
  const base = { name: 'Chrome', value: 275, total: 662 } as const;

  it('renders the raw value by default', () => {
    expect(pieChartLabelText({ ...base, format: 'value' })).toBe('275');
  });

  it('pairs the name with the value', () => {
    expect(pieChartLabelText({ ...base, format: 'name-value' })).toBe(
      'Chrome: 275'
    );
  });

  it('pairs the name with the share of the total', () => {
    expect(pieChartLabelText({ ...base, format: 'name-percent' })).toBe(
      'Chrome: 41.5%'
    );
  });

  it('renders the share alone', () => {
    expect(pieChartLabelText({ ...base, format: 'percent' })).toBe('41.5%');
  });

  it('formats only the numeric part, so labels match the value axis', () => {
    expect(
      pieChartLabelText({
        ...base,
        format: 'name-value',
        formatter: (value) => `${value} users`,
      })
    ).toBe('Chrome: 275 users');
  });

  // A zero total (all-zero or non-numeric data) would divide to NaN; the two
  // percent formats degrade instead of printing it.
  it('drops the percent when there is nothing to divide by', () => {
    expect(
      pieChartLabelText({ name: 'Chrome', value: 0, total: 0, format: 'percent' })
    ).toBe('');
    expect(
      pieChartLabelText({
        name: 'Chrome',
        value: 0,
        total: 0,
        format: 'name-percent',
      })
    ).toBe('Chrome');
  });

  it('passes a non-numeric value through as text', () => {
    expect(
      pieChartLabelText({ name: 'Chrome', value: 'n/a', total: 662, format: 'value' })
    ).toBe('n/a');
  });
});

// Geometry, per-slice overrides and the leader-line label path all need a
// painted SVG, which happy-dom never gives recharts — these guard the prop
// plumbing; the VR stories cover what they draw.
describe('PieChart geometry, slices and chrome', () => {
  it('accepts the sweep and corner geometry', () => {
    const { container } = renderChart({
      startAngle: 180,
      endAngle: 0,
      cornerRadius: 6,
      minAngle: 4,
      paddingAngle: 2,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts per-slice color, label and format overrides', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormat: 'name-percent',
      sliceSettings: {
        Chrome: { color: 'rgb(0 0 0)' },
        Safari: { hideLabel: true },
        Firefox: { labelFormat: 'value' },
      },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts labelled slices with leader lines', () => {
    const { container } = renderChart({
      showLabels: true,
      labelLine: true,
      labelFormat: 'name-value',
      sliceSettings: { Safari: { hideLabel: true } },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts a top legend and a custom margin', () => {
    const { container } = renderChart({
      shape: 'donut',
      centerLabel: { value: '662', label: 'Visitors' },
      legendPos: 'top',
      margin: { top: 16, right: 16, bottom: 16, left: 16 },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts the value-percent tooltip preset', () => {
    const { container } = renderChart({ tooltipFormat: 'value-percent' });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
