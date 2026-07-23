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
  type ChartConfig,
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
  extends Omit<React.ComponentProps<'div'>, 'children'> {
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
  /** Title rendered beneath the horizontal (X) axis. */
  xAxisLabel?: string;
  /** Title rendered beside the vertical (Y) axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to X-axis tick values (recharts `unit`). */
  xUnit?: string;
  /** Unit suffix appended to Y-axis tick values (recharts `unit`). */
  yUnit?: string;
  /** Optional numeric field mapped to point size (a bubble chart), via recharts `ZAxis`. */
  zKey?: string;
  /** Point-size range `[min, max]` the `zKey` maps into. Ignored when `zKey` is unset (points use recharts' default size). */
  zRange?: [number, number];
  /** Marker shape for every point. */
  shape?: ScatterMarkerShape;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const ScatterChart = React.forwardRef<HTMLDivElement, ScatterChartProps>(
  (
    {
      className,
      config,
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
      ...props
    },
    ref
  ) => {
    // Axis titles: the X title sits below the ticks; the Y title is rotated in
    // the left gutter. Passed to recharts' native `label` (themed via the
    // `.recharts-label` fill selector on the container).
    const xAxisTitle = xAxisLabel
      ? { value: xAxisLabel, position: 'insideBottom' as const, offset: -8 }
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
          <RechartsScatterChart
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
          >
            {showGrid && <CartesianGrid />}
            <XAxis
              type="number"
              dataKey={xKey}
              name={xKey}
              unit={xUnit}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={xAxisLabel ? 48 : undefined}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yKey}
              unit={yUnit}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {zKey && (
              <ZAxis type="number" dataKey={zKey} range={zRange} name={zKey} />
            )}
            {showTooltip && (
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<ChartTooltipContent />}
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
                isAnimationActive={false}
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
