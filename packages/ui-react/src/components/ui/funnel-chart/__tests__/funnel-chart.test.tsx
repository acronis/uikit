import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  FunnelChart,
  funnelChartLabelMargin,
  funnelChartLabelReserve,
  funnelChartLabelText,
  funnelChartOppositeSide,
  funnelChartPercent,
} from '../funnel-chart';
import {
  ChartTooltipContent,
  type ChartConfig,
  createTickFormatter,
  resolveAnimation,
} from '../../chart';

import { giveEveryChartASize } from '../../chart/__tests__/chart-layout';

// The trapezoid segments, labels and legend asserted below are the real SVG/DOM
// output, which recharts skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

const config = {
  Visits: { label: 'Visits' },
  Signups: { label: 'Signups' },
  Trials: { label: 'Trials' },
  Purchases: { label: 'Purchases' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof FunnelChart>> = {}
) {
  return render(
    <FunnelChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="stage"
      {...props}
    />
  );
}

const segments = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.recharts-funnel-trapezoid path'));

const labelTexts = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.recharts-label-list text')).map(
    (node) => node.textContent
  );

/** Top edge of each stage's trapezoid, in data order. */
const stageTops = (container: HTMLElement) =>
  segments(container).map((path) => Number(path.getAttribute('y')));

