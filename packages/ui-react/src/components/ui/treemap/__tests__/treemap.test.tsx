import * as React from 'react';
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Treemap, TreemapCell, treemapSecondaryLabel } from '../treemap';
import {
  ChartTooltipContent,
  type ChartConfig,
  resolveAnimation,
} from '../../chart';

beforeAll(() => {
  // happy-dom's ResizeObserver never reports a size, so recharts'
  // ResponsiveContainer renders nothing and its children never mount. The cells,
  // labels and legend below are the real SVG/DOM output, so these tests need the
  // chart laid out.
  class SizedResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element) {
      this.callback(
        [
          {
            target,
            contentRect: { width: 600, height: 400 },
          } as unknown as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver
      );
    }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    SizedResizeObserver as unknown as typeof ResizeObserver;
});

const data = [
  { name: 'React', size: 2400, count: 24 },
  { name: 'Vue', size: 1200, count: 12 },
  { name: 'Svelte', size: 800, count: 8 },
  { name: 'Angular', size: 1600, count: 16 },
];

const config = {
  React: { label: 'React', color: 'rgb(23 99 207)' },
  Vue: { label: 'Vue', color: 'rgb(34 139 79)' },
  Svelte: { label: 'Svelte', color: 'rgb(212 149 42)' },
  Angular: { label: 'Angular', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof Treemap>> = {}
) {
  return render(
    <Treemap
      config={config}
      data={data}
      dataKey="size"
      nameKey="name"
      {...props}
    />
  );
}

// The label block is HTML in a `foreignObject` (so the logical utilities that
// mirror it under RTL apply), one span per line.
const cellText = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('foreignObject span')).map(
    (node) => node.textContent
  );

