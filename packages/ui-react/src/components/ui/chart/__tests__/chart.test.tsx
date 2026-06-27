import { BarChart } from 'recharts';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '../index';

const config = {
  desktop: { label: 'Desktop', color: 'rgb(23 99 207)' },
  mobile: { label: 'Mobile', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

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

  it('throws when a content part is used outside a ChartContainer', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // useChart() runs before the payload is read, so this throws with no payload.
    expect(() => render(<ChartTooltipContent active />)).toThrow(
      /useChart must be used within a <ChartContainer \/>/
    );
    spy.mockRestore();
  });
});
