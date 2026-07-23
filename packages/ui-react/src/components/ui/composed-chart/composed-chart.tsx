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
  type ChartConfig,
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
  extends Omit<React.ComponentProps<'div'>, 'children'> {
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
  /** Title rendered beneath the horizontal (X) axis. */
  xAxisLabel?: string;
  /** Title rendered beside the vertical (Y) axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to Y-axis tick values (recharts `unit`; the X axis is categorical). */
  yUnit?: string;
  /** Interpolation for the line and area series. */
  curve?: 'linear' | 'monotone' | 'step';
  /** Corner radius on the growing end of bar series. */
  barRadius?: number;
  /** Flat-fill opacity for area series. */
  fillOpacity?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` /
   * `indicator` — to customize formatting, per-series rows, or extra fields
   * without composing recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
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
      tooltipContent,
      ...props
    },
    ref
  ) => {
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

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsComposedChart data={data as readonly unknown[]}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={xAxisLabel ? 48 : undefined}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              unit={yUnit}
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
                    isAnimationActive={false}
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
                    isAnimationActive={false}
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
                  isAnimationActive={false}
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
