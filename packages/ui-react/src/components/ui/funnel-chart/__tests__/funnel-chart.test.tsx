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
  funnelChartStageInset,
  funnelChartStagePath,
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

/**
 * The bounding box a stage's path actually covers.
 *
 * The stages are drawn by the component's own `shape` (recharts' `Trapezoid`
 * can express neither the design's 2px gap nor its rounded corners), so there is
 * no `x`/`y`/`width` attribute to read — the geometry lives in the `d`. Every
 * coordinate in the path is an absolute `x,y` pair, so the extremes of those are
 * the box.
 */
const stageBox = (path: Element) => {
  const pairs = (path.getAttribute('d') ?? '').match(
    /-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/g
  );
  if (!pairs?.length) return null;
  const xs = pairs.map((pair) => Number(pair.split(',')[0]));
  const ys = pairs.map((pair) => Number(pair.split(',')[1]));
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
  };
};

const stageBoxes = (container: HTMLElement) =>
  segments(container).map((path) => stageBox(path)!);

/** Top edge of each stage's trapezoid, in data order. */
const stageTops = (container: HTMLElement) =>
  stageBoxes(container).map((box) => box.top);

const legendOf = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-slot="chart-legend"]');

describe('FunnelChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each stage color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain(
      '--color-Visits: var(--ui-dataviz-sequential-blue-1)'
    );
    expect(style).toContain(
      '--color-Purchases: var(--ui-dataviz-sequential-blue-4)'
    );
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
      spaces(
        funnelChartLabelText({ ...base, format: 'percent', percentFormatter })
      )
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

  // Labels off — the default — or centred on the segments means nothing needs
  // room beside the funnel, so the plot drops to the design's own tight inset
  // instead of reserving 96px of empty strip the funnel could be filling.
  it('drops to the design inset when nothing sits beside the funnel', () => {
    expect(funnelChartLabelMargin({ ...base, showLabels: false })).toEqual({
      top: 4,
      right: 8,
      bottom: 4,
      left: 8,
    });
    expect(
      funnelChartLabelMargin({ ...base, labelPosition: 'inside' })
    ).toEqual({ top: 4, right: 8, bottom: 4, left: 8 });
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
describe('funnelChartStagePath', () => {
  const base = { x: 0, y: 0, upperWidth: 100, lowerWidth: 60, height: 40 };

  it('rounds all four corners of a trapezoid', () => {
    const d = funnelChartStagePath({ ...base, radius: 2 });
    expect(d.match(/Q/g)).toHaveLength(4);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
  });

  it('centres the lower edge on the upper edge', () => {
    // upper 0→100, lower 60 wide ⇒ 20→80, both centred on 50.
    const d = funnelChartStagePath({ ...base, radius: 0 });
    expect(d).toContain('20,40');
    expect(d).toContain('80,40');
  });

  // The `triangle` last shape, and the same triangle upside down under
  // `reversed` — a zero-width edge is one apex, not a degenerate corner pair.
  it('collapses a zero-width lower edge into a single apex', () => {
    const d = funnelChartStagePath({ ...base, lowerWidth: 0, radius: 0 });
    expect(d.match(/Q/g)).toHaveLength(3);
    expect(d).toContain('50,40');
  });

  it('collapses a zero-width upper edge into a single apex', () => {
    const d = funnelChartStagePath({
      ...base,
      upperWidth: 0,
      lowerWidth: 60,
      radius: 0,
    });
    expect(d.match(/Q/g)).toHaveLength(3);
    expect(d).toContain('0,0');
  });

  // Two corners sharing a short edge must not eat past each other — the bottom
  // stages of a funnel are only a few px wide.
  it('clamps the radius to half of the shortest adjacent edge', () => {
    const d = funnelChartStagePath({
      x: 0,
      y: 0,
      upperWidth: 4,
      lowerWidth: 2,
      height: 4,
      radius: 20,
    });
    // Still a closed, four-cornered path rather than an inverted one.
    expect(d.match(/Q/g)).toHaveLength(4);
    expect(d).not.toContain('NaN');
  });

  it('draws nothing for a stage with no area', () => {
    expect(funnelChartStagePath({ ...base, height: 0 })).toBe('');
    expect(
      funnelChartStagePath({ ...base, upperWidth: 0, lowerWidth: 0 })
    ).toBe('');
  });
});

describe('funnelChartStageInset', () => {
  const base = { x: 0, y: 0, upperWidth: 100, lowerWidth: 60, height: 40 };

  // The upper edge slides down the funnel's *own* slope, so insetting the top
  // narrows it by exactly as much as the taper would have at that height —
  // shortening the stage without steepening it.
  it('slides the top edge down the funnel slope', () => {
    const inset = funnelChartStageInset({ ...base, gap: 4 });
    expect(inset.y).toBe(4);
    expect(inset.height).toBe(36);
    // 100 → 60 over 40px, so 4px in the width is 96.
    expect(inset.upperWidth).toBe(96);
    // Still centred on 50.
    expect(inset.x + inset.upperWidth / 2).toBe(50);
  });

  // The bottom edge is what `lastShapeType` defines — move it and a triangle
  // funnel ends in a blunt edge instead of a point.
  it('leaves the lower edge exactly where recharts put it', () => {
    const inset = funnelChartStageInset({ ...base, gap: 4 });
    expect(inset.lowerWidth).toBe(base.lowerWidth);
    expect(inset.y + inset.height).toBe(base.y + base.height);
  });

  it('returns the stage untouched when there is no room for the gap', () => {
    expect(funnelChartStageInset({ ...base, height: 2, gap: 2 })).toEqual({
      ...base,
      height: 2,
    });
    expect(funnelChartStageInset({ ...base, gap: 0 })).toEqual(base);
  });
});

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
      showLabels: true,
      stageSettings: { Trials: { hidden: true } },
    });
    expect(segments(container)).toHaveLength(3);
    expect(labelTexts(container)).toEqual(['Visits', 'Signups', 'Purchases']);
  });

  // A hidden stage leaves the funnel entirely, so the conversions are measured
  // over what is still on screen — 620/5000, not 620/1400.
  it('measures conversions over the visible stages only', () => {
    const { container } = renderChart({
      showLabels: true,
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
      showLabels: true,
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
      showLabels: true,
      labelFormat: 'percent',
      percentFormatter: createTickFormatter(
        { style: 'percent', maximumFractionDigits: 0 },
        'en'
      ),
    });
    expect(labelTexts(container)).toEqual(['100%', '52%', '28%', '12%']);
  });

  // `palette` is the only source of a stage's colour. The default is the
  // sequential blue ramp Figma paints the funnel with, not the shared
  // categorical default every other chart takes.
  it('defaults to the sequential blue ramp rather than the categorical palette', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain(
      '--color-Visits: var(--ui-dataviz-sequential-blue-1)'
    );
    expect(style).not.toContain('--ui-dataviz-categorical-1)');
  });

  it('paints the stages from an explicit palette override', () => {
    const { container } = renderChart({ palette: { type: 'categorical' } });
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-Visits: var(--ui-dataviz-categorical-1)');
    expect(style).toContain(
      '--color-Purchases: var(--ui-dataviz-categorical-4)'
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

  // recharts defaults the stroke to a hardcoded `#fff`. Our custom shape
  // class doesn't match ChartContainer's neutralizer, so the component
  // resolves to `'none'` itself. A bare strokeWidth would widen an invisible
  // border — pair it with the border token instead.
  it('pairs a bare strokeWidth with the border token', () => {
    const { container } = renderChart({ strokeWidth: 2 });
    const paths = segments(container);
    expect(paths[0]).toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border)'
    );
    expect(paths[0]).toHaveAttribute('stroke-width', '2');
  });

  it('suppresses the recharts #fff stroke default when neither prop is given', () => {
    const { container } = renderChart();
    expect(segments(container)[0]).toHaveAttribute('stroke', 'none');
  });

  it('narrows the funnel to funnelWidth', () => {
    const narrow = renderChart({ funnelWidth: 200 }).container;
    const wide = renderChart().container;
    expect(stageBoxes(narrow)[0].width).toBeLessThan(
      stageBoxes(wide)[0].width
    );
  });

  // The reserve is a default, so an explicit funnelWidth has to survive a
  // composite label asking for one of its own.
  it('lets a caller-supplied funnelWidth win over the composite reserve', () => {
    const reserved = renderChart({
      showLabels: true,
      labelFormat: 'name-percent',
    }).container;
    const explicit = renderChart({
      showLabels: true,
      labelFormat: 'name-percent',
      funnelWidth: '100%',
    }).container;
    expect(stageBoxes(reserved)[0].width).toBeLessThan(
      stageBoxes(explicit)[0].width
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
  it('hides stage labels by default to match the Figma widget', () => {
    const { container } = renderChart();
    expect(labelTexts(container)).toEqual([]);
  });

  it('renders stage labels when showLabels is enabled', () => {
    const { container } = renderChart({ showLabels: true });
    expect(labelTexts(container)).toEqual([
      'Visits',
      'Signups',
      'Trials',
      'Purchases',
    ]);
  });

  it('renders the requested labelFormat', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormat: 'name-percent',
    });
    expect(labelTexts(container)).toEqual([
      'Visits: 100.0%',
      'Signups: 52.0%',
      'Trials: 28.0%',
      'Purchases: 12.4%',
    ]);
  });

  it('formats the numeric part of a label', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFormat: 'value',
      labelFormatter: (value) => `${Number(value) / 1000}k`,
    });
    expect(labelTexts(container)).toEqual(['5k', '2.6k', '1.4k', '0.62k']);
  });

  it('adds a second label carrying the value', () => {
    const { container } = renderChart({
      showLabels: true,
      showValueLabels: true,
    });
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
    const { container } = renderChart({
      showLabels: true,
      showValueLabels: true,
    });
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
      showLabels: true,
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
      showLabels: true,
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
    const outside = renderChart({ showLabels: true }).container;
    expect(
      outside.querySelector('.recharts-label-list text')?.getAttribute('class')
    ).toContain('fill-[var(--ui-text-on-surface-primary)]!');

    const inside = renderChart({
      showLabels: true,
      labelPosition: 'inside',
    }).container;
    expect(
      inside.querySelector('.recharts-label-list text')?.getAttribute('class')
    ).toContain('fill-[var(--ui-text-on-status-strong-neutral)]!');
  });

  it('lets labelFill override the contrast-matched default', () => {
    const { container } = renderChart({
      showLabels: true,
      labelFill: 'var(--ui-text-on-surface-secondary)',
    });
    const label = container.querySelector('.recharts-label-list text');
    expect(label).toHaveAttribute(
      'fill',
      'var(--ui-text-on-surface-secondary)'
    );
    expect(label?.getAttribute('class')).not.toContain(
      'fill-[var(--ui-text-on-surface-primary)]!'
    );
    expect(label?.getAttribute('class')).not.toContain(
      'fill-[var(--ui-text-on-status-strong-neutral)]!'
    );
  });
});

