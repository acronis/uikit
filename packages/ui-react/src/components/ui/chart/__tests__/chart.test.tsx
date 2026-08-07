import { BarChart } from 'recharts';
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
  type ChartConfig,
} from '../index';

const config = {
  desktop: { label: 'Desktop', color: 'rgb(23 99 207)' },
  mobile: { label: 'Mobile', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

beforeAll(() => {
  // happy-dom's ResizeObserver never reports a size, so recharts'
  // ResponsiveContainer renders nothing and its children never mount.
  class SizedResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element) {
      this.callback(
        [
          {
            target,
            contentRect: { width: 400, height: 300 },
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

// The fields recharts always puts on a tooltip row; the content reads
// `payload.fill` for the marker color.
const ROW = { graphicalItemId: 'item-1', payload: {} };

describe('Chart', () => {
  it('renders the chart wrapper with a stable data-chart id', () => {
    const { container } = render(
      <ChartContainer config={config} id="usage">
        <BarChart data={[]} />
      </ChartContainer>
    );
    const wrapper = container.querySelector('[data-slot="chart"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('data-chart', 'chart-usage');
    // The `id` prop is forwarded to the wrapper (for aria-labelledby / anchors).
    expect(wrapper).toHaveAttribute('id', 'usage');
  });

  // recharts hardcodes a white outline on sectors, dots and funnel trapezoids,
  // which no theme reaches — in dark mode it reads as a light hairline around
  // every segment. The container neutralizes all three; happy-dom applies no
  // Tailwind, so the guard is the rule's presence.
  it("neutralizes recharts' hardcoded white outlines", () => {
    const { container } = render(
      <ChartContainer config={config} id="usage">
        <BarChart data={[]} />
      </ChartContainer>
    );
    const wrapper = container.querySelector('[data-slot="chart"]');
    ['sector', 'dot', 'trapezoid'].forEach((part) => {
      expect(wrapper?.className).toContain(
        `[&_.recharts-${part}[stroke='#fff']]:stroke-transparent`
      );
    });
  });

  it('injects per-series --color-* custom properties from the config', () => {
    const { container } = render(
      <ChartContainer config={config} id="usage">
        <BarChart data={[]} />
      </ChartContainer>
    );
    const style = container.querySelector('style');
    expect(style?.innerHTML).toContain('--color-desktop: rgb(23 99 207)');
    expect(style?.innerHTML).toContain('--color-mobile: rgb(220 53 69)');
  });

  it('scopes a per-series theme color under [data-theme="dark"]', () => {
    const themed = {
      desktop: { label: 'Desktop', theme: { light: '#aaa', dark: '#222' } },
    } satisfies ChartConfig;
    const { container } = render(
      <ChartContainer config={themed} id="usage">
        <BarChart data={[]} />
      </ChartContainer>
    );
    const css = container.querySelector('style')?.innerHTML ?? '';
    expect(css).toContain("[data-theme='dark'] [data-chart=chart-usage]");
    expect(css).toContain('--color-desktop: #222');
  });

  it('renders no <style> when the config carries no colors', () => {
    const { container } = render(
      <ChartContainer config={{ desktop: { label: 'Desktop' } }}>
        <BarChart data={[]} />
      </ChartContainer>
    );
    expect(container.querySelector('style')).not.toBeInTheDocument();
  });

  it('renders a start-aligned legend with 10px rounded-sm swatches', () => {
    const { container } = render(
      <ChartContainer config={config} id="usage">
        <ChartLegendContent
          payload={[
            { value: 'Desktop', dataKey: 'desktop', color: 'rgb(23 99 207)' },
            { value: 'Mobile', dataKey: 'mobile', color: 'rgb(220 53 69)' },
          ]}
        />
      </ChartContainer>
    );
    const swatches = container.querySelectorAll('.rounded-sm');
    expect(swatches).toHaveLength(2);
    swatches.forEach((swatch) => {
      expect(swatch).toHaveClass('h-2.5', 'w-2.5');
    });
    expect(container.querySelector('.rounded-full')).not.toBeInTheDocument();
    expect(swatches[0]?.parentElement?.parentElement).toHaveClass(
      'justify-start'
    );
  });

  // A chart type whose renderer can't lay a legend out inside the plot (Treemap)
  // renders the shared legend beside it, outside the container — so the config has
  // to be passable as a prop rather than only through the container's context.
  it('renders outside a ChartContainer when handed the config', () => {
    const { container } = render(
      <ChartLegendContent
        config={config}
        payload={[
          { value: 'Desktop', dataKey: 'desktop', color: 'rgb(23 99 207)' },
        ]}
      />
    );
    expect(container).toHaveTextContent('Desktop');
    expect(container.querySelector('.rounded-sm')).toBeInTheDocument();
  });

  // Passing a `config` is the *only* sanctioned way to render outside the
  // container. Everything else is a misuse, and stays as loud as it is for the
  // tooltip — a legend with no config cannot label itself, so an empty row would
  // just hide the mistake.
  it('throws outside a ChartContainer when given no config either', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <ChartLegendContent
          payload={[
            { value: 'Desktop', dataKey: 'desktop', color: 'rgb(23 99 207)' },
          ]}
        />
      )
    ).toThrow(/must be used within a <ChartContainer \/> or given a `config`/);
    spy.mockRestore();
  });

  // `label` is optional on a ChartConfig entry and the payload lookup can miss, so
  // the entry falls back to the series key rather than rendering a bare marker.
  it('falls back to the series key when the config entry has no label', () => {
    const { container } = render(
      <ChartContainer config={{ desktop: { color: 'rgb(23 99 207)' } }} id="nl">
        <ChartLegendContent
          payload={[
            { value: 'desktop', dataKey: 'desktop', color: 'rgb(23 99 207)' },
          ]}
        />
      </ChartContainer>
    );
    expect(container).toHaveTextContent('desktop');
  });

  it('renders a line marker for stroke series and dashes it from strokeDasharray', () => {
    const { container } = render(
      <ChartContainer config={config} id="usage">
        <ChartLegendContent
          payload={[
            {
              value: 'Desktop',
              dataKey: 'desktop',
              color: 'var(--color-desktop)',
              type: 'line',
            },
            {
              value: 'Mobile',
              dataKey: 'mobile',
              color: 'var(--color-mobile)',
              type: 'line',
              payload: { strokeDasharray: '5 5' },
            },
          ]}
        />
      </ChartContainer>
    );
    const markers =
      container.querySelectorAll<HTMLElement>('.rounded-full.w-4');
    expect(markers).toHaveLength(2);
    expect(markers[0]?.style.backgroundColor).toBe('var(--color-desktop)');
    expect(markers[0]?.style.backgroundImage).toBe('');
    expect(markers[1]?.style.backgroundColor).toBe('');
    expect(markers[1]?.style.backgroundImage).toBe(
      'repeating-linear-gradient(90deg, var(--color-mobile) 0 4px, transparent 4px 7px)'
    );
    // A stroke series never falls back to the square swatch.
    expect(container.querySelector('.rounded-sm')).not.toBeInTheDocument();
  });

  it('dots every tooltip row, whatever marker the legend gives the series', () => {
    const { container } = render(
      <ChartContainer config={config} id="usage">
        <ChartTooltipContent
          active
          payload={[
            { ...ROW, dataKey: 'desktop', name: 'desktop', value: 12 },
            { ...ROW, dataKey: 'mobile', name: 'mobile', value: 8 },
          ]}
        />
      </ChartContainer>
    );
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(2);
    dots.forEach((dot) => expect(dot).toHaveClass('h-2.5', 'w-2.5'));
    // The legend's square swatch never leaks into the tooltip.
    expect(container.querySelector('.rounded-sm')).not.toBeInTheDocument();
  });

  it('throws when a content part is used outside a ChartContainer', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // useChart() runs before the payload is read, so this throws with no payload.
    expect(() => render(<ChartTooltipContent active />)).toThrow(
      /useChart must be used within a <ChartContainer \/>/
    );
    spy.mockRestore();
  });
});
