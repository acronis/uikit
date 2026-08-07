import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SankeyChart, makeSankeyTooltip } from '../sankey-chart';
import { type ChartConfig } from '../../chart';
import { giveEveryChartASize } from '../../chart/__tests__/chart-layout';

// The node bars, ribbons and their labels are painted SVG, which recharts skips
// entirely at 0×0.
giveEveryChartASize();

const data = {
  nodes: [
    { name: 'all' },
    { name: 'certified' },
    { name: 'noCert' },
    { name: 'valid' },
    { name: 'expired' },
  ],
  links: [
    { source: 0, target: 1, value: 209 },
    { source: 0, target: 2, value: 31 },
    { source: 1, target: 3, value: 195 },
    { source: 1, target: 4, value: 14 },
  ],
};

const config = {
  all: { label: 'All tenants', color: 'rgb(23 99 207)' },
  certified: { label: 'Certified', color: 'rgb(40 167 69)' },
  noCert: { label: 'No certification', color: 'rgb(108 117 125)' },
  valid: { label: 'Valid', color: 'rgb(52 199 89)' },
  expired: { label: 'Expired', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(
  props: Partial<React.ComponentProps<typeof SankeyChart>> = {}
) {
  return render(<SankeyChart config={config} data={data} {...props} />);
}

/** Node bars, in `data.nodes` order. */
const nodeBarsOf = (container: Element) => [
  ...container.querySelectorAll<SVGPathElement>('path.recharts-rectangle'),
];

/** Link ribbons, in `data.links` order — strokes, so they carry no fill. */
const ribbonsOf = (container: Element) =>
  [...container.querySelectorAll<SVGPathElement>('svg path')].filter(
    (path) => path.getAttribute('fill') === 'none'
  );

/** Top edge of each node bar, in `data.nodes` order — the bar's `d` starts there. */
const nodeTopsOf = (container: Element) =>
  nodeBarsOf(container).map((bar) =>
    Number(bar.getAttribute('d')!.match(/^M \S+,(\S+)/)![1])
  );

const nodeLabelsOf = (container: Element) => [
  ...container.querySelectorAll<SVGTextElement>('svg text'),
];

const legendOf = (container: Element) =>
  container.querySelector('[data-slot="sankey-chart-legend"]');

describe('SankeyChart', () => {
  it('renders the shared chart wrapper', () => {
    const { container } = renderChart();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('wires each node color from config into a --color-* custom property', () => {
    const { container } = renderChart();
    const style = container.querySelector('style')?.innerHTML ?? '';
    expect(style).toContain('--color-all: rgb(23 99 207)');
    expect(style).toContain('--color-expired: rgb(220 53 69)');
  });

  it('draws one bar per node, filled from that node\'s config color', () => {
    const { container } = renderChart();
    expect(nodeBarsOf(container).map((bar) => bar.getAttribute('fill'))).toEqual(
      [
        'var(--color-all)',
        'var(--color-certified)',
        'var(--color-noCert)',
        'var(--color-valid)',
        'var(--color-expired)',
      ]
    );
  });

  // A flow reads as "where it goes", so a ribbon takes its *target*'s color,
  // dimmed so the ribbons don't overwhelm the node bars they connect.
  it('tints each ribbon with its target node color at 35%', () => {
    const { container } = renderChart();
    expect(
      ribbonsOf(container).map((link) => [
        link.getAttribute('stroke'),
        link.getAttribute('stroke-opacity'),
      ])
    ).toEqual([
      ['var(--color-certified)', '0.35'],
      ['var(--color-noCert)', '0.35'],
      ['var(--color-valid)', '0.35'],
      ['var(--color-expired)', '0.35'],
    ]);
  });

  // Link width is the only encoding of magnitude in a Sankey — equal widths for
  // a 209 and a 31 flow would make the diagram lie.
  it('scales ribbon width with the flow value', () => {
    const { container } = renderChart();
    const [toCertified, toNoCert] = ribbonsOf(container).map((link) =>
      Number(link.getAttribute('stroke-width'))
    );
    expect(toCertified).toBeGreaterThan(toNoCert);
  });

  // Labels sit outside the bar on whichever side keeps them in the plot: to the
  // right of a node that emits flows, to the left of a terminal one.
  it('labels each node from config, anchored away from the plot edge', () => {
    const { container } = renderChart({ showLabels: true });
    const labels = nodeLabelsOf(container);
    expect(labels.map((label) => label.textContent)).toEqual([
      'All tenants',
      'Certified',
      'No certification',
      'Valid',
      'Expired',
    ]);
    // `all` and `certified` have outgoing links; the other three are sinks.
    expect(labels.map((label) => label.getAttribute('text-anchor'))).toEqual([
      'start',
      'start',
      'end',
      'end',
      'end',
    ]);
  });

  it('drops the node labels when showLabels is off', () => {
    const { container } = renderChart({ showLabels: false, showTooltip: false });
    expect(nodeLabelsOf(container)).toHaveLength(0);
    expect(nodeBarsOf(container)).toHaveLength(5);
  });

  // Scoped to the legend element rather than the whole container: `showLabels`
  // defaults on, so every node's config label is already in the SVG and a
  // container-wide text assertion would pass with no legend at all.
  it('renders a node legend with value + % from config when showLegend is on', () => {
    const off = renderChart();
    expect(legendOf(off.container)).toBeNull();
    off.unmount();

    const legend = legendOf(renderChart({ showLegend: true }).container);
    expect(legend).toHaveTextContent('All tenants');
    expect(legend).toHaveTextContent('Expired');
    // "all" is the largest node (outgoing 209 + 31 = 240) → its value + 100% share.
    expect(legend).toHaveTextContent('240');
    expect(legend).toHaveTextContent('100%');
  });

  // An explicit color is the caller's exact choice, so it escapes the 35% tint
  // the default target-derived ribbon gets.
  it('renders a per-link color override at full opacity', () => {
    const { container } = renderChart({
      data: {
        nodes: [{ name: 'all' }, { name: 'certified' }],
        links: [
          {
            source: 0,
            target: 1,
            value: 209,
            color: 'var(--ui-background-brand-primary-disabled)',
          },
        ],
      },
    });
    const ribbon = ribbonsOf(container)[0];
    expect(ribbon).toHaveAttribute(
      'stroke',
      'var(--ui-background-brand-primary-disabled)'
    );
    expect(ribbon).toHaveAttribute('stroke-opacity', '1');
  });

  // `sort` only moves a node when the authored order disagrees with the one the
  // relaxation settles on — the fixture above already agrees, so an uncrossing
  // graph is what makes the prop observable at all: `all` feeds the *lower*
  // target and `certified` the upper one, so sorting swaps the source column.
  it('reorders a column whose authored order crosses the flows', () => {
    const crossing = {
      nodes: [
        { name: 'all' },
        { name: 'certified' },
        { name: 'noCert' },
        { name: 'valid' },
      ],
      links: [
        { source: 0, target: 3, value: 200 },
        { source: 1, target: 2, value: 200 },
      ],
    };

    const authored = renderChart({ data: crossing });
    const [authoredAll, authoredCertified] = nodeTopsOf(authored.container);
    expect(authoredAll).toBeLessThan(authoredCertified);
    authored.unmount();

    const sorted = renderChart({ data: crossing, sort: true });
    const [sortedAll, sortedCertified] = nodeTopsOf(sorted.container);
    expect(sortedAll).toBeGreaterThan(sortedCertified);
  });

  it('draws a single-link graph as two nodes and one ribbon', () => {
    const { container } = renderChart({
      data: {
        nodes: [{ name: 'all' }, { name: 'certified' }],
        links: [{ source: 0, target: 1, value: 209 }],
      },
    });
    expect(nodeBarsOf(container)).toHaveLength(2);
    expect(ribbonsOf(container)).toHaveLength(1);
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SankeyChart ref={ref} config={config} data={data} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderChart({ className: 'h-[300px] w-[500px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[500px]');
  });

  it('resolves node colors through the --color-* bridge for a per-theme config', () => {
    const themed = {
      all: { label: 'All tenants', theme: { light: '#aaa', dark: '#222' } },
      certified: { label: 'Certified', theme: { light: '#0a0', dark: '#3f3' } },
    } satisfies ChartConfig;
    const { container } = render(
      <SankeyChart
        showLegend
        config={themed}
        data={{
          nodes: [{ name: 'all' }, { name: 'certified' }],
          links: [{ source: 0, target: 1, value: 209 }],
        }}
      />
    );
    const css = container.querySelector('style')?.innerHTML ?? '';
    expect(css).toContain('--color-all: #aaa');
    expect(css).toContain('--color-certified: #3f3');
    // The legend swatch references the bridge, so it is colored even though the
    // config carries no flat `color`.
    const swatch = container.querySelector<HTMLElement>('.rounded-sm');
    expect(swatch?.style.backgroundColor).toBe('var(--color-all)');
  });
});

// The component's own tooltip: recharts can't lay out a Sankey in happy-dom and
// exposes no statically-open tooltip, so the renderer is exercised directly.
describe('SankeyChart default tooltip', () => {
  const Tooltip = makeSankeyTooltip(config, data.links, data.nodes);

  it('renders nothing while inactive or without a payload', () => {
    const { container: inactive } = render(
      <Tooltip active={false} payload={[{ name: 'all - certified', value: 209 }]} />
    );
    expect(inactive).toBeEmptyDOMElement();
    const { container: empty } = render(<Tooltip active payload={[]} />);
    expect(empty).toBeEmptyDOMElement();
  });

  it('maps a hovered link to "source → target" config labels and the value', () => {
    const { container } = render(
      <Tooltip active payload={[{ name: 'all - certified', value: 209 }]} />
    );
    expect(container.textContent).toContain('All tenants → Certified');
    expect(container.textContent).toContain('209');
  });

  it('tints a default link dot with the target color at 35%', () => {
    const { container } = render(
      <Tooltip active payload={[{ name: 'all - certified', value: 209 }]} />
    );
    const dot = container.querySelector<HTMLElement>('span');
    expect(dot?.style.backgroundColor).toBe('var(--color-certified)');
    expect(dot?.style.opacity).toBe('0.35');
  });

  it('renders an explicit link color at full opacity', () => {
    const Custom = makeSankeyTooltip(
      config,
      [{ source: 0, target: 1, value: 209, color: 'rgb(1 2 3)' }],
      data.nodes
    );
    const { container } = render(
      <Custom active payload={[{ name: 'all - certified', value: 209 }]} />
    );
    const dot = container.querySelector<HTMLElement>('span');
    expect(dot?.style.backgroundColor).toBe('rgb(1 2 3)');
    expect(dot?.style.opacity).toBe('1');
  });

  it('labels a hovered node (a single key) with its own config label', () => {
    const { container } = render(
      <Tooltip active payload={[{ name: 'noCert', value: 31 }]} />
    );
    expect(container.textContent).toContain('No certification');
    expect(container.textContent).not.toContain('→');
    const dot = container.querySelector<HTMLElement>('span');
    expect(dot?.style.backgroundColor).toBe('var(--color-noCert)');
    expect(dot?.style.opacity).toBe('1');
  });

  it('falls back to the raw key when config has no entry for it', () => {
    const { container } = render(
      <Tooltip active payload={[{ name: 'unmapped', value: 5 }]} />
    );
    expect(container.textContent).toContain('unmapped');
  });

  it('renders a ReactNode config label instead of stringifying it', () => {
    const Rich = makeSankeyTooltip(
      { all: { label: <em>All tenants</em>, color: 'rgb(0 0 0)' } },
      [],
      []
    );
    const { container } = render(<Rich active payload={[{ name: 'all' }]} />);
    expect(container.querySelector('em')?.textContent).toBe('All tenants');
    expect(container.textContent).not.toContain('[object Object]');
  });

  it('formats a range-tuple value instead of printing a comma-joined array', () => {
    const { container } = render(
      <Tooltip active payload={[{ name: 'all - certified', value: [1000, 2000] }]} />
    );
    // the tooltip localises each part, so derive the expectation from the same
    // locale the test process runs under instead of hardcoding en-US grouping
    const expected = `${(1000).toLocaleString()} – ${(2000).toLocaleString()}`;
    expect(container.textContent).toContain(expected);
    expect(container.textContent).not.toContain('1000,2000');
  });

  it('omits the value row when the payload carries none', () => {
    const { container } = render(
      <Tooltip active payload={[{ name: 'all - certified' }]} />
    );
    expect(container.textContent).toContain('All tenants → Certified');
    expect(container.querySelector('.tabular-nums')).toBeNull();
  });
});
