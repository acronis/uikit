import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SankeyChart, makeSankeyTooltip } from '../sankey-chart';
import { type ChartConfig } from '../../chart';

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

  // happy-dom can't lay out recharts, so the node/link SVG isn't measurable here
  // (the visuals are covered by the VR stories) — assert the toggles render
  // cleanly instead.
  it('renders with labels and tooltip toggled off', () => {
    const { container } = renderChart({ showLabels: false, showTooltip: false });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  // The legend is plain DOM (not recharts SVG), so happy-dom renders it — assert
  // a node's config label shows when showLegend is on, and not when it's off.
  it('renders a node legend with value + % from config when showLegend is on', () => {
    const off = renderChart();
    expect(off.container.textContent).not.toContain('All tenants');
    const on = renderChart({ showLegend: true });
    expect(on.container.textContent).toContain('All tenants');
    expect(on.container.textContent).toContain('Expired');
    // "all" is the largest node (outgoing 209 + 31 = 240) → its value + 100% share.
    expect(on.container.textContent).toContain('240');
    expect(on.container.textContent).toContain('100%');
  });

  it('accepts a per-link color override without throwing', () => {
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
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders with sort enabled', () => {
    const { container } = renderChart({ sort: true });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('renders a single-link graph without throwing', () => {
    const { container } = renderChart({
      data: {
        nodes: [{ name: 'all' }, { name: 'certified' }],
        links: [{ source: 0, target: 1, value: 209 }],
      },
    });
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
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
    expect(container.textContent).toContain('1,000 – 2,000');
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
