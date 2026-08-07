import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AreaChart } from '../../area-chart';
import { BarChart } from '../../bar-chart';
import { ComposedChart } from '../../composed-chart';
import { LineChart } from '../../line-chart';
import {
  CHART_BRUSH_ARIA_LABEL,
  CHART_BRUSH_HEIGHT,
  type ChartConfig,
} from '../index';
import { giveTheChartASize } from './chart-layout';

// The range brush is a shared cartesian-chart feature (`ChartBrushProps` +
// `resolveBrushProps`), so the four charts that carry one are exercised together
// here rather than each asserting the same thing in its own file.

const data = Array.from({ length: 12 }, (_, index) => ({
  month: `W${index + 1}`,
  desktop: 150 + index * 7,
  mobile: 90 + index * 5,
}));

const config = {
  desktop: { label: 'Desktop', color: 'rgb(23 99 207)' },
  mobile: { label: 'Mobile', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

type BrushProps = {
  showBrush?: boolean;
  brushHeight?: number;
  brushAriaLabel?: string;
  showXAxis?: boolean;
};

const CHARTS = [
  {
    name: 'BarChart',
    render: (props: BrushProps) => (
      <BarChart
        config={config}
        data={data}
        dataKeys={['desktop', 'mobile']}
        xKey="month"
        {...props}
      />
    ),
  },
  {
    name: 'LineChart',
    render: (props: BrushProps) => (
      <LineChart
        config={config}
        data={data}
        dataKeys={['desktop', 'mobile']}
        xKey="month"
        {...props}
      />
    ),
  },
  {
    name: 'AreaChart',
    render: (props: BrushProps) => (
      <AreaChart
        config={config}
        data={data}
        dataKeys={['desktop', 'mobile']}
        xKey="month"
        {...props}
      />
    ),
  },
  {
    name: 'ComposedChart',
    render: (props: BrushProps) => (
      <ComposedChart
        config={config}
        data={data}
        series={[
          { key: 'desktop', type: 'bar' },
          { key: 'mobile', type: 'line' },
        ]}
        xKey="month"
        {...props}
      />
    ),
  },
] as const;

describe.each(CHARTS)('$name range brush', ({ render: renderChart }) => {
  it('renders no brush when showBrush is unset', () => {
    giveTheChartASize();
    const { container } = render(renderChart({}));
    expect(container.querySelector('.recharts-brush')).toBeNull();
  });

  it('renders a strip with two named, focusable handles when showBrush is set', () => {
    giveTheChartASize();
    const { container } = render(renderChart({ showBrush: true }));

    const strip = container.querySelector('.recharts-brush > rect');
    expect(strip).toHaveAttribute('height', String(CHART_BRUSH_HEIGHT));
    // recharts' own default fill/stroke are the literals '#fff' / '#666', which
    // would ignore the theme entirely.
    expect(strip).toHaveAttribute(
      'fill',
      'var(--ui-background-surface-secondary)'
    );
    expect(strip).toHaveAttribute(
      'stroke',
      'var(--ui-text-on-surface-secondary)'
    );

    const handles = container.querySelectorAll('.recharts-brush-traveller');
    expect(handles).toHaveLength(2);
    for (const handle of handles) {
      // Without an explicit ariaLabel recharts names the handles from a `name`
      // field on the data row, which no chart here requires — announcing
      // "Min value: undefined, Max value: undefined".
      expect(handle).toHaveAttribute('aria-label', CHART_BRUSH_ARIA_LABEL);
      expect(handle).toHaveAttribute('role', 'slider');
      expect(handle).toHaveAttribute('tabindex', '0');
    }
  });

  it('sizes the strip from brushHeight', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ showBrush: true, brushHeight: 48 })
    );
    expect(container.querySelector('.recharts-brush > rect')).toHaveAttribute(
      'height',
      '48'
    );
  });

  it('falls back to the default height rather than letting 0 erase the brush', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ showBrush: true, brushHeight: 0 })
    );
    expect(container.querySelector('.recharts-brush > rect')).toHaveAttribute(
      'height',
      String(CHART_BRUSH_HEIGHT)
    );
  });

  it('lets the caller localize the handles accessible name', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ showBrush: true, brushAriaLabel: 'Selector de rango' })
    );
    for (const handle of container.querySelectorAll(
      '.recharts-brush-traveller'
    )) {
      expect(handle).toHaveAttribute('aria-label', 'Selector de rango');
    }
  });

  it('renders the brush with the category axis hidden', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ showBrush: true, showXAxis: false })
    );
    expect(container.querySelector('.recharts-brush')).toBeInTheDocument();
  });
});

describe('BarChart range-brush captions', () => {
  // The brush slices rows by index, so its captions have to come from whichever
  // axis holds the categories — X for vertical bars, Y for horizontal ones.
  // recharts only paints them while a handle is focused/dragged, so focus one.
  function captionsFor(orientation: 'vertical' | 'horizontal') {
    giveTheChartASize();
    const { container } = render(
      <BarChart
        config={config}
        data={data}
        dataKeys={['desktop']}
        xKey="month"
        orientation={orientation}
        showBrush
        xTickFormatter={(value) => `x:${value}`}
        yTickFormatter={(value) => `y:${value}`}
      />
    );
    fireEvent.focusIn(container.querySelector('.recharts-brush-traveller')!);
    return [...container.querySelectorAll('.recharts-brush-texts text')].map(
      (node) => node.textContent
    );
  }

  it('formats vertical-bar captions from the X (category) axis formatter', () => {
    expect(captionsFor('vertical')).toEqual(['x:W1', 'x:W12']);
  });

  it('formats horizontal-bar captions from the Y (category) axis formatter', () => {
    expect(captionsFor('horizontal')).toEqual(['y:W1', 'y:W12']);
  });
});
