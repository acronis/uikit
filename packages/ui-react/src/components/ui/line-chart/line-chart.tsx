'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  LineChart as RechartsLineChart,
  ReferenceLine,
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
  resolveBrushProps,
  toLabelFormatter,
  resolveLabelFillClass,
  resolveChartReferenceValue,
  resolveReferenceLineProps,
  toReferenceLineList,
  CHART_LABEL_MARGIN,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartLegendContentProps,
  type ChartTooltipContentProps,
  type CartesianChartProps,
  type ChartAnimationProps,
  type ChartBrushProps,
  type ChartCurveType,
  type ChartDataLabelProps,
  type ChartReferenceLine,
  type CartesianLabelPosition,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. The two CVA
// axes are the design's Line-chart variant set: `curve` (how the segments
// interpolate between points — straight, smoothed, or stepped; the seven values
// are documented on the shared `ChartCurveType`) and `lineStyle` (a solid or
// dashed stroke). "single" vs "multi" line is not a variant — it
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
      natural: '',
      basis: '',
      step: '',
      stepBefore: '',
      stepAfter: '',
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

type TooltipContentType = NonNullable<
  React.ComponentProps<typeof ChartTooltip>['content']
>;
type TooltipContentFn = Extract<TooltipContentType, (...args: never[]) => unknown>;
type TooltipRenderProps = Parameters<TooltipContentFn>[0];

/**
 * Wrap a caller-supplied `tooltipContent` so the synthetic delta bands are
 * stripped from the payload before it renders, while preserving recharts' own
 * mount semantics — a function is mounted via `createElement` (its own component
 * identity + hook state), an element via `cloneElement`. This mirrors what the
 * pass-through charts get by handing `content` straight to recharts, so a
 * function-form tooltip keeps its state across re-renders here too. The returned
 * component is a stable content type (memoize it on `tooltipContent`).
 */
export function createBandStrippedTooltip(tooltipContent: TooltipContentType) {
  return function BandStrippedTooltip(props: TooltipRenderProps) {
    const merged = {
      ...props,
      payload: dropBandSeries(props.payload),
    } as TooltipRenderProps;
    return typeof tooltipContent === 'function'
      ? React.createElement(
          tooltipContent as React.FunctionComponent<TooltipRenderProps>,
          merged
        )
      : React.cloneElement(tooltipContent, merged);
  };
}

/**
 * Style override for one series, keyed by its `dataKeys` entry. Anything left
 * unset falls back to the chart-wide prop, so an entry only states what differs
 * — e.g. one thicker, dashed "target" line among otherwise identical series.
 *
 * A series listed in `comparisonKeys` keeps its dashed, dimmed, dot-less
 * treatment: `color`, `strokeWidth` and `curveType` still apply to it, but
 * `showDots` / `dotSize` do not (the overlay is defined by having no dots).
 */
export interface LineChartLineSettings {
  /** Stroke color. Defaults to the series' `config` color. */
  color?: string;
  /** Stroke width. Defaults to the chart's `strokeWidth`. */
  strokeWidth?: number;
  /** Dash this series' stroke, whatever the chart-wide `lineStyle` is. */
  dashed?: boolean;
  /** Interpolation for this series only. Defaults to the chart's `curve`. */
  curveType?: ChartCurveType;
  /** Render this series' per-point dots. Defaults to the chart's `showDots`. */
  showDots?: boolean;
  /** Dot radius for this series, in px. Defaults to the chart's `dotSize`. */
  dotSize?: number;
  /** Show/hide this series' value labels, overriding the chart's `showLabels`. */
  showLabel?: boolean;
  /** Position of this series' value labels. Defaults to the chart's `labelPosition`. */
  labelPosition?: CartesianLabelPosition;
}

