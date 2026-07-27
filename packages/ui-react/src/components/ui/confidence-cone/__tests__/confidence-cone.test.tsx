import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ConfidenceCone,
  createConeTooltip,
  dropConeBand,
} from '../confidence-cone';
import { ChartTooltipContent, type ChartConfig } from '../../chart';

const data = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 120 },
  { month: 'Mar', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'Apr', forecast: 162, lower: 150, upper: 176 },
  { month: 'May', forecast: 175, lower: 154, upper: 200 },
];

const config = {
  actual: { label: 'Actual', color: 'rgb(23 99 207)' },
  forecast: { label: 'Forecast', color: 'rgb(240 160 30)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof ConfidenceCone>> = {}
) {
  return render(
    <ConfidenceCone
      config={config}
      data={data}
      xKey="month"
      actualKey="actual"
      forecastKey="forecast"
      lowerKey="lower"
      upperKey="upper"
      {...props}
    />
  );
}

describe('ConfidenceCone', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires the actual + forecast colors from config into --color-* custom properties', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-actual: rgb(23 99 207)');
    expect(style).toContain('--color-forecast: rgb(240 160 30)');
  });

  it('renders with chrome toggled off', () => {
    const { container } = renderChart({
      showGrid: false,
      showTooltip: false,
      showLegend: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // Axis titles/unit forward to recharts' XAxis/YAxis `label`/`unit`; happy-dom
  // doesn't paint the SVG, so this only guards the prop path (the rendered titles
  // are covered by the `AxisLabels` VR story).
  it('renders with axis titles + a Y unit', () => {
    const { container } = renderChart({
      xAxisLabel: 'Month',
      yAxisLabel: 'Revenue',
      yUnit: 'k',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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

  it('renders when bound fields are missing (no cone band)', () => {
    const { container } = renderChart({
      data: [
        { month: 'Jan', actual: 100 },
        { month: 'Feb', actual: 120 },
      ],
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The default tooltip and any caller-supplied `tooltipContent` both route
  // their payload through dropConeBand to hide the synthetic `__cone` range
  // series. recharts won't paint that content in happy-dom, so the filter is
  // guarded here directly — an inverted predicate would otherwise leak an
  // unlabeled `__cone` row into a consumer's custom tooltip.
  describe('dropConeBand', () => {
    const real = [{ dataKey: 'actual' }, { dataKey: 'forecast' }];

    it('drops the synthetic cone band while keeping real series in order', () => {
      const payload = [real[0], { dataKey: '__cone' }, real[1]];
      expect(dropConeBand(payload)).toEqual(real);
    });

    it('keeps every series when none is the cone band', () => {
      expect(dropConeBand(real)).toEqual(real);
    });

    it('returns undefined for an undefined payload', () => {
      expect(dropConeBand(undefined)).toBeUndefined();
    });
  });

  // The prop path in the component is a wrapper (createConeTooltip) that strips
  // the band, then mounts the caller's tooltip exactly as recharts would — a
  // function via createElement, an element via cloneElement. Exercised directly
  // here because recharts doesn't paint the tooltip in happy-dom; an inverted
  // filter would leak a `__cone` row into the caller's tooltip and fail this.
  describe('createConeTooltip', () => {
    const payload = [
      { dataKey: 'actual', name: 'Actual', value: 150 },
      { dataKey: '__cone', name: 'cone', value: [150, 176] },
      { dataKey: 'forecast', name: 'Forecast', value: 162 },
    ];

    function Probe({
      payload: p,
    }: {
      payload?: ReadonlyArray<{ dataKey?: unknown }>;
    }) {
      return (
        <div data-testid="keys">
          {(p ?? []).map((item) => String(item.dataKey)).join(',')}
        </div>
      );
    }

    function renderWrapped(content: Parameters<typeof createConeTooltip>[0]) {
      const Wrapped = createConeTooltip(content) as unknown as React.FC<{
        payload: typeof payload;
        active: boolean;
      }>;
      render(<Wrapped payload={payload} active />);
      return screen.getByTestId('keys').textContent;
    }

    it('strips the cone band before a function-form tooltip renders', () => {
      expect(renderWrapped((p) => <Probe payload={p.payload} />)).toBe(
        'actual,forecast'
      );
    });

    it('strips the cone band before an element-form tooltip renders', () => {
      expect(renderWrapped(<Probe />)).toBe('actual,forecast');
    });
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[500px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[500px]');
  });
});