describe('FunnelChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each stage color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Visits: var(--ui-dataviz-categorical-1)');
    expect(style).toContain('--color-Purchases: var(--ui-dataviz-categorical-4)');
  });

  it('defaults to a triangle last shape', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute(
      'data-last-shape',
      'triangle'
    );
  });

  it('reflects the rectangle last-shape variant on the root', () => {
    const { container } = renderChart({ lastShape: 'rectangle' });
    expect(container.firstElementChild).toHaveAttribute(
      'data-last-shape',
      'rectangle'
    );
  });

  // `reversed` flips which end the funnel opens at, so the stage bands are drawn
  // bottom-up: the same four tops in the opposite order. The two toggles remove
  // the chrome around them without touching the segments themselves.
  it('renders reversed with labels off and the tooltip off', () => {
    const upright = renderChart().container;
    const { container } = renderChart({
      reversed: true,
      showLabels: false,
      showTooltip: false,
    });

    expect(stageTops(container)).toEqual([...stageTops(upright)].reverse());
    // The widest stage moved to the bottom but kept its color, so a stage is
    // still identifiable by the same fill in either direction.
    expect(segments(container)).toHaveLength(4);
    expect(segments(container)[0]).toHaveAttribute(
      'fill',
      'var(--color-Visits)'
    );

    expect(labelTexts(container)).toEqual([]);
    expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull();
  });

  it('renders without crashing on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    // The plot is still painted — an empty funnel is a chart with no stages, not
    // a chart that bailed out before drawing.
    expect(container.querySelector('.recharts-surface')).not.toBeNull();
    expect(segments(container)).toHaveLength(0);
    expect(labelTexts(container)).toEqual([]);
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderChart({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[360px] w-[420px]' });
    expect(container.firstElementChild).toHaveClass('h-[360px]', 'w-[420px]');
  });

  // The tooltip is hover-only, so this guards the prop path — consumers
  // customize the tooltip without importing recharts.
  it('accepts a custom tooltipContent', () => {
    const { container } = renderChart({
      tooltipContent: (
        <ChartTooltipContent
          formatter={(value) => <span>{String(value)}</span>}
        />
      ),
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

// The in-between frames are non-deterministic and excluded from VR, so what is
// asserted here is the contract around them: `animate` resolves to the
// reduced-motion-aware value rather than a literal `true`, and the funnel ends
// up fully painted either way.
describe('FunnelChart animation and data labels', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    // Nothing to grow in, so the stages are already at their final geometry in
    // the render's own tick — no waiting for a first frame.
    const { container } = renderChart();
    expect(segments(container)).toHaveLength(4);
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
  });

  // An animated funnel paints nothing on the first pass — `animationBegin`
  // delays the series past the render — so the segments only exist once the
  // animation has started.
  it('still paints every stage with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    expect(segments(container)).toHaveLength(0);

    await waitFor(() => expect(segments(container)).toHaveLength(4));
    expect(segments(container)[0]).toHaveAttribute(
      'fill',
      'var(--color-Visits)'
    );
  });
});

// The label text needs no laid-out chart, so it is asserted directly. `base` is
// the widest (first) stage — a funnel's stages are nested subsets, so the share
// that means something is the conversion from the top, not a share of the sum.
describe('funnelChartLabelText', () => {
  const base = { name: 'Signups', value: 2600, base: 5000 } as const;

  it('names the stage by default', () => {
    expect(funnelChartLabelText({ ...base, format: 'name' })).toBe('Signups');
  });

  it('renders the raw value', () => {
    expect(funnelChartLabelText({ ...base, format: 'value' })).toBe('2600');
  });

  it('renders the conversion from the widest stage', () => {
    expect(funnelChartLabelText({ ...base, format: 'percent' })).toBe('52.0%');
  });

  it('pairs the name with the value', () => {
    expect(funnelChartLabelText({ ...base, format: 'name-value' })).toBe(
      'Signups: 2600'
    );
  });

  it('pairs the name with the conversion', () => {
    expect(funnelChartLabelText({ ...base, format: 'name-percent' })).toBe(
      'Signups: 52.0%'
    );
  });

  it('pairs the value with the conversion', () => {
    expect(funnelChartLabelText({ ...base, format: 'value-percent' })).toBe(
      '2600 (52.0%)'
    );
  });

  it('formats only the numeric part, so a label matches its tooltip', () => {
    expect(
      funnelChartLabelText({
        ...base,
        format: 'name-value',
        formatter: (value) => `${value} users`,
      })
    ).toBe('Signups: 2600 users');
  });

  // A zero base (all-zero or non-numeric data) would divide to NaN; the percent
  // formats degrade instead of printing it.
  it('drops the conversion when there is nothing to divide by', () => {
    expect(
      funnelChartLabelText({
        name: 'Signups',
        value: 0,
        base: 0,
        format: 'percent',
      })
    ).toBe('');
    expect(
      funnelChartLabelText({
        name: 'Signups',
        value: 0,
        base: 0,
        format: 'name-percent',
      })
    ).toBe('Signups');
  });

  it('passes a non-numeric value through as text', () => {
    expect(
      funnelChartLabelText({
        name: 'Signups',
        value: 'n/a',
        base: 5000,
        format: 'value',
      })
    ).toBe('n/a');
  });

  // The default appends a bare `%`, which not every locale writes that way — so
  // the share has its own formatter, separate from the value's. Intl separates
  // the number from the sign with a non-breaking space, hence the normalising.
  it('routes the share through percentFormatter', () => {
    const percentFormatter = createTickFormatter(
      { style: 'percent', minimumFractionDigits: 1 },
      'de-DE'
    );
    const spaces = (text: string) => text.replace(/\s/g, ' ');
    expect(
      spaces(funnelChartLabelText({ ...base, format: 'percent', percentFormatter }))
    ).toBe('52,0 %');
    expect(
      spaces(
        funnelChartLabelText({
          ...base,
          format: 'name-percent',
          percentFormatter,
        })
      )
    ).toBe('Signups: 52,0 %');
  });

  it('formats the value and the share independently', () => {
    expect(
      funnelChartLabelText({
        ...base,
        format: 'value-percent',
        formatter: (value) => `${Number(value) / 1000}k`,
        percentFormatter: (value) => `${Math.round(Number(value) * 100)}pc`,
      })
    ).toBe('2.6k (52pc)');
  });
});

describe('funnelChartPercent', () => {
  it('reads a fraction as a one-decimal percentage', () => {
    expect(funnelChartPercent(0.52)).toBe('52.0%');
    expect(funnelChartPercent(1)).toBe('100.0%');
  });

  it('passes a non-numeric value through', () => {
    expect(funnelChartPercent('n/a')).toBe('n/a');
  });
});

// The margin is overflow protection, not label room — it reserves the side a
// label list sits on so unwrappable text isn't clipped at the SVG edge.
describe('funnelChartLabelMargin', () => {
  const base = {
    showLabels: true,
    labelPosition: 'right',
    showValueLabels: false,
    valuePosition: 'left',
  } as const;

  it('reserves the name-sized inset for the default right-hand names', () => {
    expect(funnelChartLabelMargin(base)).toEqual({
      top: 8,
      right: 96,
      bottom: 8,
      left: 24,
    });
  });

  it('reserves the left inset when a label list sits there', () => {
    expect(
      funnelChartLabelMargin({ ...base, labelPosition: 'left' })
    ).toMatchObject({ left: 96 });
    expect(
      funnelChartLabelMargin({ ...base, showValueLabels: true })
    ).toMatchObject({ right: 96, left: 96 });
  });

  // Labels off, or centred on the segments, still keep the right inset: it is the
  // geometry every existing funnel was drawn with.
  it('keeps the reserved right inset when nothing sits beside the funnel', () => {
    expect(
      funnelChartLabelMargin({ ...base, showLabels: false })
    ).toMatchObject({
      right: 96,
      left: 24,
    });
    expect(
      funnelChartLabelMargin({ ...base, labelPosition: 'inside' })
    ).toMatchObject({ right: 96, left: 24 });
  });
});

// Label room comes from narrowing the funnel, not from the margin: recharts wraps
// a label against the gap between its trapezoid and the *plot area* edge, and a
// margin moves that edge inward. Only `Funnel`'s own `width` frees real space.
describe('funnelChartLabelReserve', () => {
  const base = {
    showLabels: true,
    labelPosition: 'right',
    labelFormat: 'name',
  } as const;

  it('leaves the funnel at full width for a plain label', () => {
    expect(funnelChartLabelReserve(base)).toBeUndefined();
    expect(
      funnelChartLabelReserve({ ...base, labelFormat: 'value' })
    ).toBeUndefined();
    expect(
      funnelChartLabelReserve({ ...base, labelFormat: 'percent' })
    ).toBeUndefined();
  });

  it('narrows the funnel for a composite label beside it', () => {
    (['name-value', 'name-percent', 'value-percent'] as const).forEach(
      (labelFormat) => {
        expect(funnelChartLabelReserve({ ...base, labelFormat })).toBe('75%');
      }
    );
  });

  // Nothing sits beside the funnel in these cases, so narrowing it would only
  // shrink the chart.
  it('leaves the funnel at full width when no label sits to its right', () => {
    expect(
      funnelChartLabelReserve({
        ...base,
        labelFormat: 'name-percent',
        showLabels: false,
      })
    ).toBeUndefined();
    expect(
      funnelChartLabelReserve({
        ...base,
        labelFormat: 'name-percent',
        labelPosition: 'inside',
      })
    ).toBeUndefined();
  });

  // The widest trapezoid always starts flush at the plot area's left edge, so
  // narrowing the funnel takes room away from a left-hand label instead of
  // giving it any.
  it('does not narrow the funnel for left-hand labels', () => {
    expect(
      funnelChartLabelReserve({
        ...base,
        labelFormat: 'name-percent',
        labelPosition: 'left',
      })
    ).toBeUndefined();
  });
});

// A static `valuePosition` default would stack both lists on the same edge when
// the names are moved there.
describe('funnelChartOppositeSide', () => {
  it('puts the values opposite the names', () => {
    expect(funnelChartOppositeSide('right')).toBe('left');
    expect(funnelChartOppositeSide('left')).toBe('right');
  });

  it('sends the values to the right when the names sit on the segments', () => {
    expect(funnelChartOppositeSide('inside')).toBe('right');
  });
});

describe('FunnelChart stages and colors', () => {
  it('paints one segment per stage from its config color', () => {
    const { container } = renderChart();
    const paths = segments(container);
    expect(paths).toHaveLength(4);
    expect(paths[0]).toHaveAttribute('fill', 'var(--color-Visits)');
    expect(paths[3]).toHaveAttribute('fill', 'var(--color-Purchases)');
  });

  it('overrides a single stage color via stageSettings', () => {
    const { container } = renderChart({
      stageSettings: {
        Trials: { color: 'var(--ui-background-status-strong-info)' },
      },
    });
    const paths = segments(container);
    expect(paths[2]).toHaveAttribute(
      'fill',
      'var(--ui-background-status-strong-info)'
    );
    expect(paths[1]).toHaveAttribute('fill', 'var(--color-Signups)');
  });

  it('drops a hidden stage from the funnel and its labels', () => {
    const { container } = renderChart({
      stageSettings: { Trials: { hidden: true } },
    });
    expect(segments(container)).toHaveLength(3);
    expect(labelTexts(container)).toEqual(['Visits', 'Signups', 'Purchases']);
  });

  // A hidden stage leaves the funnel entirely, so the conversions are measured
  // over what is still on screen — 620/5000, not 620/1400.
  it('measures conversions over the visible stages only', () => {
    const { container } = renderChart({
      stageSettings: { Signups: { hidden: true } },
      labelFormat: 'percent',
    });
    expect(labelTexts(container)).toEqual(['100.0%', '28.0%', '12.4%']);
  });

  // recharts sizes the trapezoids off the largest value, so the conversions are
  // measured against that stage too. Reading the first row instead would print a
  // share above 100% for a funnel whose data isn't sorted descending.
  it('measures conversions against the widest stage, not the first row', () => {
    const { container } = renderChart({
      data: [
        { stage: 'Trials', value: 1400 },
        { stage: 'Visits', value: 5000 },
        { stage: 'Purchases', value: 620 },
      ],
      labelFormat: 'percent',
    });
    expect(labelTexts(container)).toEqual(['28.0%', '100.0%', '12.4%']);
  });

  it('formats the conversion with a caller-supplied percentFormatter', () => {
    const { container } = renderChart({
      labelFormat: 'percent',
      percentFormatter: createTickFormatter(
        { style: 'percent', maximumFractionDigits: 0 },
        'en'
      ),
    });
    expect(labelTexts(container)).toEqual(['100%', '52%', '28%', '12%']);
  });

  it('ramps one hue down the funnel in gradient mode', () => {
    const { container } = renderChart({ colorMode: 'gradient' });
    const paths = segments(container);
    // The widest stage keeps the base hue at full strength; each stage below it
    // is mixed further toward the surface.
    expect(paths[0]).toHaveAttribute(
      'fill',
      'color-mix(in oklab, var(--color-Visits) 100.0%, var(--ui-background-surface-primary))'
    );
    expect(paths[3]).toHaveAttribute(
      'fill',
      'color-mix(in oklab, var(--color-Visits) 45.0%, var(--ui-background-surface-primary))'
    );
  });

  it('ramps a caller-supplied hue when gradientColor is set', () => {
    const { container } = renderChart({
      colorMode: 'gradient',
      gradientColor: 'var(--ui-background-brand-primary)',
    });
    expect(segments(container)[0]).toHaveAttribute(
      'fill',
      'color-mix(in oklab, var(--ui-background-brand-primary) 100.0%, var(--ui-background-surface-primary))'
    );
  });

  it('lets a stageSettings color win over the gradient ramp', () => {
    const { container } = renderChart({
      colorMode: 'gradient',
      stageSettings: {
        Trials: { color: 'var(--ui-background-status-strong-info)' },
      },
    });
    expect(segments(container)[2]).toHaveAttribute(
      'fill',
      'var(--ui-background-status-strong-info)'
    );
  });

  // The first stage paints with its override, so the ramp has to start from that
  // colour — starting from its `config` colour would ramp a hue no segment shows.
  it('ramps from the first stage override rather than its config color', () => {
    const { container } = renderChart({
      colorMode: 'gradient',
      stageSettings: {
        Visits: { color: 'var(--ui-background-status-strong-info)' },
      },
    });
    const paths = segments(container);
    expect(paths[0]).toHaveAttribute(
      'fill',
      'var(--ui-background-status-strong-info)'
    );
    expect(paths[3]).toHaveAttribute(
      'fill',
      'color-mix(in oklab, var(--ui-background-status-strong-info) 45.0%, var(--ui-background-surface-primary))'
    );
  });

  it('outlines the segments when a stroke is given', () => {
    const { container } = renderChart({
      stroke: 'var(--ui-border-on-surface-border)',
      strokeWidth: 2,
    });
    const paths = segments(container);
    expect(paths[0]).toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border)'
    );
    expect(paths[0]).toHaveAttribute('stroke-width', '2');
  });

  // recharts defaults the stroke to a hardcoded `#fff` that ChartContainer
  // neutralizes, so a bare strokeWidth would widen an invisible border.
  it('pairs a bare strokeWidth with the border token', () => {
    const { container } = renderChart({ strokeWidth: 2 });
    const paths = segments(container);
    expect(paths[0]).toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border)'
    );
    expect(paths[0]).toHaveAttribute('stroke-width', '2');
  });

  it('leaves the recharts stroke default alone when neither is given', () => {
    const { container } = renderChart();
    expect(segments(container)[0]).toHaveAttribute('stroke', '#fff');
  });

  it('narrows the funnel to funnelWidth', () => {
    const { container } = renderChart({ funnelWidth: 200 });
    const wide = renderChart().container;
    const width = (node: Element | undefined) =>
      Number(node?.getAttribute('width'));
    expect(width(segments(container)[0])).toBeLessThan(
      width(segments(wide)[0])
    );
  });

  // The reserve is a default, so an explicit funnelWidth has to survive a
  // composite label asking for one of its own.
  it('lets a caller-supplied funnelWidth win over the composite reserve', () => {
    const reserved = renderChart({ labelFormat: 'name-percent' }).container;
    const explicit = renderChart({
      labelFormat: 'name-percent',
      funnelWidth: '100%',
    }).container;
    const width = (node: Element | undefined) =>
      Number(node?.getAttribute('width'));
    expect(width(segments(reserved)[0])).toBeLessThan(
      width(segments(explicit)[0])
    );
  });

  // recharts activates a segment from a `mouseEnter` on its own layer — no
  // pointer geometry involved — so the outline is assertable here. React
  // synthesizes `onMouseEnter` from `mouseover`, hence `mouseOver`.
  it('outlines the hovered segment when showActiveShape is set', () => {
    const { container } = renderChart({ showActiveShape: true });
    const layers = container.querySelectorAll('.recharts-funnel-trapezoid');
    fireEvent.mouseOver(layers[1]);

    const paths = segments(container);
    expect(paths[1]).toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border-active)'
    );
    expect(paths[1]).toHaveAttribute('stroke-width', '2');
    // The fill is untouched, so the segment keeps the color that ties it to its
    // legend entry and label.
    expect(paths[1]).toHaveAttribute('fill', 'var(--color-Signups)');
    expect(paths[0]).not.toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border-active)'
    );
  });

  it('leaves the hovered segment alone unless showActiveShape is set', () => {
    const { container } = renderChart();
    fireEvent.mouseOver(
      container.querySelectorAll('.recharts-funnel-trapezoid')[1]
    );
    expect(segments(container)[1]).not.toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border-active)'
    );
  });
});

