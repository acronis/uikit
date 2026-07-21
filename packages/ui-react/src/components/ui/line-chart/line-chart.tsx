'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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
// axes are the design's Line-chart variant set: `curve` (how the segments
// interpolate between points — straight, smoothed, or stepped) and `lineStyle`
// (a solid or dashed stroke). "single" vs "multi" line is not a variant — it
// falls out of how many `dataKeys` the caller plots. The classes stay empty
// because recharts' SVG — not CSS — draws the lines: `curve` drives each
// `<Line type>` and `lineStyle` drives its `strokeDasharray`. CVA is kept so the
// variant set is a first-class, spec-conformant part of the API (matched against
// ui-spec's api.yaml enums) and exposed via `VariantProps`; the resolved values
// are also mirrored onto `data-curve` / `data-line-style` for styling hooks and
// tests.
const lineChartVariants = cva('', {
  variants: {
    curve: {
      linear: '',
      monotone: '',
      step: '',
    },
    lineStyle: {
      solid: '',
      dashed: '',
    },
  },
  defaultVariants: {
    curve: 'monotone',
    lineStyle: 'solid',
  },
});

export interface LineChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof lineChartVariants> {
  /** Row-per-point data. Each object holds the category key + one numeric field per series (`null` breaks the line unless `connectNulls`). */
  data: ReadonlyArray<Record<string, string | number | null>>;
  /**
   * Per-series map of `label` / `color` (imported from the shared `Chart`
   * primitives). Series colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Series to plot — one `<Line>` per key. Each must exist in `config` and in every data row. */
  dataKeys: string[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /** Stroke width of each line. */
  strokeWidth?: number;
  /** Render a dot at each data point. */
  showDots?: boolean;
  /** Bridge `null` gaps in the data instead of breaking the line. */
  connectNulls?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      className,
      config,
      data,
      dataKeys,
      xKey,
      curve = 'monotone',
      lineStyle = 'solid',
      strokeWidth = 2,
      showDots = true,
      connectNulls = false,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      ...props
    },
    ref
  ) => {
    const dashArray = lineStyle === 'dashed' ? '5 5' : undefined;

    return (
      <div
        ref={ref}
        data-curve={curve}
        data-line-style={lineStyle}
        className={cn(lineChartVariants({ curve, lineStyle }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RechartsLineChart data={data as readonly unknown[]}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis type="number" tickLine={false} axisLine={false} />
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key) => (
              <Line
                key={key}
                type={curve ?? 'monotone'}
                dataKey={key}
                stroke={`var(--color-${key})`}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                dot={showDots ? { r: 3 } : false}
                activeDot={showDots ? { r: 5 } : false}
                connectNulls={connectNulls}
                isAnimationActive={false}
              />
            ))}
          </RechartsLineChart>
        </ChartContainer>
      </div>
    );
  }
);
LineChart.displayName = 'LineChart';

export { LineChart, lineChartVariants };
