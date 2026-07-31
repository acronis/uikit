import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Treemap, TreemapCell } from '../treemap';
import { ChartTooltipContent, type ChartConfig,
  resolveAnimation,
} from '../../chart';

const data = [
  { name: 'React', size: 2400 },
  { name: 'Vue', size: 1200 },
  { name: 'Svelte', size: 800 },
  { name: 'Angular', size: 1600 },
];

const config = {
  React: { label: 'React', color: 'rgb(23 99 207)' },
  Vue: { label: 'Vue', color: 'rgb(34 139 79)' },
  Svelte: { label: 'Svelte', color: 'rgb(212 149 42)' },
  Angular: { label: 'Angular', color: 'rgb(220 53 69)' },
} satisfies ChartConfig;

function renderChart(props: Partial<React.ComponentProps<typeof Treemap>> = {}) {
  return render(
    <Treemap config={config} data={data} dataKey="size" nameKey="name" {...props} />
  );
}

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

  // recharts only paints its SVG once the ResponsiveContainer has real
  // dimensions, which happy-dom never gives it — so the cells/labels/tooltip
  // can't be asserted here. This exercises the aspectRatio + labels/tooltip
  // toggle prop paths against a plumbing/crash regression; the visual output is
  // covered by the VR stories.
  it('renders with a custom aspectRatio and labels/tooltip toggled off', () => {
    const { container } = renderChart({
      aspectRatio: 1,
      showLabels: false,
      showTooltip: false,
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
    const { container } = renderChart({ className: 'h-[300px] w-[480px]' });
    expect(container.firstElementChild).toHaveClass('h-[300px]', 'w-[480px]');
  });

  // recharts never hands the `content` cell renderer real geometry under
  // happy-dom, so the size-threshold branch (a named leaf whose rect is too
  // small to label) is exercised here by rendering the cell directly with
  // explicit geometry — the size path the chart-level tests above can't reach.
  describe('TreemapCell', () => {
    it('labels a named leaf whose rect clears the 64x28 threshold', () => {
      const { container } = render(
        <svg>
          <TreemapCell name="React" width={90} height={60} />
        </svg>
      );
      expect(container.querySelector('rect')?.style.fill).toBe(
        'var(--color-React)'
      );
      expect(container.querySelector('text')).toHaveTextContent('React');
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
      expect(container.querySelector('text')).not.toBeInTheDocument();
    });

    it('suppresses the label when showLabels is off even on a large rect', () => {
      const { container } = render(
        <svg>
          <TreemapCell name="React" width={90} height={60} showLabels={false} />
        </svg>
      );
      expect(container.querySelector('text')).not.toBeInTheDocument();
    });

    it('renders nothing paintable for the name-less synthetic root node', () => {
      const { container } = render(
        <svg>
          <TreemapCell width={500} height={320} />
        </svg>
      );
      expect(container.querySelector('rect')).not.toBeInTheDocument();
      expect(container.querySelector('text')).not.toBeInTheDocument();
    });
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
describe('Treemap animation and data labels', () => {
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
});
