'use client';

import * as React from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
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
  resolveAxisDomain,
  resolveAnimation,
  type ChartConfig,
  type CartesianChartProps,
  type ChartAnimationProps,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. A composed
// chart's defining trait is that each series picks its own render type
// (bar / line / area) over one shared category axis — so, like ScatterChart,
// there's no single visual "mode" to model as a CVA variant (the skill's
// "per-series type"). The variation lives in the `series[].type` list instead.
export type ComposedSeriesType = 'bar' | 'line' | 'area';

export interface ComposedSeries {
  /** Column key to plot — must match a `config` entry; drives its `--color-<key>` paint. */
  key: string;
  /** How this series renders. */
  type: ComposedSeriesType;
}

export interface ComposedChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    CartesianChartProps,
    ChartAnimationProps {
  /** Row-per-category data. Each object holds `xKey` + one numeric field per series. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-series map of `label` / `color`, keyed by `series[].key` (imported from
   * the shared `Chart` primitives). Turned into `--color-<key>` custom
   * properties. Colors are caller-supplied — reference an existing semantic
   * `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Series to plot, each `{ key, type }` — one bar/line/area per entry. Each key must exist in `config` and every data row. */
  series: ComposedSeries[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /** Interpolation for the line and area series. */
  curve?: 'linear' | 'monotone' | 'step';
  /** Corner radius on the growing end of bar series. */
  barRadius?: number;
  /** Flat-fill opacity for area series. */
  fillOpacity?: number;
  showLegend?: boolean;
}

const ComposedChart = React.forwardRef<HTMLDivElement, ComposedChartProps>(
  (
    {
      className,
      config,
      data,
      series,
      xKey,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      curve = 'monotone',
      barRadius = 4,
      fillOpacity = 0.3,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      xTickFormatter,
      yTickFormatter,
      xAxisAngle,
      xAxisInterval,
      yAxisTickCount,
      yAxisDomain,
      gridDashed,
      gridHorizontal,
      gridVertical,
      tooltipContent,
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
      ...props
    },
    ref
  ) => {
    const animation = resolveAnimation({
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
    });
    // Axis titles: the X title sits below the ticks; the Y title is rotated in
    // the left gutter. Passed to recharts' native `label` (themed via the
    // `.recharts-label` fill selector on the container).
    const xAxisTitle = xAxisLabel
      ? { value: xAxisLabel, position: 'insideBottom' as const, offset: 0 }
      : undefined;
    const yAxisTitle = yAxisLabel
      ? {
          value: yAxisLabel,
          angle: -90,
          position: 'insideLeft' as const,
          style: { textAnchor: 'middle' as const },
        }
      : undefined;

    const yDomain = resolveAxisDomain(yAxisDomain);

    // Room for the X tick row: recharts' default 30, plus a rotated tick row
    // (+20) and/or the axis title (+18). Additive — both can be present at once,
    // which the old label-or-angle ternary under-allocated.
    const xAxisHeight =
      xAxisLabel || xAxisAngle != null
        ? 30 + (xAxisAngle != null ? 20 : 0) + (xAxisLabel ? 18 : 0)
        : undefined;

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsComposedChart data={data as readonly unknown[]}>
            {showGrid && (
              <CartesianGrid
                horizontal={gridHorizontal ?? true}
                vertical={gridVertical ?? false}
                strokeDasharray={gridDashed ? '3 3' : undefined}
              />
            )}
            <XAxis
              dataKey={xKey}
              type="category"
              hide={!showXAxis}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xTickFormatter}
              angle={xAxisAngle}
              interval={xAxisInterval}
              textAnchor={
                xAxisAngle != null ? (xAxisAngle < 0 ? 'end' : 'start') : undefined
              }
              height={xAxisHeight}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              hide={!showYAxis}
              tickLine={false}
              axisLine={false}
              unit={yUnit}
              tickFormatter={yTickFormatter}
              tickCount={yAxisTickCount}
              domain={yDomain}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {/* Rendered in the caller's `series` order — recharts paints children
                back-to-front, so later entries sit on top. Order them so thin
                marks (a line) come after the areas/bars they should overlay. */}
            {series.map((s) => {
              const color = `var(--color-${s.key})`;
              if (s.type === 'bar') {
                return (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    fill={color}
                    radius={
                      barRadius > 0
                        ? [barRadius, barRadius, 0, 0]
                        : undefined
                    }
                    {...animation}
                  />
                );
              }
              if (s.type === 'area') {
                return (
                  <Area
                    key={s.key}
                    type={curve}
                    dataKey={s.key}
                    stroke={color}
                    fill={color}
                    fillOpacity={fillOpacity}
                    {...animation}
                  />
                );
              }
              return (
                <Line
                  key={s.key}
                  type={curve}
                  dataKey={s.key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  {...animation}
                />
              );
            })}
          </RechartsComposedChart>
        </ChartContainer>
      </div>
    );
  }
);
ComposedChart.displayName = 'ComposedChart';

export { ComposedChart };
