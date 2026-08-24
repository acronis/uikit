'use client';

import * as React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  Text,
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
  resolveRotatedTickAnchor,
  resolveXAxisHeight,
  resolveXAxisTitle,
  resolveYAxisTitle,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartPalette,
  type ChartLegendContentProps,
  type ChartTooltipContentProps,
  type CartesianChartProps,
  type ChartAnimationProps,
} from '../chart';

// A forecast confidence-cone: a solid line over the known/actual period, a
// dashed line over the forecast period, and a shaded band (the "cone") between
// a lower and upper bound that typically widens with the horizon — visualizing
// growing uncertainty. Built on the shared Chart primitives; no new tokens
// (series colors are caller-supplied via `config`). The whole metric renders in
// one hue — actual and forecast differ by line style, not color — so the cone
// band and the forecast line both reuse the actual series' color.

// Each series' band is a synthetic `[lower, upper]` range field per row that a
// recharts <Area> shades; kept out of the tooltip/legend (see the filters
// below). One band per series, so the key carries the series' actual key — the
// whole `__cone` prefix is reserved.
const BAND_PREFIX = '__cone';
const bandKeyFor = (actualKey: string) => `${BAND_PREFIX}:${actualKey}`;

/**
 * Drop every synthetic cone-band range series from a recharts tooltip/legend
 * payload, keeping the real actual/forecast series (and their order). Applied to
 * both the default tooltip and any caller-supplied `tooltipContent`, so no band
 * surfaces regardless of which path renders or how many series are plotted.
 */
export function dropConeBand<T extends { dataKey?: unknown }>(
  payload: readonly T[] | undefined
): T[] | undefined {
  return payload?.filter(
    (item) =>
      !(
        typeof item.dataKey === 'string' && item.dataKey.startsWith(BAND_PREFIX)
      )
  );
}

/**
 * Reduce a legend payload to the metrics the chart plots — one entry per series.
 * A series' actual, forecast and cone are three recharts series painting a
 * single metric in a single hue, so the legend names each metric once, with its
 * actual series' swatch, instead of listing line styles as separate series.
 */
export function keepMetricSeries<T extends { dataKey?: unknown }>(
  payload: readonly T[] | undefined,
  actualKeys: readonly string[]
): T[] | undefined {
  return payload?.filter(
    (item) =>
      typeof item.dataKey === 'string' && actualKeys.includes(item.dataKey)
  );
}

/**
 * Wrap a caller-supplied `tooltipContent` so the synthetic cone band is stripped
 * from the payload before it renders, while preserving recharts' own mount
 * semantics — a function is mounted via `createElement` (its own component
 * identity + hook state), an element via `cloneElement`. This mirrors what the
 * pass-through charts get by handing `content` straight to recharts, so a
 * function-form tooltip keeps its state across re-renders here too. The returned
 * component is a stable content type (memoize it on `tooltipContent`).
 */
type TooltipContentType = NonNullable<
  React.ComponentProps<typeof ChartTooltip>['content']
>;
type TooltipContentFn = Extract<
  TooltipContentType,
  (...args: never[]) => unknown
>;
type TooltipRenderProps = Parameters<TooltipContentFn>[0];