describe('FunnelChart labels', () => {
  it('names each stage beside its segment by default', () => {
    const { container } = renderChart();
    expect(labelTexts(container)).toEqual([
      'Visits',
      'Signups',
      'Trials',
      'Purchases',
    ]);
  });

  it('renders the requested labelFormat', () => {
    const { container } = renderChart({ labelFormat: 'name-percent' });
    expect(labelTexts(container)).toEqual([
      'Visits: 100.0%',
      'Signups: 52.0%',
      'Trials: 28.0%',
      'Purchases: 12.4%',
    ]);
  });

  it('formats the numeric part of a label', () => {
    const { container } = renderChart({
      labelFormat: 'value',
      labelFormatter: (value) => `${Number(value) / 1000}k`,
    });
    expect(labelTexts(container)).toEqual(['5k', '2.6k', '1.4k', '0.62k']);
  });

  it('adds a second label carrying the value', () => {
    const { container } = renderChart({ showValueLabels: true });
    expect(labelTexts(container)).toEqual([
      'Visits',
      'Signups',
      'Trials',
      'Purchases',
      '5000',
      '2600',
      '1400',
      '620',
    ]);
  });

  // A funnel narrows, so its last stages are too thin to hold a label: an
  // on-segment value would overflow onto the card in the on-fill colour (white),
  // which disappears in light mode. The values default to the side opposite the
  // names instead, where every stage has room.
  it('puts the value labels opposite the names, not on the segments', () => {
    const { container } = renderChart({ showValueLabels: true });
    const lists = container.querySelectorAll('.recharts-label-list');
    expect(lists).toHaveLength(2);
    const values = Array.from(lists[1].querySelectorAll('text'));
    values.forEach((value) => {
      expect(value.getAttribute('class')).toContain(
        'fill-[var(--ui-text-on-surface-primary)]!'
      );
    });
    // The names sit at the right edge, so the values sit left of the funnel.
    const [name] = Array.from(lists[0].querySelectorAll('text'));
    expect(Number(values[0].getAttribute('x'))).toBeLessThan(
      Number(name.getAttribute('x'))
    );
  });

  // "Opposite the names" has to follow labelPosition. A static `left` default
  // would draw both lists at the same anchor here, overprinting each name with
  // its own value.
  it('follows the names to the other side when they move left', () => {
    const { container } = renderChart({
      labelPosition: 'left',
      showValueLabels: true,
    });
    const lists = container.querySelectorAll('.recharts-label-list');
    const [name] = Array.from(lists[0].querySelectorAll('text'));
    const [value] = Array.from(lists[1].querySelectorAll('text'));
    expect(Number(value.getAttribute('x'))).toBeGreaterThan(
      Number(name.getAttribute('x'))
    );
  });

  it('honors an explicit valuePosition over the opposite-side default', () => {
    const { container } = renderChart({
      labelPosition: 'left',
      showValueLabels: true,
      valuePosition: 'inside',
    });
    const lists = container.querySelectorAll('.recharts-label-list');
    const [value] = Array.from(lists[1].querySelectorAll('text'));
    expect(value.getAttribute('class')).toContain(
      'fill-[var(--ui-text-on-status-strong-neutral)]!'
    );
  });

  // Beside the funnel the label sits on the card surface; on the segment it sits
  // on a saturated fill, which needs the on-fill token to keep its contrast.
  it('picks the label fill that has contrast at each position', () => {
    const outside = renderChart().container;
    expect(
      outside.querySelector('.recharts-label-list text')?.getAttribute('class')
    ).toContain('fill-[var(--ui-text-on-surface-primary)]!');

    const inside = renderChart({ labelPosition: 'inside' }).container;
    expect(
      inside.querySelector('.recharts-label-list text')?.getAttribute('class')
    ).toContain('fill-[var(--ui-text-on-status-strong-neutral)]!');
  });

  it('lets labelFill override the contrast-matched default', () => {
    const { container } = renderChart({
      labelFill: 'var(--ui-text-on-surface-secondary)',
    });
    const label = container.querySelector('.recharts-label-list text');
    expect(label).toHaveAttribute(
      'fill',
      'var(--ui-text-on-surface-secondary)'
    );
    expect(label?.getAttribute('class')).not.toContain('fill-[var(--ui-text');
  });
});

