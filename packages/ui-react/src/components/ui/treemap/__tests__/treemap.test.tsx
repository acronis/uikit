import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Treemap, TreemapCell, treemapSecondaryLabel } from '../treemap';
import {
  ChartTooltipContent,
  type ChartConfig,
  resolveAnimation,
} from '../../chart';

import { giveEveryChartASize } from '../../chart/__tests__/chart-layout';

// The cells, labels and legend asserted below are the real SVG/DOM output, which
// recharts skips entirely at 0×0.
giveEveryChartASize();

const data = [
  { name: 'React', size: 2400, count: 24 },
  { name: 'Vue', size: 1200, count: 12 },
  { name: 'Svelte', size: 800, count: 8 },
  { name: 'Angular', size: 1600, count: 16 },
];

const config = {
  React: { label: 'React' },
  Vue: { label: 'Vue' },
  Svelte: { label: 'Svelte' },
  Angular: { label: 'Angular' },
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

/** One `<g>` per leaf tile, holding that tile's rect and its label block. */
const tiles = (container: HTMLElement) => [
  ...container.querySelectorAll('.recharts-treemap-depth-1'),
];

/** Where recharts laid each tile out — i.e. the tiling itself. */
const tileBoxes = (container: HTMLElement) =>
  [...container.querySelectorAll('rect')].map(
    (rect) =>
      `${rect.getAttribute('x')},${rect.getAttribute('y')} ` +
      `${rect.getAttribute('width')}x${rect.getAttribute('height')}`
  );

describe('Treemap', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each leaf color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    // Default palette is diverging blue-orange; data order React(0)→a3, Angular(3)→b1
    expect(style).toContain(
      '--color-React: var(--ui-dataviz-diverging-blue-orange-a3)'
    );
    expect(style).toContain(
      '--color-Angular: var(--ui-dataviz-diverging-blue-orange-b1)'
    );
  });

  it('labels every leaf with its name', () => {
    const { container } = renderChart();
    expect(cellText(container)).toEqual(['React', 'Vue', 'Svelte', 'Angular']);
  });

  // `aspectRatio` is the ratio recharts squarifies the tiles towards, so a
  // plumbing regression that dropped it would leave the tiling identical to the
  // default one — same leaves, same boxes.
  it('retiles the leaves for a custom aspectRatio, with labels and tooltip off', () => {
    const { container } = renderChart({
      aspectRatio: 1,
      showLabels: false,
      showTooltip: false,
    });
    expect(tiles(container)).toHaveLength(4);
    expect(cellText(container)).toEqual([]);
    expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull();
    expect(tileBoxes(container)).not.toEqual(
      tileBoxes(renderChart().container)
    );
  });

  it('draws no tiles but still mounts on empty data', () => {
    const { container } = renderChart({ data: [] });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    expect(tiles(container)).toHaveLength(0);
    expect(cellText(container)).toEqual([]);
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

// A treemap cell has no recharts `LabelList` to hand a label to, so the label
// block — its second line, its alignment, and what it drops when the tile is too
// small — is composed by the chart and laid out by the cell renderer.
describe('Treemap cell labels', () => {
  // Logical utilities, not coordinates: `text-center`/`text-start` and the flex
  // alignment are what mirror the block under `dir="rtl"`, the same way every other
  // component handles direction.
  it('centers the label by default', () => {
    const { container } = renderChart();
    expect(labelBlock(container)).toHaveClass('justify-center', 'text-center');
  });

  it('anchors the label at bottom-start when asked', () => {
    const { container } = renderChart({ labelAlign: 'bottom-start' });
    expect(labelBlock(container)).toHaveClass('justify-end', 'text-start');
  });

  it('hangs the label from the tile start edge, top, when asked', () => {
    const { container } = renderChart({ labelAlign: 'top-start' });
    expect(labelBlock(container)).toHaveClass('justify-start', 'text-start');
  });

  // Each line is truncated by CSS, so nothing estimates how much text fits.
  it('truncates each line rather than overflowing its tile', () => {
    const { container } = renderChart({ secondaryKeys: ['size'] });
    Array.from(container.querySelectorAll('foreignObject span')).forEach(
      (line) => expect(line).toHaveClass('truncate')
    );
  });

  // `truncate` only ellipsizes a line the *tile* constrains. `items-center` would
  // size each line to its own text instead, so a name longer than its tile would
  // overflow and be hard-clipped on both edges with no ellipsis — centering is
  // `text-center`'s job, and the cross axis has to stay on `items-stretch`.
  it.each(['bottom-start', 'top-start', 'center'] as const)(
    'keeps the lines tile-width so they can ellipsize (%s)',
    (labelAlign) => {
      const { container } = renderChart({ labelAlign });
      expect(labelBlock(container)).not.toHaveClass('items-center');
    }
  );

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
          },
          won: { label: 'Won' },
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
        config={{ won: { label: <span>Won</span> } }}
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
    // Default palette is diverging blue-orange
    expect(row?.querySelector('style')?.innerHTML).toContain(
      '--color-React: var(--ui-dataviz-diverging-blue-orange-a3)'
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
    expect(rect).toHaveAttribute('rx', '0');
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

  // The thresholds are line boxes, not font sizes: `text-sm` renders 19px tall
  // (Tailwind's 4/3 ratio on 14px → ceil(18.67) = 19), so one line needs
  // 12*2 + 19 = 43px of tile and two need a further 15. A tile between the
  // font-size sum and the real fit would pass a font-size-based check and then
  // have its first line clipped by the block's `overflow-hidden`. Node height =
  // tile height + the 2px gutter on each side.
  it.each([
    { height: 47, tile: 43, labelled: true },
    { height: 46, tile: 42, labelled: false },
  ])('labels a $tile px tile: $labelled', ({ height, labelled }) => {
    const { container } = render(
      <svg>
        <TreemapCell name="React" width={160} height={height} />
      </svg>
    );
    expect(cellText(container)).toEqual(labelled ? ['React'] : []);
  });

  it.each([
    { height: 62, tile: 58, lines: ['React', '2,400'] },
    { height: 61, tile: 57, lines: ['React'] },
  ])('fits two lines in a $tile px tile: $lines', ({ height, lines }) => {
    const { container } = render(
      <svg>
        <TreemapCell
          name="React"
          secondaryLabel="2,400"
          width={160}
          height={height}
        />
      </svg>
    );
    expect(cellText(container)).toEqual(lines);
  });

  // Adaptive text color — diverging palette.
  it('renders light text on dark stops (diverging a3 at index 0, b3 at index 5)', () => {
    const { container } = renderChart({
      palette: { type: 'diverging', pair: 'blue-orange' },
      data: [
        { name: 'first', size: 2400 }, // slot 0 = a3 = dark fill
        { name: 'second', size: 1200 }, // slot 1 = a2 = pale fill
      ],
      config: {
        first: { label: 'First' },
        second: { label: 'Second' },
      },
    });
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>('foreignObject > div')
    );
    // slot 0 (a3) → dark fill → light text token
    expect(blocks[0]).toHaveClass(
      'text-[var(--ui-text-on-status-strong-neutral)]'
    );
    // slot 1 (a2) → pale fill → dark text token
    expect(blocks[1]).toHaveClass('text-[var(--ui-text-on-surface-primary)]');
  });

  it('renders dark text on pale stops (diverging a1/a2/b1/b2)', () => {
    const { container } = renderChart({
      palette: { type: 'diverging', pair: 'blue-orange' },
      data: [
        { name: 'd0', size: 2400 }, // slot 0 = a3 = dark
        { name: 'd1', size: 2000 }, // slot 1 = a2 = pale
        { name: 'd2', size: 1600 }, // slot 2 = a1 = pale
        { name: 'd3', size: 1200 }, // slot 3 = b1 = pale
        { name: 'd4', size: 800 },  // slot 4 = b2 = pale
        { name: 'd5', size: 400 },  // slot 5 = b3 = dark
      ],
      config: {
        d0: { label: 'D0' },
        d1: { label: 'D1' },
        d2: { label: 'D2' },
        d3: { label: 'D3' },
        d4: { label: 'D4' },
        d5: { label: 'D5' },
      },
    });
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>('foreignObject > div')
    );
    const onStrong = 'text-[var(--ui-text-on-status-strong-neutral)]';
    const onSurface = 'text-[var(--ui-text-on-surface-primary)]';
    expect(blocks[0]).toHaveClass(onStrong); // a3 — dark
    expect(blocks[1]).toHaveClass(onSurface); // a2 — pale
    expect(blocks[2]).toHaveClass(onSurface); // a1 — pale
    expect(blocks[3]).toHaveClass(onSurface); // b1 — pale
    expect(blocks[4]).toHaveClass(onSurface); // b2 — pale
    expect(blocks[5]).toHaveClass(onStrong); // b3 — dark
  });

  it('preserves light text for categorical palette (all stops saturated)', () => {
    const { container } = renderChart({ palette: { type: 'categorical' } });
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>('foreignObject > div')
    );
    blocks.forEach((block) => {
      expect(block).toHaveClass(
        'text-[var(--ui-text-on-status-strong-neutral)]'
      );
    });
  });

  it('renders dark text on sequential stops 1–2 (pale) and white on stop 3+', () => {
    const { container } = renderChart({
      palette: { type: 'sequential', ramp: 'blue' },
      data: [
        { name: 'first', size: 2400 }, // stop 1 → pale → dark text
        { name: 'second', size: 1600 }, // stop 2 → pale → dark text
        { name: 'third', size: 1200 }, // stop 3 → darker → white text
      ],
      config: {
        first: { label: 'First' },
        second: { label: 'Second' },
        third: { label: 'Third' },
      },
    });
    const blocks = Array.from(
      container.querySelectorAll<HTMLElement>('foreignObject > div')
    );
    expect(blocks[0]).toHaveClass('text-[var(--ui-text-on-surface-primary)]');
    expect(blocks[1]).toHaveClass('text-[var(--ui-text-on-surface-primary)]');
    expect(blocks[2]).toHaveClass(
      'text-[var(--ui-text-on-status-strong-neutral)]'
    );
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

  // The two guards combined: a field that is present (so the raw-value check
  // passes) but that the caller's formatter blanks. Checking only the raw value
  // would put the dangling separator straight back.
  it('skips a field the formatter blanks, not just an empty raw value', () => {
    expect(
      treemapSecondaryLabel({
        row: { size: 0, count: 24 },
        keys: ['size', 'count'],
        separator: ' · ',
        formatter: (value, index) =>
          index === 0 && value === 0 ? '' : String(value),
      })
    ).toBe('24');
  });

  it('has no line when the formatter blanks every field', () => {
    expect(
      treemapSecondaryLabel({
        row,
        keys: ['size', 'count'],
        separator: ' · ',
        formatter: () => '',
      })
    ).toBeUndefined();
  });

  it('has no line when no field carries a value', () => {
    expect(
      treemapSecondaryLabel({ row, keys: ['missing'], separator: ' · ' })
    ).toBeUndefined();
  });
});

// The motion itself is a visual-regression concern; what matters here is that
// `animate` resolves to the reduced-motion-aware value rather than a literal
// `true`, and that turning the whole prop set on still paints every tile.
describe('Treemap animation', () => {
  it('is not animated unless asked', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
    const { container } = renderChart();
    expect(tiles(container)).toHaveLength(4);
  });

  it('resolves animate to "auto" so prefers-reduced-motion is honored', () => {
    expect(resolveAnimation({ animate: true, animationDuration: 800 })).toEqual(
      { isAnimationActive: 'auto', animationDuration: 800 }
    );
  });

  it('still paints every labelled tile with the full animation prop set', async () => {
    const { container } = renderChart({
      animate: true,
      animationDuration: 400,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
    await waitFor(() => expect(tiles(container)).toHaveLength(4));
    expect(cellText(container)).toEqual(['React', 'Vue', 'Svelte', 'Angular']);
  });
});