// recharts 3 builds the legend payload from the graphical item and `Funnel` never
// registers one, so the funnel synthesizes its own and hands it to the shared
// `ChartLegendContent`. These guard that wiring: without it the legend renders
// empty, which is exactly what it did before this existed.
describe('FunnelChart legend', () => {
  const legend = (container: HTMLElement) =>
    container.querySelector('[data-slot="chart-legend"]');

  const legendLabels = (container: HTMLElement) =>
    Array.from(
      legend(container)?.querySelectorAll(':scope > div > div > span') ?? []
    ).map((node) => node.textContent);

  it('can hide the default legend', () => {
    const { container } = renderChart({ showLegend: false });
    expect(legend(container)).toBeNull();
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

  // The legend sits outside `ChartContainer`, so it cannot use the
  // `--color-<name>` custom properties `ChartStyle` scopes to `[data-chart=…]` —
  // those resolve to nothing out here and the marker would paint transparent.
  // Each entry carries its resolved palette token instead.
  it('colors each entry with its resolved palette token, not a scoped --color-*', () => {
    const { container } = renderChart({ showLegend: true });
    const swatches = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-slot="chart-legend"] [style*="background-color"]'
      )
    ).map((node) => node.style.backgroundColor);
    expect(swatches).toEqual([
      'var(--ui-dataviz-sequential-blue-1)',
      'var(--ui-dataviz-sequential-blue-2)',
      'var(--ui-dataviz-sequential-blue-3)',
      'var(--ui-dataviz-sequential-blue-4)',
    ]);
    expect(swatches).not.toContain('var(--color-Visits)');
  });

  it('paints a stageSettings color on that stage’s legend marker too', () => {
    const { container } = renderChart({
      showLegend: true,
      stageSettings: {
        Trials: { color: 'var(--ui-background-status-strong-info)' },
      },
    });
    const swatches = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-slot="chart-legend"] [style*="background-color"]'
      )
    ).map((node) => node.style.backgroundColor);
    expect(swatches[2]).toBe('var(--ui-background-status-strong-info)');
  });

  it('renders a two-column list with config labels and primary text values', () => {
    const { container } = renderChart({ showLegend: true });
    const legendElement = legend(container);
    expect(legendElement).toHaveTextContent('Visits5000');
    expect(legendElement).toHaveTextContent('Purchases620');
    expect(
      legendElement?.querySelectorAll('[style*="background-color"]')
    ).toHaveLength(4);

    const values = legendElement?.querySelectorAll(
      'span.text-\\[var\\(--ui-text-on-surface-primary\\)\\]'
    );
    expect(values).toHaveLength(4);
    expect(legendElement?.innerHTML).not.toContain(
      '--ui-text-on-surface-link-idle'
    );
  });

  it('leaves a hidden stage out of the legend', () => {
    const { container } = renderChart({
      showLegend: true,
      stageSettings: { Trials: { hidden: true } },
    });
    expect(legendLabels(container)).toEqual(['Visits', 'Signups', 'Purchases']);
  });

  // The legend is a sibling of the plot, never a recharts `<Legend>` inside it —
  // that is what puts it beside the funnel rather than under it, and it is the
  // same composition `PieChart`/`RadialBarChart` use.
  it('renders the legend beside the plot, outside the recharts SVG', () => {
    const { container } = renderChart({ showLegend: true });
    const root = container.firstElementChild!;
    const plot = root.querySelector('[data-slot="chart"]')!;
    const legendElement = legend(container)!;

    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
    expect(plot.contains(legendElement)).toBe(false);
    expect(legendElement.parentElement).toBe(root);
    // Plot first, legend second — the legend is to the funnel's inline end.
    expect(Array.from(root.children).indexOf(legendElement)).toBe(1);
    expect(root.className).toContain('flex-row');
    expect(root.className).toContain('gap-4');
  });

  // A funnel with no legend has nothing to sit beside, so the plot centres
  // instead of being pinned to the inline start of a half-empty row.
  it('centres the plot when the legend is off', () => {
    const { container } = renderChart({ showLegend: false });
    expect(container.firstElementChild?.className).toContain('justify-center');
  });

  it('formats the legend values with legendValueFormatter', () => {
    const { container } = renderChart({
      showLegend: true,
      legendValueFormatter: (value) => `${Number(value) / 1000}k`,
    });
    expect(legend(container)).toHaveTextContent('Visits5k');
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
  // The margin type is all-optional, so a caller passing one side must keep the
  // defaults on the others rather than collapsing them to zero.
  it('merges a partial margin over the defaults per side', () => {
    const { container } = renderChart({ margin: { right: 160 } });
    const first = stageBoxes(container)[0];
    // left stays at the design default 8 rather than dropping to 0.
    expect(first.left).toBe(8);
    // top stays at the design default 4 rather than dropping to 0.
    expect(first.top).toBe(4);
    // right is the one side the caller moved.
    expect(first.right).toBe(600 - 160);
  });

  it('lets a full margin replace every side', () => {
    const { container } = renderChart({
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    const first = stageBoxes(container)[0];
    expect(first.left).toBe(0);
    expect(first.top).toBe(0);
    expect(first.width).toBe(600);
  });
});

// The design draws the funnel with a 2px band of surface between stages and 2px
// rounded corners. recharts can express neither — `Funnel` has no gap prop and
// `Trapezoid` no radius — so both come from the component's own `shape`, and
// these are what stop that quietly regressing to flush, square-cornered stages.
describe('FunnelChart stage geometry', () => {
  it('leaves a 2px gap between every pair of stages', () => {
    const { container } = renderChart();
    const boxes = stageBoxes(container);
    expect(boxes).toHaveLength(4);

    const gaps = boxes
      .slice(1)
      .map((box, index) => box.top - boxes[index].bottom);
    // Three gaps for four stages: the funnel's own top edge is not a seam.
    expect(gaps).toEqual([2, 2, 2]);
  });

  // The first stage must stay flush with the top of the plot area — inset it too
  // and the funnel drifts down, losing 2px off the bottom of a 120px plot.
  it('keeps the first stage flush with the top of the plot area', () => {
    const { container } = renderChart();
    expect(stageBoxes(container)[0].top).toBe(4);
  });

  it('rounds the stage corners rather than drawing a bare polygon', () => {
    const { container } = renderChart();
    const d = segments(container)[0].getAttribute('d') ?? '';
    // A quadratic per corner, and no straight-line-only path.
    expect(d.match(/Q/g)).toHaveLength(4);
    expect(d).toMatch(/^M /);
    expect(d).toMatch(/Z$/);
  });

  // `lastShape` is the one CVA axis, and the gap must not blunt the apex: the
  // triangle's point is the bottom edge, which the inset deliberately leaves be.
  it('narrows the last stage to a point for the triangle last shape', () => {
    const { container } = renderChart({ lastShape: 'triangle' });
    const d = segments(container)[3].getAttribute('d') ?? '';
    // Three corners, not four — the lower edge collapsed into the apex.
    expect(d.match(/Q/g)).toHaveLength(3);
  });

  it('keeps a flat lower edge for the rectangle last shape', () => {
    const { container } = renderChart({ lastShape: 'rectangle' });
    const d = segments(container)[3].getAttribute('d') ?? '';
    expect(d.match(/Q/g)).toHaveLength(4);
  });

  // The stages narrow downward and stay centred on one axis, so the funnel reads
  // as a funnel rather than a staircase.
  it('narrows each stage and keeps them centred on one axis', () => {
    const { container } = renderChart();
    const boxes = stageBoxes(container);
    const centres = boxes.map((box) => (box.left + box.right) / 2);
    centres.forEach((centre) => expect(centre).toBeCloseTo(centres[0], 1));

    const widths = boxes.map((box) => box.width);
    widths.slice(1).forEach((width, index) => {
      expect(width).toBeLessThan(widths[index]);
    });
  });
});

// The plot is the design's 120px square and the legend takes the rest, so the
// component fills its parent's width without the funnel stretching into a tall,
// narrow wedge — the failure mode a `flex-1` plot produced.
describe('FunnelChart layout', () => {
  it('sizes the plot as the design square and lets the legend take the rest', () => {
    const { container } = renderChart({ showLegend: true });
    const plotBox = container.querySelector('[data-slot="chart"]')
      ?.parentElement;
    expect(plotBox?.className).toContain('size-[120px]');
    expect(plotBox?.className).toContain('shrink-0');
    expect(legendOf(container)?.className).toContain('flex-1');
    expect(legendOf(container)?.className).toContain('min-w-0');
  });

  // No fixed width, and no height of its own: a widget sizes the row, and the
  // legend column absorbs whatever width is left.
  it('carries no fixed width or height of its own', () => {
    const { container } = renderChart();
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).not.toMatch(/\bw-\[/);
    expect(root.className).not.toMatch(/\bh-\[/);
    expect(root.style.width).toBe('');
    expect(root.style.height).toBe('');
  });

  it('keeps a caller className alongside the layout classes', () => {
    const { container } = renderChart({ className: 'size-full' });
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('size-full');
    expect(root.className).toContain('flex-row');
  });

  // When a label list sits beside the funnel, the 120px fixed width would leave
  // 0px for the funnel itself (label margins consume the entire fixed width).
  // The plot-frame must grow to fill the available width in that case.
  it('switches the plot-frame to flex-1 when labels sit beside the funnel', () => {
    const { container } = renderChart({ showLabels: true, labelPosition: 'right' });
    const plotFrame = container.querySelector('[data-slot="chart"]')?.parentElement;
    expect(plotFrame?.className).toContain('flex-1');
    expect(plotFrame?.className).toContain('h-[120px]');
    expect(plotFrame?.className).not.toContain('size-[120px]');
    expect(plotFrame?.className).not.toContain('shrink-0');
  });

  it('keeps the plot-frame fixed at 120px when labels are inside or off', () => {
    const inside = renderChart({ showLabels: true, labelPosition: 'inside' });
    const insideFrame = inside.container.querySelector('[data-slot="chart"]')?.parentElement;
    expect(insideFrame?.className).toContain('size-[120px]');

    const off = renderChart({ showLabels: false });
    const offFrame = off.container.querySelector('[data-slot="chart"]')?.parentElement;
    expect(offFrame?.className).toContain('size-[120px]');
  });
});
