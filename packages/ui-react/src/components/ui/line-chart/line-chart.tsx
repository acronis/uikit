'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Area,
  CartesianGrid,
  ComposedChart,
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
  type ChartLegendContentProps,
  type ChartTooltipContentProps,
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

// Reserved field prefix for the synthetic delta-band range series. Each band
// mints one `__band_<n>` field that feeds an <Area>; it must never surface in
// the tooltip or legend (those describe only real, caller-supplied series).
const BAND_FIELD_PREFIX = '__band_';

/**
 * Drop the synthetic delta-band range series from a recharts tooltip/legend
 * payload, keeping the real series (and their order). recharts already excludes
 * the band via `legendType`/`tooltipType="none"`, so this is a second, explicit
 * guard — hence it's unit-tested rather than relying on that behavior.
 */
export function dropBandSeries<T extends { dataKey?: unknown }>(
  payload: readonly T[] | undefined
): T[] | undefined {
  return payload?.filter(
    (item) => !String(item.dataKey).startsWith(BAND_FIELD_PREFIX)
  );
}

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
  /**
   * Subset of `dataKeys` to render as comparison/trend overlays (e.g. a
   * previous quarter or year) — dashed, dimmed, and dot-less, so they read as
   * secondary to the current-period lines. Keeps each series' own `config` color.
   */
  comparisonKeys?: string[];
  /**
   * Pairs of `[currentKey, comparisonKey]` to shade a delta band between — a
   * dimmed area filling the gap between the two series at each point,
   * visualizing the QoQ/YoY difference. Tinted with the first key's `config`
   * color. Rows where either value isn't numeric are left un-banded.
   *
   * Each pair mints an internal `__band_<n>` field (kept out of the tooltip and
   * legend), so avoid data/`config` keys with that reserved prefix.
   */
  deltaBands?: Array<[string, string]>;
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
      comparisonKeys,
      deltaBands,
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

    // Each delta band becomes a synthetic `[min, max]` range field per row that
    // a recharts <Area> shades. Rows where either series isn't numeric are left
    // un-banded (the area breaks there).
    const bands = (deltaBands ?? []).map(([current, comparison], index) => ({
      field: `${BAND_FIELD_PREFIX}${index}`,
      current,
      comparison,
    }));
    const chartData = bands.length
      ? data.map((row) => {
          const augmented: Record<string, unknown> = { ...row };
          for (const { field, current, comparison } of bands) {
            const a = row[current];
            const b = row[comparison];
            augmented[field] =
              typeof a === 'number' && typeof b === 'number'
                ? [Math.min(a, b), Math.max(a, b)]
                : undefined;
          }
          return augmented;
        })
      : data;

    // Only a delta band needs an <Area>, which recharts renders under
    // ComposedChart, not LineChart. Escalate to ComposedChart only then, so
    // plain line charts keep the LineChart base (and their baselines) untouched.
    const RootChart = bands.length > 0 ? ComposedChart : RechartsLineChart;

    return (
      <div
        ref={ref}
        data-curve={curve}
        data-line-style={lineStyle}
        className={cn(lineChartVariants({ curve, lineStyle }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RootChart data={chartData as readonly unknown[]}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis type="number" tickLine={false} axisLine={false} />
            {showTooltip &&
              (bands.length > 0 ? (
                <ChartTooltip
                  content={(props) => (
                    <ChartTooltipContent
                      active={props.active}
                      label={props.label}
                      payload={
                        dropBandSeries(
                          props.payload
                        ) as ChartTooltipContentProps['payload']
                      }
                    />
                  )}
                />
              ) : (
                <ChartTooltip content={<ChartTooltipContent />} />
              ))}
            {showLegend &&
              (bands.length > 0 ? (
                <ChartLegend
                  content={(props) => (
                    <ChartLegendContent
                      verticalAlign={props.verticalAlign}
                      payload={
                        dropBandSeries(
                          props.payload
                        ) as ChartLegendContentProps['payload']
                      }
                    />
                  )}
                />
              ) : (
                <ChartLegend content={<ChartLegendContent />} />
              ))}
            {/* Delta bands render before the lines so the lines draw on top. */}
            {bands.map(({ field, current }) => (
              <Area
                key={field}
                dataKey={field}
                type={curve ?? 'monotone'}
                stroke="none"
                fill={`var(--color-${current})`}
                fillOpacity={0.12}
                connectNulls={connectNulls}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                legendType="none"
                tooltipType="none"
              />
            ))}
            {dataKeys.map((key) => {
              // Comparison series read as secondary: always dashed, dimmed, and
              // dot-less, regardless of the global lineStyle / showDots.
              const isComparison = comparisonKeys?.includes(key);
              return (
                <Line
                  key={key}
                  type={curve ?? 'monotone'}
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isComparison ? '5 5' : dashArray}
                  strokeOpacity={isComparison ? 0.5 : undefined}
                  dot={!isComparison && showDots ? { r: 3 } : false}
                  activeDot={!isComparison && showDots ? { r: 5 } : false}
                  connectNulls={connectNulls}
                  isAnimationActive={false}
                />
              );
            })}
          </RootChart>
        </ChartContainer>
      </div>
    );
  }
);
LineChart.displayName = 'LineChart';

export { LineChart, lineChartVariants };