export interface LineChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof lineChartVariants>,
    CartesianChartProps,
    ChartAnimationProps,
    ChartBrushProps,
    ChartDataLabelProps {
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
  /** Radius of each point's dot, in px. Its hover dot is 2px larger. */
  dotSize?: number;
  /**
   * Enlarge the hovered point's dot. Defaults to following `showDots`, so pass
   * it explicitly to get hover dots on a dot-less line (`showDots={false}`
   * with `showActiveDot`) or a static-only line (dots without the hover one).
   */
  showActiveDot?: boolean;
  /** Bridge `null` gaps in the data instead of breaking the line. */
  connectNulls?: boolean;
  /**
   * Per-series style overrides, keyed by `dataKeys` entry. Series with no entry
   * render from the chart-wide props.
   */
  lineSettings?: Record<string, LineChartLineSettings>;
  /**
   * One or more dashed reference/average lines on the value axis — a target, a
   * threshold, or a series mean. Pass a single object or an array to draw
   * several at once.
   */
  referenceLine?: ChartReferenceLine | ChartReferenceLine[];
  showLegend?: boolean;
  /** Position of the value labels when `showLabels` is on. Defaults to `top`. */
  labelPosition?: CartesianLabelPosition;
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
      xAxisLabel,
      yAxisLabel,
      yUnit,
      curve = 'monotone',
      lineStyle = 'solid',
      strokeWidth = 2,
      showDots = true,
      dotSize = 3,
      showActiveDot,
      connectNulls = false,
      lineSettings,
      referenceLine,
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
      showLabels = false,
      labelPosition,
      labelFormatter,
      showBrush = false,
      brushHeight,
      brushAriaLabel,
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
    const lineLabelPosition = labelPosition ?? 'top';
    const yDomain = resolveAxisDomain(yAxisDomain);
    const referenceLines = toReferenceLineList(referenceLine);

    // A series' own `color` and `curveType` overrides also drive its delta band,
    // so the band keeps following the line it belongs to instead of the
    // chart-wide defaults.
    const colorFor = (key: string) =>
      lineSettings?.[key]?.color ?? `var(--color-${key})`;
    const curveFor = (key: string) =>
      lineSettings?.[key]?.curveType ?? curve ?? 'monotone';

    // The plot inset is needed as soon as *any* series carries outside labels —
    // a per-series `showLabel` counts, not only the chart-wide `showLabels`.
    const hasLabels =
      showLabels ||
      Object.values(lineSettings ?? {}).some((settings) => settings.showLabel);

    // Room for the X tick row: recharts' default 30, plus a rotated tick row
    // (+20) and/or the axis title (+18). Additive — both can be present at once,
    // which the old label-or-angle ternary under-allocated.
    const xAxisHeight =
      xAxisLabel || xAxisAngle != null
        ? 30 + (xAxisAngle != null ? 20 : 0) + (xAxisLabel ? 18 : 0)
        : undefined;

    // Memoized so recharts sees a stable content type across renders — a fresh
    // wrapper each render would remount the caller's tooltip and reset its state.
    const customTooltip = React.useMemo(
      () =>
        tooltipContent ? createBandStrippedTooltip(tooltipContent) : undefined,
      [tooltipContent]
    );

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
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RootChart
            data={chartData as readonly unknown[]}
            margin={hasLabels ? CHART_LABEL_MARGIN : undefined}
          >
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
            {showTooltip &&
              (customTooltip ? (
                // Strips the synthetic delta bands before the caller's tooltip
                // sees them — the `__band_*` series feed the Areas, not the
                // tooltip (a no-op when no bands are configured).
                <ChartTooltip content={customTooltip} />
              ) : bands.length > 0 ? (
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
                // An <Area> takes one interpolation, so a pair whose two series
                // set different `curveType`s can only follow the current one.
                type={curveFor(current)}
                stroke="none"
                fill={colorFor(current)}
                fillOpacity={0.12}
                connectNulls={connectNulls}
                dot={false}
                activeDot={false}
                {...animation}
                legendType="none"
                tooltipType="none"
              />
            ))}
            {dataKeys.map((key) => {
              // Comparison series read as secondary: always dashed, dimmed, and
              // dot-less, regardless of the global lineStyle / showDots.
              const isComparison = comparisonKeys?.includes(key);
              const settings = lineSettings?.[key];
              const seriesDots =
                !isComparison && (settings?.showDots ?? showDots);
              const dotRadius = settings?.dotSize ?? dotSize;
              // The hover dot follows the static dots unless asked otherwise, so
              // a chart that sets neither renders exactly as before.
              const activeDot = !isComparison && (showActiveDot ?? seriesDots);
              const seriesDashed = settings?.dashed ?? lineStyle === 'dashed';
              const seriesLabel = settings?.showLabel ?? showLabels;
              const seriesLabelPosition =
                settings?.labelPosition ?? lineLabelPosition;
              return (
                <Line
                  key={key}
                  type={curveFor(key)}
                  dataKey={key}
                  stroke={colorFor(key)}
                  strokeWidth={settings?.strokeWidth ?? strokeWidth}
                  strokeDasharray={isComparison || seriesDashed ? '5 5' : undefined}
                  strokeOpacity={isComparison ? 0.5 : undefined}
                  dot={seriesDots ? { r: dotRadius } : false}
                  activeDot={activeDot ? { r: dotRadius + 2 } : false}
                  connectNulls={connectNulls}
                  {...animation}
                >
                  {seriesLabel && (
                    <LabelList
                      dataKey={key}
                      position={seriesLabelPosition}
                      formatter={toLabelFormatter(labelFormatter)}
                      className={resolveLabelFillClass(seriesLabelPosition)}
                      fontSize={CHART_LABEL_FONT_SIZE}
                    />
                  )}
                </Line>
              );
            })}
            {/* Annotations draw over the series they describe. */}
            {referenceLines.map((ref, index) => {
              const value = resolveChartReferenceValue(ref, data, dataKeys);
              if (value === undefined) return null;
              return (
                <ReferenceLine
                  key={`${ref.label ?? 'ref'}-${index}`}
                  y={value}
                  {...resolveReferenceLineProps(ref.label, ref.labelPosition)}
                />
              );
            })}
            {showBrush && (
              <Brush
                dataKey={xKey}
                tickFormatter={xTickFormatter}
                {...resolveBrushProps({ brushHeight, brushAriaLabel })}
              />
            )}
          </RootChart>
        </ChartContainer>
      </div>
    );
  }
);
LineChart.displayName = 'LineChart';

export { LineChart, lineChartVariants };