const labelBlock = (container: HTMLElement) =>
  container.querySelector('foreignObject > div');

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

  it('labels every leaf with its name', () => {
    const { container } = renderChart();
    expect(cellText(container)).toEqual(['React', 'Vue', 'Svelte', 'Angular']);
  });

  // The tiling itself is what the VR stories cover; this exercises the
  // aspectRatio + labels/tooltip toggle prop paths against a plumbing regression.
  it('renders with a custom aspectRatio and labels/tooltip toggled off', () => {
    const { container } = renderChart({
      aspectRatio: 1,
      showLabels: false,
      showTooltip: false,
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(cellText(container)).toEqual([]);
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

  // The `tooltipContent` prop forwards a custom (library-owned) ChartTooltipContent
  // to recharts' Tooltip; the tooltip only paints on hover, so this guards the prop
  // path — consumers customize the tooltip without importing recharts.
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

// A treemap cell has no recharts `LabelList` to hand a label to, so the label
// block — its second line, its alignment, and what it drops when the tile is too
// small — is composed by the chart and laid out by the cell renderer.
describe('Treemap cell labels', () => {
  // Logical utilities, not coordinates: `text-start` and the flex alignment are
  // what mirror the block under `dir="rtl"`, the same way every other component
  // handles direction.
  it('anchors the label at the tile start edge, bottom, by default', () => {
    const { container } = renderChart();
    expect(labelBlock(container)).toHaveClass('justify-end', 'text-start');
  });

  it('centers the label block when asked', () => {
    const { container } = renderChart({ labelAlign: 'center' });
    expect(labelBlock(container)).toHaveClass('justify-center', 'text-center');
  });

  it('hangs the label from the tile start edge, top, when asked', () => {
    const { container } = renderChart({ labelAlign: 'top-left' });
    expect(labelBlock(container)).toHaveClass('justify-start', 'text-start');
  });

  // Each line is truncated by CSS, so nothing estimates how much text fits.
  it('truncates each line rather than overflowing its tile', () => {
    const { container } = renderChart({ secondaryKeys: ['size'] });
    Array.from(container.querySelectorAll('foreignObject span')).forEach(
      (line) => expect(line).toHaveClass('truncate')
    );
  });

  // The tooltip opens on the tile's own hover, so the label must not swallow it.
  it('leaves the tile to receive the pointer', () => {
    const { container } = renderChart();
    expect(container.querySelector('foreignObject')).toHaveClass(
      'pointer-events-none'
    );
  });

  // A leaf's key has to be CSS-safe (it becomes part of `--color-<name>`), so a
  // display name with a space in it can only live in the config label — which is
  // therefore what the tile shows, matching its legend entry and tooltip row.
  it('titles each cell with its config label, not its leaf key', () => {
    const { container } = render(
      <Treemap
        config={{
          'awaiting-approval': {
            label: 'Awaiting approval',
            color: 'rgb(23 99 207)',
          },
          won: { label: 'Won', color: 'rgb(34 139 79)' },
        }}
        data={[
          { name: 'awaiting-approval', size: 2400 },
          { name: 'won', size: 1600 },
        ]}
        dataKey="size"
        nameKey="name"
      />
    );
    expect(cellText(container)).toEqual(['Awaiting approval', 'Won']);
  });

  it('falls back to the leaf key when its config label is not a string', () => {
    const { container } = render(
      <Treemap
        config={{ won: { label: <span>Won</span>, color: 'rgb(34 139 79)' } }}
        data={[{ name: 'won', size: 2400 }]}
        dataKey="size"
        nameKey="name"
      />
    );
    expect(cellText(container)).toEqual(['won']);
  });

  it('adds a second line from secondaryKeys', () => {
    const { container } = renderChart({ secondaryKeys: ['size'] });
    expect(cellText(container)).toEqual([
      'React',
      '2400',
      'Vue',
      '1200',
      'Svelte',
      '800',
      'Angular',
      '1600',
    ]);
  });

  it('joins several secondary fields and formats each by its index', () => {
    const { container } = renderChart({
      secondaryKeys: ['size', 'count'],
      secondaryFormatter: (value, index) =>
        index === 0 ? `${value} kB` : `${value} files`,
    });
    expect(cellText(container)).toContain('2400 kB · 24 files');
  });

  it('honors a custom secondary separator', () => {
    const { container } = renderChart({
      secondaryKeys: ['size', 'count'],
      secondarySeparator: ' / ',
    });
    expect(cellText(container)).toContain('2400 / 24');
  });

  it('leaves the second line off unless secondaryKeys is given', () => {
    const { container } = renderChart();
    expect(cellText(container)).not.toContain('2400');
  });

  // recharts hands `content` the whole data row, so the composed line has to be
  // stamped onto the row (the same way `fill` is) before the cell sees it. A row
  // that has none of the secondary fields gets no second line rather than an
  // empty one.
  it('skips the second line on a row with none of the secondary fields', () => {
    const { container } = renderChart({ secondaryKeys: ['missing'] });
    expect(cellText(container)).toEqual(['React', 'Vue', 'Svelte', 'Angular']);
  });
});

// recharts 3 builds the legend payload from the graphical item and `Treemap` never
// registers one, so the treemap synthesizes its own and hands it to the shared
// `ChartLegendContent`. These guard that wiring: without it the legend renders
// empty, which is exactly what a `<Legend>` in a treemap did before this existed.
describe('Treemap legend', () => {
  const legendRow = (container: HTMLElement) =>
    container.querySelector<HTMLElement>(
      '[data-chart]:not([data-slot="chart"])'
    );
  // The row holds the `<style>` re-emitting the colors, then the legend itself,
  // whose children are the entries.
  const legendLabels = (container: HTMLElement) =>
    Array.from(legendRow(container)?.lastElementChild?.children ?? []).map(
      (node) => node.textContent
    );

  it('has no legend unless asked', () => {
    const { container } = renderChart();
    expect(legendRow(container)).toBeNull();
  });

  it('renders one entry per leaf, labelled from config', () => {
    const { container } = renderChart({ showLegend: true });
    expect(legendLabels(container)).toEqual([
      'React',
      'Vue',
      'Svelte',
      'Angular',
    ]);
  });

  it('colors each entry with its leaf color', () => {
    const { container } = renderChart({ showLegend: true });
    const swatch = legendRow(container)?.querySelector<HTMLElement>(
      '[style*="background-color"]'
    );
    expect(swatch?.style.backgroundColor).toBe('var(--color-React)');
  });

  // Same-named leaves share one `--color-<name>`/`config` entry, so a second entry
  // would repeat the first verbatim — and ChartLegendContent keys on the entry's
  // value, so it would also be a duplicate React key.
  it('lists a repeated leaf name once', () => {
    const { container } = renderChart({
      showLegend: true,
      data: [
        { name: 'React', size: 2400 },
        { name: 'React', size: 1200 },
        { name: 'Vue', size: 800 },
      ],
    });
    expect(legendLabels(container)).toEqual(['React', 'Vue']);
  });

  it('moves the legend to the top edge', () => {
    const { container } = renderChart({ showLegend: true, legendPos: 'top' });
    expect(container.firstElementChild?.firstElementChild).toBe(
      legendRow(container)
    );
    // ChartLegendContent pads the side facing the plot, so the edge it sits on is
    // observable without measuring anything.
    expect(legendRow(container)?.lastElementChild?.className).toContain('pb-3');
  });

  // recharts' Treemap tiles the full chart surface and ignores the legend's size, so
  // the legend is a row of its own beside the chart rather than a `<Legend>` over the
  // plot — which would paint on top of the tiles, and would also make the treemap
  // read a box a legend-row too tall (it reads it once, before a `<Legend>` can
  // render).
  it('lays the legend out as a row after the chart', () => {
    const { container } = renderChart({ showLegend: true });
    const root = container.firstElementChild;
    expect(root).toHaveClass('flex', 'flex-col');
    expect(root?.children).toHaveLength(2);
    expect(root?.firstElementChild).toHaveAttribute('data-slot', 'chart');
    expect(root?.lastElementChild).toBe(legendRow(container));
    expect(container.querySelector('.recharts-legend-wrapper')).toBeNull();
  });

  // The legend row sits outside the container that scopes the `--color-<name>`
  // properties, so it re-emits them under its own id — otherwise every swatch
  // resolves to nothing.
  it('re-emits the config colors for the legend row', () => {
    const { container } = renderChart({ showLegend: true });
    const row = legendRow(container);
    const chartId = row?.getAttribute('data-chart');
    expect(chartId).toBeTruthy();
    expect(row?.querySelector('style')?.innerHTML).toContain(
      `[data-chart=${chartId}]`
    );
    expect(row?.querySelector('style')?.innerHTML).toContain(
      '--color-React: rgb(23 99 207)'
    );
  });

  it('adds no row when the legend is off', () => {
    const { container } = renderChart();
    const root = container.firstElementChild;
    expect(root).not.toHaveClass('flex-col');
    expect(root?.children).toHaveLength(1);
  });
});

// The cell renderer is exercised directly for the geometry the chart-level tests
// can't dictate: recharts decides how big each tile is, so the size thresholds need
// explicit rects.
describe('TreemapCell', () => {
  it('insets the tile so the surface shows through between cells', () => {
    const { container } = render(
      <svg>
        <TreemapCell name="React" x={10} y={20} width={160} height={90} />
      </svg>
    );
    const rect = container.querySelector('rect');
    expect(rect).toHaveAttribute('x', '12');
    expect(rect).toHaveAttribute('y', '22');
    expect(rect).toHaveAttribute('width', '156');
    expect(rect).toHaveAttribute('height', '86');
    expect(rect).toHaveAttribute('rx', '6');
  });

  it('labels a named leaf whose tile clears the size threshold', () => {
    const { container } = render(
      <svg>
        <TreemapCell name="React" width={90} height={60} />
      </svg>
    );
    expect(container.querySelector('rect')?.style.fill).toBe(
      'var(--color-React)'
    );
    expect(cellText(container)).toEqual(['React']);
  });

  it('suppresses the label on a named leaf below the threshold but still paints the rect', () => {
    const { container } = render(
      <svg>
        <TreemapCell name="React" width={40} height={20} />
      </svg>
    );
    expect(container.querySelector('rect')?.style.fill).toBe(
      'var(--color-React)'
    );
    expect(container.querySelector('foreignObject')).not.toBeInTheDocument();
  });

  it('suppresses the label when showLabels is off even on a large rect', () => {
    const { container } = render(
      <svg>
        <TreemapCell name="React" width={90} height={60} showLabels={false} />
      </svg>
    );
    expect(container.querySelector('foreignObject')).not.toBeInTheDocument();
  });

  it('renders nothing paintable for the name-less synthetic root node', () => {
    const { container } = render(
      <svg>
        <TreemapCell width={500} height={320} />
      </svg>
    );
    expect(container.querySelector('rect')).not.toBeInTheDocument();
    expect(container.querySelector('foreignObject')).not.toBeInTheDocument();
  });

  // The label block covers the tile it belongs to — (10,20)+(160x90) inset by the
  // 2px gutter — and CSS places the lines inside it.
  it('lays the label block over the tile', () => {
    const { container } = render(
      <svg>
        <TreemapCell
          name="React"
          secondaryLabel="2,400 · 24"
          x={10}
          y={20}
          width={160}
          height={90}
        />
      </svg>
    );
    const label = container.querySelector('foreignObject');
    expect(label).toHaveAttribute('x', '12');
    expect(label).toHaveAttribute('y', '22');
    expect(label).toHaveAttribute('width', '156');
    expect(label).toHaveAttribute('height', '86');
    expect(cellText(container)).toEqual(['React', '2,400 · 24']);
  });

  // "Degrade gracefully": the second line goes before the title does.
  it('drops the second line on a cell too short for it, keeping the title', () => {
    const { container } = render(
      <svg>
        <TreemapCell
          name="React"
          secondaryLabel="2,400"
          width={160}
          height={50}
        />
      </svg>
    );
    expect(cellText(container)).toEqual(['React']);
  });
});

describe('treemapSecondaryLabel', () => {
  const row = { name: 'React', size: 2400, count: 24, blank: '' };

  it('joins each field with the separator', () => {
    expect(
      treemapSecondaryLabel({
        row,
        keys: ['size', 'count'],
        separator: ' · ',
      })
    ).toBe('2400 · 24');
  });

  it('formats each value with the field index', () => {
    const formatter = vi.fn((value: number | string) => `${value}!`);
    expect(
      treemapSecondaryLabel({
        row,
        keys: ['size', 'count'],
        separator: ' · ',
        formatter,
      })
    ).toBe('2400! · 24!');
    expect(formatter).toHaveBeenCalledWith(2400, 0);
    expect(formatter).toHaveBeenCalledWith(24, 1);
  });

  it('skips missing and empty fields rather than leaving a dangling separator', () => {
    expect(
      treemapSecondaryLabel({
        row,
        keys: ['missing', 'size', 'blank'],
        separator: ' · ',
      })
    ).toBe('2400');
  });

  it('has no line when no field carries a value', () => {
    expect(
      treemapSecondaryLabel({ row, keys: ['missing'], separator: ' · ' })
    ).toBeUndefined();
  });
});

// These assert the prop contract itself: the composition accepts every animation
// prop and mounts, and the animation resolves to the reduced-motion-aware value
// rather than a literal `true`.
describe('Treemap animation', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
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
});