// recharts 3 builds the legend payload from the graphical item and `Funnel` never
// registers one, so the funnel synthesizes its own and hands it to the shared
// `ChartLegendContent`. These guard that wiring: without it the legend renders
// empty, which is exactly what it did before this existed.
describe('FunnelChart legend', () => {
  const legendLabels = (container: HTMLElement) =>
    Array.from(
      container.querySelectorAll('.recharts-legend-wrapper > div > div')
    ).map((node) => node.textContent);

  it('has no legend unless asked', () => {
    const { container } = renderChart();
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
  });

  it('renders one entry per stage, labelled from config', () => {
    const { container } = renderChart({ showLegend: true });
    expect(legendLabels(container)).toEqual([
      'Visits',
      'Signups',
      'Trials',
      'Purchases',
    ]);
  });

  it('colors each entry with its stage color', () => {
    const { container } = renderChart({ showLegend: true });
    const swatch = container.querySelector<HTMLElement>(
      '.recharts-legend-wrapper [style*="background-color"]'
    );
    expect(swatch?.style.backgroundColor).toBe('var(--color-Visits)');
  });

  it('leaves a hidden stage out of the legend', () => {
    const { container } = renderChart({
      showLegend: true,
      stageSettings: { Trials: { hidden: true } },
    });
    expect(legendLabels(container)).toEqual(['Visits', 'Signups', 'Purchases']);
  });

  it('moves the legend to the top edge', () => {
    const { container } = renderChart({ showLegend: true, legendPos: 'top' });
    // ChartLegendContent pads the side facing the plot, so the edge it sits on is
    // observable without measuring the wrapper.
    expect(
      container.querySelector('.recharts-legend-wrapper > div')?.className
    ).toContain('pb-3');
  });

  // Same-named stages share one `--color-<name>`/`config` entry, so a second
  // entry would repeat the first verbatim — and ChartLegendContent keys on the
  // entry's value, so it would also be a duplicate React key.
  it('renders one entry per distinct stage name', () => {
    const { container } = renderChart({
      showLegend: true,
      data: [
        { stage: 'Visits', value: 5000 },
        { stage: 'Signups', value: 2600 },
        { stage: 'Signups', value: 1400 },
      ],
    });
    expect(legendLabels(container)).toEqual(['Visits', 'Signups']);
    // Both segments still render — the dedupe is the legend's, not the funnel's.
    expect(segments(container)).toHaveLength(3);
  });
});

describe('FunnelChart margin', () => {
  const plotWidth = (container: HTMLElement) =>
    Number(
      container
        .querySelector('.recharts-funnel-trapezoid path')
        ?.getAttribute('width')
    );

  // The margin type is all-optional, so a caller passing one side must keep the
  // defaults on the others rather than collapsing them to zero.
  it('merges a partial margin over the defaults per side', () => {
    const { container } = renderChart({ margin: { right: 160 } });
    const trapezoid = container.querySelector('.recharts-funnel-trapezoid path');
    // left stays at the default 24 rather than dropping to 0.
    expect(Number(trapezoid?.getAttribute('x'))).toBe(24);
    // top stays at the default 8 rather than dropping to 0.
    expect(Number(trapezoid?.getAttribute('y'))).toBe(8);
  });

  it('lets a full margin replace every side', () => {
    const { container } = renderChart({
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    const trapezoid = container.querySelector('.recharts-funnel-trapezoid path');
    expect(Number(trapezoid?.getAttribute('x'))).toBe(0);
    expect(Number(trapezoid?.getAttribute('y'))).toBe(0);
    expect(plotWidth(container)).toBe(600);
  });
});
