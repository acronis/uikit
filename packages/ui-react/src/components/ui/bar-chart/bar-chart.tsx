'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. The two CVA
// axes are the design's Bar-chart variant set (B2): `orientation` (which way the
// bars grow) and `layout` (grouped side-by-side vs stacked). The classes stay
// empty because the recharts SVG — not CSS — draws the bars: the same two props
// drive recharts' `layout` prop, the axis roles, the `stackId`, and the corner
// radius below. CVA is kept so the variant set is a first-class, spec-conformant
// part of the API (matched against ui-spec's api.yaml enums) and exposed via
// `VariantProps`; the resolved values are also mirrored onto `data-orientation`
// / `data-layout` for styling hooks and tests.
const barChartVariants = cva('', {
  variants: {
    orientation: {
      vertical: '',
      horizontal: '',
    },
    layout: {
      grouped: '',
      stacked: '',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    layout: 'grouped',
  },
});

export interface BarChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof barChartVariants> {
  /** Row-per-category data. Each object holds the category key + one numeric field per series. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-series map of `label` / `color` (imported from the shared `Chart`
   * primitives). Series colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Series to plot — one `<Bar>` per key. Each must exist in `config` and in every data row. */
  dataKeys: string[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /** Corner radius applied to the growing end of each bar. */
  barRadius?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      config,
      data,
      dataKeys,
      xKey,
      orientation = 'vertical',
      layout = 'grouped',
      barRadius = 4,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      ...props
    },
    ref
  ) => {
    // Our `orientation` is bar-direction; recharts' `layout` is the opposite axis.
    const rechartsLayout = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    const isStacked = layout === 'stacked';

    // Round only the growing end: top for vertical bars, right for horizontal.
    const endRadius: [number, number, number, number] =
      orientation === 'horizontal'
        ? [0, barRadius, barRadius, 0]
        : [barRadius, barRadius, 0, 0];

    return (
      <div
        ref={ref}
        data-orientation={orientation}
        data-layout={layout}
        className={cn(barChartVariants({ orientation, layout }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RechartsBarChart data={data as readonly unknown[]} layout={rechartsLayout}>
            {showGrid && (
              <CartesianGrid
                horizontal={orientation === 'vertical'}
                vertical={orientation === 'horizontal'}
              />
            )}
            {orientation === 'horizontal' ? (
              <>
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey={xKey}
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  type="category"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis type="number" tickLine={false} axisLine={false} />
              </>
            )}
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key, index) => {
              // In a stack only the last segment's end is rounded; grouped bars
              // each round their own end.
              const rounded = isStacked ? index === dataKeys.length - 1 : true;
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  stackId={isStacked ? 'a' : undefined}
                  radius={barRadius > 0 && rounded ? endRadius : undefined}
                  isAnimationActive={false}
                />
              );
            })}
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
BarChart.displayName = 'BarChart';

export { BarChart, barChartVariants };
