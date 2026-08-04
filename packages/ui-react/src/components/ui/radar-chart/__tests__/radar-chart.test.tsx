import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RadarChart, radarRadiusAxisDomain } from '../radar-chart';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

const data = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
];

const config = {
  alice: { label: 'Alice', color: 'rgb(23 99 207)' },
  bob: { label: 'Bob', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof RadarChart>> = {}
) {
  return render(
    <RadarChart
      config={config}
      data={data}
      dataKeys={['alice', 'bob']}
      angleKey="subject"
      {...props}
    />
  );
}

describe('RadarChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each series color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-alice: rgb(23 99 207)');
    expect(style).toContain('--color-bob: rgb(220 53 69)');
  });

  it('defaults to a polygon grid', () => {
    const { container } = renderChart();
    expect(container.firstElementChild).toHaveAttribute(
      'data-grid-type',
      'polygon'
    );
  });

  it('reflects the circle grid-type variant on the root', () => {
    const { container } = renderChart({ gridType: 'circle' });
    expect(container.firstElementChild).toHaveAttribute(
      'data-grid-type',
      'circle'
    );
  });

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the web/series/chrome can't
  // be asserted here. This exercises the dots + chrome-toggle prop paths against
  // a plumbing/crash regression; the visual output is covered by the VR stories.
  it('renders with dots on and the grid/tooltip/legend toggled off', () => {
    const { container } = renderChart({
      showDots: true,
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
describe('RadarChart animation and data labels', () => {
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
      labelPosition: 'center',
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

// The radius axis is what maps a value to a radius, so its domain decides
// whether a radar reads as an absolute profile or a relative one. That mapping is
// pure, so it is asserted directly — the rendered scale is a VR story.
describe('radarRadiusAxisDomain', () => {
  it('leaves an unset preset to recharts (the data max)', () => {
    expect(radarRadiusAxisDomain(undefined, undefined)).toBeUndefined();
    // A maximum on its own does nothing — it only applies under `fixed`.
    expect(radarRadiusAxisDomain(undefined, 150)).toBeUndefined();
  });

  it('pins the outer ring to the given maximum under "fixed"', () => {
    expect(radarRadiusAxisDomain('fixed', 150)).toEqual([0, 150]);
  });

  it('falls back to the data top when "fixed" has no maximum', () => {
    expect(radarRadiusAxisDomain('fixed', undefined)).toEqual([0, 'auto']);
  });

  it('fits the data at both ends under "auto"', () => {
    expect(radarRadiusAxisDomain('auto', 150)).toEqual(['auto', 'auto']);
  });
});

// As above, recharts needs a laid-out container to paint, so these assert the
// prop contract: the composition accepts each new polar-axis / geometry /
// per-series knob and mounts. The rendered result is covered by the VR stories.
describe('RadarChart polar axes, geometry and per-series settings', () => {
  it('accepts the radius-axis prop set', () => {
    const { container } = renderChart({
      showRadiusAxis: true,
      radiusAxisAngle: 90,
      radiusAxisOrientation: 'middle',
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
      radiusAxisTickCount: 4,
      radiusAxisReversed: true,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // A domain (or a reversal) mounts the axis even with the scale hidden — that is
  // how a chart is scaled to a known maximum without showing the ticks.
  it('accepts a radius-axis domain while the scale stays hidden', () => {
    const { container } = renderChart({
      showRadiusAxis: false,
      radiusAxisDomain: 'fixed',
      radiusAxisDomainMax: 150,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts the angle-axis and grid prop set', () => {
    const { container } = renderChart({
      showAngleAxis: false,
      angleAxisOrientation: 'inner',
      angleAxisLine: false,
      angleAxisLineType: 'circle',
      angleTickLine: false,
      angleTickSize: 16,
      radialLines: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts the geometry prop set', () => {
    const { container } = renderChart({
      cx: '40%',
      cy: 180,
      startAngle: 45,
      endAngle: -315,
      innerRadius: 40,
      outerRadius: '70%',
      margin: { top: 16, right: 16, bottom: 16, left: 16 },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts per-series overrides for a subset of the plotted series', () => {
    const { container } = renderChart({
      seriesSettings: {
        alice: {
          color: 'rgb(1 2 3)',
          stroke: 'rgb(4 5 6)',
          fillOpacity: 0.05,
          strokeWidth: 3,
          dot: true,
          dotRadius: 4,
          activeDot: false,
        },
      },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    // A per-series color is applied to the series' fill/stroke, not to the
    // `--color-<key>` custom properties — `config` still injects those, so the
    // series a caller *doesn't* override keeps reading its config color.
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-alice: rgb(23 99 207)');
    expect(style).toContain('--color-bob: rgb(220 53 69)');
  });

  it('ignores seriesSettings keys that are not plotted', () => {
    const { container } = renderChart({
      dataKeys: ['alice'],
      seriesSettings: { carol: { fillOpacity: 0.9 } },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts the dot and active-dot chart-level knobs', () => {
    const { container } = renderChart({
      showDots: true,
      dotRadius: 5,
      activeDot: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('accepts a top legend', () => {
    const { container } = renderChart({ legendPosition: 'top' });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
