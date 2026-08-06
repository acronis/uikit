import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AreaChart } from '../../area-chart';
import { BarChart } from '../../bar-chart';
import { LineChart } from '../../line-chart';
import {
  CHART_REFERENCE_LINE_STROKE,
  resolveReferenceLineProps,
  toReferenceLineList,
  type ChartConfig,
  type ChartReferenceLine,
} from '../index';
import { giveTheChartASize, restoreTheChartSize } from './sized-chart';

// Reference lines are a shared cartesian-chart annotation (`ChartReferenceLine` +
// `resolveChartReferenceValue` / `resolveReferenceLineProps`), so the three charts
// that draw one are exercised together here rather than each asserting the same
// thing in its own file.

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop', color: 'rgb(23 99 207)' },
  mobile: { label: 'Mobile', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

type ReferenceProps = {
  referenceLine?: ChartReferenceLine | ChartReferenceLine[];
};

const CHARTS = [
  {
    name: 'BarChart',
    render: (props: ReferenceProps) => (
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
    render: (props: ReferenceProps) => (
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
    render: (props: ReferenceProps) => (
      <AreaChart
        config={config}
        data={data}
        dataKeys={['desktop', 'mobile']}
        xKey="month"
        {...props}
      />
    ),
  },
] as const;

afterEach(restoreTheChartSize);

describe.each(CHARTS)('$name reference line', ({ render: renderChart }) => {
  it('draws none when the prop is unset', () => {
    giveTheChartASize();
    const { container } = render(renderChart({}));
    expect(container.querySelectorAll('.recharts-reference-line')).toHaveLength(
      0
    );
  });

  it('draws a dashed, token-stroked rule at a fixed value with its caption', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ referenceLine: { value: 250, label: 'Target' } })
    );

    const rule = container.querySelector('.recharts-reference-line-line');
    // recharts' own default stroke is the literal '#ccc', which ignores the theme.
    expect(rule).toHaveAttribute('stroke', CHART_REFERENCE_LINE_STROKE);
    expect(rule).toHaveAttribute('stroke-dasharray', '4 4');
    expect(container.textContent).toContain('Target');
  });

  it('draws one rule per entry when given an array', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ referenceLine: [{ value: 100 }, { average: true }] })
    );
    expect(
      container.querySelectorAll('.recharts-reference-line-line')
    ).toHaveLength(2);
  });

  it('skips an entry with nothing to draw instead of falling back to 0', () => {
    giveTheChartASize();
    const { container } = render(
      renderChart({ referenceLine: [{ value: 100 }, { average: 'missing' }] })
    );
    expect(
      container.querySelectorAll('.recharts-reference-line-line')
    ).toHaveLength(1);
  });
});

describe('toReferenceLineList', () => {
  it('normalizes both accepted prop forms', () => {
    expect(toReferenceLineList(undefined)).toEqual([]);
    expect(toReferenceLineList({ value: 1 })).toEqual([{ value: 1 }]);
    expect(toReferenceLineList([{ value: 1 }, { value: 2 }])).toEqual([
      { value: 1 },
      { value: 2 },
    ]);
  });
});

describe('resolveReferenceLineProps', () => {
  // `discard` is recharts' default, and it would drop exactly the case a
  // reference line exists for — a target above the data maximum.
  it('extends the domain so an out-of-range target stays visible', () => {
    expect(resolveReferenceLineProps(undefined).ifOverflow).toBe(
      'extendDomain'
    );
  });

  it('renders no caption when no label is given', () => {
    expect(resolveReferenceLineProps(undefined).label).toBeUndefined();
  });

  it('captions the line in the same muted token as the rule', () => {
    expect(resolveReferenceLineProps('Target')).toMatchObject({
      label: {
        value: 'Target',
        position: 'insideTopRight',
        fill: CHART_REFERENCE_LINE_STROKE,
      },
    });
  });

  it('takes a caller-chosen caption position', () => {
    expect(resolveReferenceLineProps('Target', 'top').label).toMatchObject({
      position: 'top',
    });
  });
});