export function createConeTooltip(tooltipContent: TooltipContentType) {
  return function ConeTooltip(props: TooltipRenderProps) {
    const merged = {
      ...props,
      payload: dropConeBand(props.payload),
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
 * One plotted metric: its actual / forecast columns and, optionally, the two
 * bound columns that shade its cone. Omit `lowerKey`/`upperKey` for a band-less
 * metric — a solid line handing off to a bare dashed projection.
 */
export interface ConfidenceConeSeries {
  /** Field for the known/actual values — drawn as a solid line with a filled area. */
  actualKey: string;
  /** Field for the projected values — drawn as a dashed line. */
  forecastKey: string;
  /** Field for the cone's lower bound. Omit (with `upperKey`) for no cone. */
  lowerKey?: string;
  /** Field for the cone's upper bound. Omit (with `lowerKey`) for no cone. */
  upperKey?: string;
}

/**
 * The x values of the projected period — every row carrying a forecast value for
 * at least one series, in data order. The first is the hand-off point (where the
 * shaded region and divider start); the whole set drives the forecast tick
 * styling, matched by value so tick `interval` can't skew it the way a tick
 * index would. Exported for unit tests; not part of the package's public API.
 */
export function forecastPeriodX(
  data: ReadonlyArray<Record<string, string | number | null | undefined>>,
  series: readonly ConfidenceConeSeries[],
  xKey: string
): Array<string | number | null | undefined> {
  return data
    .filter((row) =>
      series.some(({ forecastKey }) => typeof row[forecastKey] === 'number')
    )
    .map((row) => row[xKey]);
}

/**
 * Build the X-axis tick renderer that sets the projected columns apart: italic,
 * in the metric's hue. Styled inline rather than through the `fill` attribute
 * recharts hands every tick, so the accent survives the class-based tick color
 * a chart theme may apply. A custom tick owns its own text, so the caller's
 * `xTickFormatter` is applied here — recharts only applies it to default ticks.
 * Exported for unit tests; not part of the package's public API.
 */
export function createForecastTick(
  forecastX: ReadonlySet<string | number | null | undefined>,
  color: string,
  tickFormatter?: CartesianChartProps['xTickFormatter']
) {
  return function ForecastTick({
    payload,
    index,
    ...tickProps
  }: {
    payload?: { value?: string | number };
    index?: number;
  }) {
    const value = payload?.value;
    return (
      <Text
        {...tickProps}
        style={
          value != null && forecastX.has(value)
            ? { fontStyle: 'italic', fill: color }
            : undefined
        }
      >
        {tickFormatter && value != null ? tickFormatter(value, index) : value}
      </Text>
    );
  };
}

/** A dashed horizontal threshold on the value axis. */
export interface ConfidenceConeReferenceLine {
  /** Position on the value (Y) axis. */
  value: number;
  /** Optional caption rendered at the line's right end. */
  label?: string;
}

/**
 * Every prop except the one-form-or-the-other requirement `ConfidenceConeProps`
 * layers on below. Exported so the stories can type their `Meta` on a single
 * object shape — Storybook can't split a union's required args between `meta.args`
 * and a story's. Not re-exported from `index.ts`; not part of the public API.
 */
export interface ConfidenceConeBaseProps
  extends
    Omit<React.ComponentProps<'div'>, 'children'>,
    CartesianChartProps,
    ChartAnimationProps {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /**
   * Row-per-point data — the shared x dimension plus each series' actual /
   * forecast / bound fields. Rows are naturally sparse (a point has either an
   * actual or a forecast + bounds), so missing fields are allowed. Avoid fields
   * starting with `__cone` — that prefix is reserved for the internal
   * prediction-band series.
   */
  data: ReadonlyArray<Record<string, string | number | null | undefined>>;
  /**
   * Per-series map of `label` / `icon` / `tone` for the actual + forecast lines
   * (imported from the shared `Chart` primitives). Series take their colour from
   * the container's `palette`; each entry maps a key to a `label` and an optional
   * `tone`. Each metric renders in one hue: its cone band and forecast line both
   * reuse its actual series' color — actual and forecast differ by line style,
   * not hue.
   */
  config: ChartConfig;
  /** Category / time axis key (the shared dimension across rows). */
  xKey: string;
  /**
   * Plot several metrics against one shared axis — each with its own actual /
   * forecast / bound fields and its own hue (from `config[actualKey]`). Takes
   * precedence over the single-series `actualKey`/`forecastKey`/`lowerKey`/
   * `upperKey` shorthand below; pass one form or the other, not both. One of the
   * two forms is required.
   */
  series?: readonly ConfidenceConeSeries[];
  /**
   * Single-series shorthand — field for the known/actual values, drawn as a
   * solid line with a filled area. Required (with `forecastKey`) unless `series`
   * is set, which supersedes it.
   */
  actualKey?: string;
  /**
   * Single-series shorthand — field for the projected values, drawn as a dashed
   * line. Required (with `actualKey`) unless `series` is set, which supersedes
   * it.
   */
  forecastKey?: string;
  /** Field for the cone's lower bound. Omit (with `upperKey`) for no cone. */
  lowerKey?: string;
  /** Field for the cone's upper bound. Omit (with `lowerKey`) for no cone. */
  upperKey?: string;
  /**
   * How the known/actual period is drawn: a filled `area` under the line (the
   * default), or a bare `line` — for a chart where the cone is the only shaded
   * region, or where several metrics' fills would muddy each other.
   */
  actualType?: 'area' | 'line';
  /** Stroke width of the actual + forecast lines. */
  strokeWidth?: number;
  /**
   * Mark each data point: a filled dot on the observed values, a hollow one on
   * the projection — so a point reads as measured or predicted at a glance.
   */
  showDots?: boolean;
  /**
   * Italicize the X-axis ticks over the forecast period and paint them in the
   * first series' hue, so the projected columns read as projected even when the
   * shaded region is off.
   */
  styleForecastTicks?: boolean;
  /**
   * One or more dashed horizontal thresholds on the value axis — e.g. a target
   * or a capacity limit. Pass a single object or an array to draw several.
   */
  referenceLine?: ConfidenceConeReferenceLine | ConfidenceConeReferenceLine[];
  /**
   * Set off the forecast period from the actuals with a dashed divider at the
   * hand-off point (the first row with a forecast value) and a subtle shaded
   * band over the forecast region.
   */
  showForecastRegion?: boolean;
  showLegend?: boolean;
}

/**
 * Which columns to plot has to be spelled out one way or the other: the `series`
 * array, or the flat `actualKey` + `forecastKey` shorthand. Expressed as a union
 * so a chart with neither is a compile error rather than a silent plot of axes
 * and nothing else. Both forms together stay legal — `series` wins (see
 * `plotted`), which is what the multi-series stories rely on to clear the args
 * table.
 */
export type ConfidenceConeProps = ConfidenceConeBaseProps &
  (
    | { series: readonly ConfidenceConeSeries[] }
    | { actualKey: string; forecastKey: string }
  );

const ConfidenceCone = React.forwardRef<HTMLDivElement, ConfidenceConeProps>(
  (
    {
      className,
      config,
      palette,
      data,
      xKey,
      series,
      actualKey,
      forecastKey,
      lowerKey,
      upperKey,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      actualType = 'area',
      strokeWidth = 2,
      showDots = false,
      styleForecastTicks = false,
      referenceLine,
      showForecastRegion = true,
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
    // The flat *Key props are the single-series shorthand for `series`.
    const plotted = React.useMemo<readonly ConfidenceConeSeries[]>(() => {
      if (series?.length) return series;
      if (!actualKey || !forecastKey) return [];
      return [{ actualKey, forecastKey, lowerKey, upperKey }];
    }, [series, actualKey, forecastKey, lowerKey, upperKey]);

    const animation = resolveAnimation({
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
    });
    // Memoized so recharts sees a stable content type across renders — a fresh
    // wrapper each render would remount the caller's tooltip and reset its state.
    const customTooltip = React.useMemo(
      () => (tooltipContent ? createConeTooltip(tooltipContent) : undefined),
      [tooltipContent]
    );

    const xAxisTitle = resolveXAxisTitle(xAxisLabel);
    const yAxisTitle = resolveYAxisTitle(yAxisLabel);

    const yDomain = resolveAxisDomain(yAxisDomain);

    // One hue per metric. Each cone and forecast line already paints with its own
    // series' actual color; re-pointing that series' forecast key's `--color-*`
    // at it too means nothing downstream — a custom tooltip, a caller's
    // `var(--color-<forecastKey>)` — can reintroduce a second color.
    const seriesConfig = React.useMemo(() => {
      let next: ChartConfig | undefined;
      for (const { actualKey: aKey, forecastKey: fKey } of plotted) {
        const actual = config[aKey];
        const forecast = config[fKey];
        if (!actual || !forecast) continue;
        next ??= { ...config };
        next[fKey] = {
          label: forecast.label,
          icon: forecast.icon,
          tone: { sameAs: aKey },
        };
      }
      return next ?? config;
    }, [config, plotted]);

    const xAxisHeight = resolveXAxisHeight(xAxisLabel, xAxisAngle);

    // Augment each row with one `[lower, upper]` band tuple per coned series for
    // its Area to shade. Rows missing a numeric bound are left un-coned (the
    // band breaks there); a series without bounds gets no band at all.
    const chartData = data.map((row) => {
      const next: Record<string, unknown> = { ...row };
      for (const {
        actualKey: aKey,
        lowerKey: lKey,
        upperKey: uKey,
      } of plotted) {
        if (!lKey || !uKey) continue;
        const lower = row[lKey];
        const upper = row[uKey];
        next[bandKeyFor(aKey)] =
          typeof lower === 'number' && typeof upper === 'number'
            ? [lower, upper]
            : undefined;
      }
      return next;
    });

    const forecastX = forecastPeriodX(data, plotted, xKey);
    // Set the projected period off from the actuals with a shaded band + a
    // divider at the hand-off.
    const forecastStart = showForecastRegion ? forecastX[0] : undefined;
    const lastX = data[data.length - 1]?.[xKey];

    const renderForecastTick = createForecastTick(
      new Set(forecastX),
      `var(--color-${plotted[0]?.actualKey})`,
      xTickFormatter
    );

    const referenceLines = referenceLine
      ? Array.isArray(referenceLine)
        ? referenceLine
        : [referenceLine]
      : [];

    // Everything from here to the `return` is lifted out of the returned tree
    // only to keep it readable as a flat list of chart children. Nothing in
    // recharts forces the `render*` helpers to be plain functions: axes and
    // series register themselves with the chart's store, and `<Cell>` is the
    // only child still looked up by element type — a component wrapper renders
    // fine (see AreaChart's `AreaFillGradients`). They stay functions because
    // they are declared inside the render body, where a component would get a
    // fresh element type on every render and remount its subtree.

    const renderAxes = () => (
      <>
        <XAxis
          dataKey={xKey}
          type="category"
          hide={!showXAxis}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={xTickFormatter}
          tick={styleForecastTicks ? renderForecastTick : undefined}
          angle={xAxisAngle}
          interval={xAxisInterval}
          textAnchor={resolveRotatedTickAnchor(xAxisAngle)}
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
      </>
    );

    // Set the forecast region off from the actuals (behind everything).
    const renderForecastRegion = () => (
      <>
        {forecastStart != null && lastX != null && (
          <ReferenceArea
            x1={forecastStart}
            x2={lastX}
            fill="var(--ui-background-surface-secondary)"
            fillOpacity={0.5}
            ifOverflow="extendDomain"
          />
        )}
        {forecastStart != null && (
          <ReferenceLine
            x={forecastStart}
            stroke="var(--ui-border-on-surface-border)"
            strokeDasharray="4 4"
          />
        )}
      </>
    );

    const renderThreshold = (
      threshold: ConfidenceConeReferenceLine,
      index: number
    ) => (
      <ReferenceLine
        key={`${threshold.label ?? 'threshold'}-${index}`}
        y={threshold.value}
        stroke="var(--ui-text-on-surface-secondary)"
        strokeDasharray="4 4"
        // extendDomain so a threshold beyond the data max stays visible.
        ifOverflow="extendDomain"
        label={
          threshold.label
            ? {
                value: threshold.label,
                position: 'insideTopRight',
                fill: 'var(--ui-text-on-surface-secondary)',
                fontSize: CHART_LABEL_FONT_SIZE,
              }
            : undefined
        }
      />
    );

    const renderTooltip = () =>
      customTooltip ? (
        // Strips the synthetic band before the caller's tooltip sees it — the
        // `__cone` series feeds the Area, not the tooltip.
        <ChartTooltip content={customTooltip} />
      ) : (
        <ChartTooltip
          content={(tp) => (
            <ChartTooltipContent
              active={tp.active}
              label={tp.label}
              // The synthetic band feeds the Area, not the tooltip.
              payload={
                dropConeBand(tp.payload) as ChartTooltipContentProps['payload']
              }
            />
          )}
        />
      );

    const renderLegend = () => (
      <ChartLegend
        content={(lp) => (
          <ChartLegendContent
            verticalAlign={lp.verticalAlign}
            payload={
              keepMetricSeries(
                lp.payload,
                plotted.map((s) => s.actualKey)
              ) as ChartLegendContentProps['payload']
            }
          />
        )}
      />
    );

    // One color per metric — actual and forecast differ by line style, not hue
    // — so a cone reuses its series' actual color.
    const renderConeBand = ({
      actualKey: aKey,
      lowerKey: lKey,
      upperKey: uKey,
    }: ConfidenceConeSeries) =>
      lKey && uKey ? (
        <Area
          key={bandKeyFor(aKey)}
          // The band paints in the same hue, at the same opacity, as the
          // actual series' own area, so nothing on the rendered path tells
          // the two apart. recharts forwards `data-*` onto the path it
          // draws; the tests select the band through this.
          data-slot="confidence-cone-band"
          dataKey={bandKeyFor(aKey)}
          type="monotone"
          stroke="none"
          fill={`var(--color-${aKey})`}
          fillOpacity={0.15}
          connectNulls={false}
          dot={false}
          activeDot={false}
          {...animation}
          legendType="none"
          tooltipType="none"
        />
      ) : null;

    const renderActualMark = ({ actualKey: aKey }: ConfidenceConeSeries) => {
      // An area and a line take the same props here; only the region under the
      // curve (and the mark recharts draws) differ. A `Line` gets no fill at
      // all — `fillOpacity: 0` would also erase its dots.
      const ActualMark = actualType === 'line' ? Line : Area;
      const areaFill =
        actualType === 'line'
          ? undefined
          : { fill: `var(--color-${aKey})`, fillOpacity: 0.15 };
      // Observed points read as measured: LineChart's dot geometry (r 3, 2px
      // ring) filled with the metric hue. The ring is that same hue, so the
      // mark is solid — and wide enough against the 2px line not to read as a
      // mere thickening of it. `fillOpacity: 1` is load-bearing: recharts
      // merges the parent mark's own presentation props into every dot it
      // draws, so an `<Area>`'s 0.15 would otherwise wash the dot out to a halo.
      const dot = showDots
        ? {
            r: 3,
            fill: `var(--color-${aKey})`,
            fillOpacity: 1,
            stroke: `var(--color-${aKey})`,
            strokeWidth: 2,
          }
        : false;
      return (
        <ActualMark
          key={aKey}
          dataKey={aKey}
          type="monotone"
          stroke={`var(--color-${aKey})`}
          strokeWidth={strokeWidth}
          {...areaFill}
          dot={dot}
          activeDot={showDots ? { r: 5 } : false}
          connectNulls
          {...animation}
          // The legend names the metric once, so it carries the swatch that
          // stands for the whole series rather than the actual line's style.
          legendType="rect"
        />
      );
    };

    const renderForecastLine = ({
      actualKey: aKey,
      forecastKey: fKey,
    }: ConfidenceConeSeries) => {
      // Projected points read as predicted: the same LineChart dot, inverted —
      // the metric's hue as the ring, the surface color as the fill, so the
      // dashed line doesn't show through the middle. (LineChart leaves the fill
      // to recharts, whose `Line` defaults it to `#fff`; the token is that same
      // white in the light theme and also holds up in the dark one.)
      // `strokeDasharray: 'none'` is load-bearing: recharts merges the parent
      // mark's presentation props into every dot, so this line's `5 5` would
      // otherwise break each dot's ring into two arcs.
      const dot = showDots
        ? {
            r: 3,
            fill: 'var(--ui-background-surface-primary)',
            stroke: `var(--color-${aKey})`,
            strokeWidth: 2,
            strokeDasharray: 'none',
          }
        : false;
      return (
        <Line
          key={fKey}
          dataKey={fKey}
          type="monotone"
          stroke={`var(--color-${aKey})`}
          strokeWidth={strokeWidth}
          strokeDasharray="5 5"
          dot={dot}
          // Paired with `dot` the way every other chart does it — left unset,
          // the projection would keep recharts' default active dot while the
          // actuals had none (and a different radius when on).
          activeDot={showDots ? { r: 5 } : false}
          connectNulls
          {...animation}
        />
      );
    };

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer
          config={seriesConfig}
          palette={palette}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <ComposedChart data={chartData as readonly unknown[]}>
            {showGrid && (
              <CartesianGrid
                horizontal={gridHorizontal ?? true}
                vertical={gridVertical ?? false}
                strokeDasharray={gridDashed ? '3 3' : undefined}
              />
            )}
            {renderAxes()}
            {renderForecastRegion()}
            {referenceLines.map(renderThreshold)}
            {showTooltip && renderTooltip()}
            {showLegend && renderLegend()}
            {/* Every cone renders before any line, so the lines draw on top of
                all of them. */}
            {plotted.map(renderConeBand)}
            {plotted.map(renderActualMark)}
            {plotted.map(renderForecastLine)}
          </ComposedChart>
        </ChartContainer>
      </div>
    );
  }
);
ConfidenceCone.displayName = 'ConfidenceCone';

export { ConfidenceCone };
