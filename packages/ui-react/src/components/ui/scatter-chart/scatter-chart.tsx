'use client';

import * as React from 'react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  resolveAxisDomain,
  resolveRotatedTickAnchor,
  resolveXAxisHeight,
  resolveXAxisTitle,
  resolveYAxisTitle,
  type ChartConfig,
  type ChartPalette,
  type CartesianChartProps,
  type ChartAnimationProps,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. Unlike the
// other chart types, a scatter has no visual "mode" to model as a CVA variant —
// its shape is fixed (x/y points, optionally sized by z) and its expressiveness
// comes from the data mapping. So there is no `cva` axis here (matches the
// skill's "usually none"); marker `shape` and bubble sizing are plain props.
// Each series carries its own point array (points aren't columns of a shared
// row the way bar/line/area series are), so the API takes a `series` list rather
// than `dataKeys` over one `data` array.
export type ScatterMarkerShape =
  | 'circle'
  | 'cross'
  | 'diamond'
  | 'square'
  | 'star'
  | 'triangle'
  | 'wye';

export interface ScatterSeries {
  /** Series key — must match a `config` entry; drives its `--color-<key>` fill and legend label. */
  key: string;
  /** This series' points — each row holds at least `xKey` and `yKey` (and `zKey` when used). */
  data: ReadonlyArray<Record<string, number>>;
}

export interface ScatterChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    CartesianChartProps,
    ChartAnimationProps {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** One `<Scatter>` per entry — each with its own point array. Use a single entry for an ungrouped scatter. */
  series: ScatterSeries[];
  /**
   * Per-series map of `label` / `color`, keyed by `series[].key` (imported from
   * the shared `Chart` primitives). Turned into `--color-<key>` custom
   * properties. Colors are caller-supplied — reference an existing semantic
   * `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Numeric field for the horizontal axis. */
  xKey: string;
  /** Numeric field for the vertical axis. */
  yKey: string;
  /** Unit suffix appended to X-axis tick values (recharts `unit`). */
  xUnit?: string;
  /** Optional numeric field mapped to point size (a bubble chart), via recharts `ZAxis`. */
  zKey?: string;
  /** Point-size range `[min, max]` the `zKey` maps into. Ignored when `zKey` is unset (points use recharts' default size). */
  zRange?: [number, number];
  /** Marker shape for every point. */
  shape?: ScatterMarkerShape;
  showLegend?: boolean;
}

const ScatterChart = React.forwardRef<HTMLDivElement, ScatterChartProps>(
  (
    {
      className,
      config,
      palette,
      series,
      xKey,
      yKey,
      zKey,
      zRange = [60, 400],
      shape = 'circle',
      xAxisLabel,
      yAxisLabel,
      xUnit,
      yUnit,
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
    const xAxisTitle = resolveXAxisTitle(
      xAxisLabel,
      'insideBottom',
      -8
    );
    const yAxisTitle = resolveYAxisTitle(yAxisLabel);

    const yDomain = resolveAxisDomain(yAxisDomain);

    const xAxisHeight = resolveXAxisHeight(xAxisLabel, xAxisAngle);

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer
          config={config}
          palette={palette}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsScatterChart
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
          >
            {showGrid && (
              <CartesianGrid
                horizontal={gridHorizontal ?? true}
                vertical={gridVertical ?? true}
                strokeDasharray={gridDashed ? '3 3' : undefined}
              />
            )}
            <XAxis
              type="number"
              dataKey={xKey}
              name={xKey}
              unit={xUnit}
              hide={!showXAxis}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xTickFormatter}
              angle={xAxisAngle}
              interval={xAxisInterval}
              textAnchor={resolveRotatedTickAnchor(xAxisAngle)}
              height={xAxisHeight}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yKey}
              unit={yUnit}
              hide={!showYAxis}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={yTickFormatter}
              tickCount={yAxisTickCount}
              domain={yDomain}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {zKey && (
              <ZAxis type="number" dataKey={zKey} range={zRange} name={zKey} />
            )}
            {showTooltip && (
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={tooltipContent ?? <ChartTooltipContent />}
              />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {series.map((s) => (
              <Scatter
                key={s.key}
                name={s.key}
                data={s.data as Record<string, number>[]}
                fill={`var(--color-${s.key})`}
                shape={shape}
                {...animation}
              />
            ))}
          </RechartsScatterChart>
        </ChartContainer>
      </div>
    );
  }
);
ScatterChart.displayName = 'ScatterChart';

export { ScatterChart };
