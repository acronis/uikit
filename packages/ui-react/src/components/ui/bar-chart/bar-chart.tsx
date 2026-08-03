'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Bar,
  BarChart as RechartsBarChart,
  Brush,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceArea,
  ReferenceLine,
  Rectangle,
  Text,
  XAxis,
  YAxis,
} from 'recharts';

import type { BarShapeProps } from 'recharts/types/cartesian/Bar';

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
  resolveCartesianLabelPosition,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartLegendContentProps,
  type ChartTooltipContentProps,
  type CartesianChartProps,
  type ChartAnimationProps,
  type ChartBrushProps,
  type ChartDataLabelProps,
  type CartesianLabelPosition,
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

/**
 * How a bar is painted. `rounded` rounds the growing end by `barRadius`; `pill`
 * rounds every corner to a capsule; `gradient` fades the series color down the
 * bar; `pattern` fills it with diagonal hatching in the series color (a
 * colorblind-safe way to set a subset of bars apart).
 */
export type BarChartBarShape = 'rounded' | 'pill' | 'gradient' | 'pattern';

/**
 * A category range: `from`/`to` accept either the category's value (a `xKey`
 * cell, e.g. `'Sep'`) or its 0-based row index. Both ends are inclusive, and
 * either can be omitted to run to that end of the data.
 */
export interface BarChartCategoryRange {
  from?: string | number;
  to?: string | number;
}

/**
 * Style override for one series over a range of categories — e.g. "the forecast
 * tail from September onward reads translucent and dashed". Anything left unset
 * keeps the series' normal painting.
 */
export interface BarChartBarSettings extends BarChartCategoryRange {
  /** Fill for the matched bars. Defaults to the series color. */
  fill?: string;
  /** Fill opacity for the matched bars. */
  opacity?: number;
  /** Outline the matched bars with a dashed stroke in the series color. */
  dashed?: boolean;
  /** Shape for the matched bars, overriding the chart's `barShape`. */
  shape?: BarChartBarShape;
  /**
   * Track behind the matched bars: `true` fills the plot height, while a data
   * field name caps it at that row's value — the headroom between a projection
   * and its upper bound. A capped track stacks on its bar, so it needs the
   * default `layout="grouped"`; under `layout="stacked"` it is ignored.
   */
  background?: boolean | string;
}

/** A shaded band behind a range of categories. */
export interface BarChartReferenceArea extends BarChartCategoryRange {
  /** Caption above the band. */
  label?: string;
  /**
   * Mark the category ticks under the band — accent color, italic — so the
   * highlighted range reads on the axis too. On by default.
   */
  highlightTicks?: boolean;
  /**
   * Draw a dashed rule at the band's leading edge — the hand-off into a
   * forecast. Off by default.
   */
  divider?: boolean;
}

/**
 * Resolve a category range to inclusive row indices. A bound is either the
 * category's own value (matched against the `xKey` cell) or a 0-based index;
 * an omitted bound runs to that end of the data. Returns `undefined` when the
 * data is empty or the range resolves to nothing (an unknown value, or a `to`
 * that lands before its `from`).
 *
 * Exported for unit tests; not part of the package's public API.
 */
export function barChartCategoryRange(
  range: BarChartCategoryRange,
  data: ReadonlyArray<Record<string, string | number>>,
  xKey: string
): [number, number] | undefined {
  if (data.length === 0) return undefined;

  const resolve = (bound: string | number | undefined, fallback: number) => {
    if (bound === undefined) return fallback;
    // A numeric bound is an index unless the categories are numbers themselves,
    // in which case matching a category value is the more useful reading.
    const asValue = data.findIndex((row) => row[xKey] === bound);
    if (asValue !== -1) return asValue;
    if (typeof bound === 'number' && Number.isInteger(bound)) {
      return bound >= 0 && bound < data.length ? bound : -1;
    }
    return -1;
  };

  const start = resolve(range.from, 0);
  const end = resolve(range.to, data.length - 1);
  if (start === -1 || end === -1 || start > end) return undefined;
  return [start, end];
}

// Reserved field prefix for the synthetic headroom series a capped track
// stacks onto its bar. It must never surface in the tooltip or the legend.
const HEADROOM_FIELD_PREFIX = '__headroom_';

/**
 * Drop the synthetic headroom series from a recharts tooltip/legend payload,
 * keeping the real series (and their order). `legendType`/`tooltipType="none"`
 * are set on those bars too, but recharts still lists them, so this filter is
 * what actually keeps them out — hence it's unit-tested.
 */
export function dropHeadroomSeries<T extends { dataKey?: unknown }>(
  payload: readonly T[] | undefined,
  dataKeys?: string[]
): T[] | undefined {
  const real = payload?.filter(
    (item) => !String(item.dataKey).startsWith(HEADROOM_FIELD_PREFIX)
  );
  // Giving each series its own stack (so its headroom rides on it) also reorders
  // recharts' payload, so the legend is put back in `dataKeys` order.
  return dataKeys
    ? real?.slice().sort(
        (a, b) =>
          dataKeys.indexOf(String(a.dataKey)) -
          dataKeys.indexOf(String(b.dataKey))
      )
    : real;
}

/**
 * Swap a paint-server fill back to the series color for the chrome. A
 * `gradient` / `pattern` bar fills from `url(#…)`, which paints SVG but means
 * nothing as a CSS background — the legend swatch and the tooltip dot would
 * render blank — so they fall back to the series' own `--color-<key>`.
 */
export function withSeriesColor<T extends { dataKey?: unknown; color?: string }>(
  payload: readonly T[] | undefined
): T[] | undefined {
  return payload?.map((item) =>
    item.color?.startsWith('url(')
      ? { ...item, color: `var(--color-${String(item.dataKey)})` }
      : item
  );
}

type TooltipContentType = NonNullable<
  React.ComponentProps<typeof ChartTooltip>['content']
>;
type TooltipContentFn = Extract<
  TooltipContentType,
  (...args: never[]) => unknown
>;
type TooltipRenderProps = Parameters<TooltipContentFn>[0];

/**
 * Wrap a caller-supplied `tooltipContent` so the payload is normalized before it
 * renders — the headroom series stripped, paint-server fills swapped back to the
 * series color — while preserving recharts' mount semantics: a function via
 * `createElement` (its own component identity + hook state), an element via
 * `cloneElement`. Memoize it on `tooltipContent` so recharts sees a stable
 * content type across renders.
 */
export function createNormalizedTooltip(tooltipContent: TooltipContentType) {
  return function NormalizedTooltip(props: TooltipRenderProps) {
    const merged = {
      ...props,
      payload: withSeriesColor(dropHeadroomSeries(props.payload)),
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
 * Draw a bar, optionally over its full-height track (recharts hands a custom
 * `<Bar shape>` the track geometry alongside the bar's). Only geometry and
 * paint props are forwarded — recharts also passes the whole data entry, and
 * spreading that onto an SVG node would leak data fields into the DOM.
 */
function renderBarWithTrack({
  bar,
  track,
  trackFill,
}: {
  bar: Omit<BarShapeProps, 'background' | 'index'>;
  track?: BarShapeProps['background'];
  trackFill: string;
}) {
  return (
    <>
      {track && (
        <rect
          className="recharts-bar-background-rectangle"
          x={track.x ?? undefined}
          y={track.y ?? undefined}
          width={track.width ?? undefined}
          height={track.height ?? undefined}
          fill={trackFill}
        />
      )}
      <Rectangle
        x={bar.x ?? undefined}
        y={bar.y ?? undefined}
        width={bar.width ?? undefined}
        height={bar.height ?? undefined}
        radius={bar.radius}
        fill={bar.fill}
        fillOpacity={bar.fillOpacity}
        stroke={bar.stroke}
        strokeWidth={bar.strokeWidth}
        strokeDasharray={bar.strokeDasharray}
      />
    </>
  );
}

/**
 * Draw a highlight band plus a dashed rule on its leading edge: the left edge
 * for vertical bars (the category axis runs along X), the top edge otherwise.
 */
function renderBandWithDivider({
  band,
  vertical,
}: {
  band: { x?: number; y?: number; width?: number; height?: number };
  vertical: boolean;
}) {
  const { x = 0, y = 0, width = 0, height = 0 } = band;
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="var(--ui-background-surface-secondary)"
        fillOpacity={0.6}
      />
      <line
        x1={x}
        y1={y}
        x2={vertical ? x : x + width}
        y2={vertical ? y + height : y}
        stroke="var(--ui-border-on-surface-border)"
        strokeDasharray="4 4"
      />
    </>
  );
}

export interface BarChartReferenceLine {
  /** Fixed position on the value axis. Takes precedence over `average`. */
  value?: number;
  /**
   * Draw the line at the mean of one series (a `dataKeys` entry) or, when
   * `true`, of every plotted series' values.
   */
  average?: boolean | string;
  /** Optional caption rendered alongside the line. */
  label?: string;
}

/**
 * Resolve a `referenceLine` config to a position on the value axis: a fixed
 * `value` wins; otherwise the mean of the requested series (a single `dataKeys`
 * entry, or all of them when `average` is `true`). Returns `undefined` when
 * there is nothing to draw (no config, or no numeric values to average).
 * Exported for unit tests; not part of the package's public API.
 */
export function barChartReferenceValue(
  referenceLine: BarChartReferenceLine | undefined,
  data: ReadonlyArray<Record<string, string | number>>,
  dataKeys: string[]
): number | undefined {
  if (!referenceLine) return undefined;
  if (typeof referenceLine.value === 'number') return referenceLine.value;
  if (!referenceLine.average) return undefined;

  const keys =
    typeof referenceLine.average === 'string'
      ? [referenceLine.average]
      : dataKeys;
  const nums = data.flatMap((row) =>
    keys
      .map((key) => row[key])
      .filter((value): value is number => typeof value === 'number')
  );
  if (nums.length === 0) return undefined;
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

export interface BarChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof barChartVariants>,
    CartesianChartProps,
    ChartAnimationProps,
    ChartBrushProps,
    ChartDataLabelProps {
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
  /**
   * One or more dashed reference/average lines on the value axis (Y for vertical
   * bars, X for horizontal). Each is driven by a fixed `value` or a computed
   * series `average`. Pass a single object or an array to draw several at once.
   */
  referenceLine?: BarChartReferenceLine | BarChartReferenceLine[];
  /**
   * One or more shaded bands behind a range of categories — e.g. a forecast
   * period. Pass a single object or an array to draw several.
   */
  referenceArea?: BarChartReferenceArea | BarChartReferenceArea[];
  /**
   * Per-series style override for a range of categories, keyed by `dataKeys`
   * entry. Bars outside a series' range — and series with no entry — render
   * normally.
   */
  barSettings?: Record<string, BarChartBarSettings>;
  /** Unit suffix on X-axis tick values (recharts `unit`) — applies when the X axis is numeric (`orientation="horizontal"`). */
  xUnit?: string;
  /** Corner radius applied to the growing end of each bar. */
  barRadius?: number;
  /** How every bar is painted. Per-range overrides come from `barSettings`. */
  barShape?: BarChartBarShape;
  /** Fixed bar thickness, in px. Unset, recharts sizes bars from the available width. */
  barSize?: number;
  /** Upper bound on the computed bar thickness, in px. */
  maxBarSize?: number;
  /** Gap between bars of the same category, in px or a percentage string. */
  barGap?: number | string;
  /** Gap between category groups, in px or a percentage string. */
  barCategoryGap?: number | string;
  /**
   * Minimum rendered length for a bar, in px, so a tiny value stays visible. A
   * value of exactly `0` still renders nothing — a floor on it would read as a
   * small positive.
   */
  minPointSize?: number;
  /** Draw a full-height track behind every bar. */
  showBackground?: boolean;
  /** Fill for the track background. Defaults to the secondary surface. */
  backgroundFill?: string;
  /** Highlight the hovered bar. */
  showActiveBar?: boolean;
  /** Painting of the hovered bar when `showActiveBar` is on. */
  activeBar?: {
    /** Fill for the hovered bar. Defaults to the series color. */
    fill?: string;
    /** Fill opacity for the hovered bar. */
    opacity?: number;
  };
  showLegend?: boolean;
  /**
   * Position of the value labels when `showLabels` is on. Defaults to the growing
   * end — `top` for vertical bars, `right` for horizontal.
   */
  labelPosition?: CartesianLabelPosition;
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      config,
      data,
      dataKeys,
      xKey,
      referenceLine,
      referenceArea,
      barSettings,
      xAxisLabel,
      yAxisLabel,
      xUnit,
      yUnit,
      orientation = 'vertical',
      layout = 'grouped',
      barRadius = 4,
      barShape = 'rounded',
      barSize,
      maxBarSize,
      barGap,
      barCategoryGap,
      minPointSize,
      showBackground = false,
      backgroundFill = 'var(--ui-background-surface-secondary)',
      showActiveBar = false,
      activeBar,
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
    // Our `orientation` is bar-direction; recharts' `layout` is the opposite axis.
    const rechartsLayout = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    const isStacked = layout === 'stacked';
    // Labels sit at the growing end of the bar: above vertical bars, to the
    // right of horizontal ones — or centred in the segment when stacked.
    const barLabelPosition = resolveCartesianLabelPosition({
      labelPosition,
      isStacked,
      growingEnd: orientation === 'horizontal' ? 'right' : 'top',
    });

    const referenceLines = referenceLine
      ? Array.isArray(referenceLine)
        ? referenceLine
        : [referenceLine]
      : [];

    // Bands + the per-series overrides resolved to inclusive row indices once,
    // so the Cells below are a lookup rather than a search per bar.
    const referenceAreas = (
      referenceArea
        ? Array.isArray(referenceArea)
          ? referenceArea
          : [referenceArea]
        : []
    )
      .map((area) => ({ area, range: barChartCategoryRange(area, data, xKey) }))
      .filter(
        (entry): entry is { area: BarChartReferenceArea; range: [number, number] } =>
          entry.range !== undefined
      );

    const settingsByKey = new Map(
      dataKeys.flatMap((key) => {
        const settings = barSettings?.[key];
        const range = settings
          ? barChartCategoryRange(settings, data, xKey)
          : undefined;
        return settings && range ? [[key, { settings, range }] as const] : [];
      })
    );

    // A capped track is drawn as a synthetic remainder (upper bound minus the
    // bar's own value) stacked on the bar, so recharts scales and animates it
    // rather than us guessing the axis scale from a mid-animation geometry.
    const headroomKeys = new Map(
      isStacked
        ? []
        : Array.from(settingsByKey, ([key, entry]) =>
            typeof entry.settings.background === 'string'
              ? ([key, entry.settings.background] as const)
              : undefined
          ).filter((pair): pair is readonly [string, string] => pair !== undefined)
    );

    const chartData = headroomKeys.size
      ? data.map((row, rowIndex) => {
          const extra: Record<string, number> = {};
          headroomKeys.forEach((upperKey, key) => {
            const entry = settingsByKey.get(key);
            if (!entry) return;
            const [start, end] = entry.range;
            if (rowIndex < start || rowIndex > end) return;
            const value = row[key];
            const upper = row[upperKey];
            if (typeof value !== 'number' || typeof upper !== 'number') return;
            extra[`${HEADROOM_FIELD_PREFIX}${key}`] = Math.max(0, upper - value);
          });
          return { ...row, ...extra };
        })
      : data;

    // The ticks under a band pick up the accent styling unless the band opts out.
    const highlightedTicks = referenceAreas
      .filter(({ area }) => area.highlightTicks !== false)
      .map(({ range }) => range);
    const isTickHighlighted = (index: number) =>
      highlightedTicks.some(([start, end]) => index >= start && index <= end);

    // recharts places the tick and hands the element its final geometry; we
    // reuse its own <Text> so angle/anchor behavior is unchanged and only add
    // the accent styling for the highlighted range.
    const categoryTick = highlightedTicks.length
      ? ({
          payload,
          index,
          ...tickProps
        }: {
          payload: { value: string | number };
          index: number;
        }) => {
          const formatter =
            orientation === 'horizontal' ? yTickFormatter : xTickFormatter;
          const value = formatter
            ? formatter(payload.value as never, index)
            : payload.value;
          return (
            <Text
              {...tickProps}
              className={cn(
                'fill-muted-foreground',
                isTickHighlighted(index) && 'fill-primary italic'
              )}
              fontSize={12}
            >
              {value}
            </Text>
          );
        }
      : undefined;

    // recharts spreads this over the bar's own props, so an explicitly
    // `undefined` fill would wipe the series color (an unfilled path paints
    // black). Only set what the caller asked for, and dim by default so
    // `showActiveBar` alone is visible.
    const activeBarOption = showActiveBar
      ? {
          ...(activeBar?.fill !== undefined ? { fill: activeBar.fill } : {}),
          fillOpacity: activeBar?.opacity ?? 0.85,
        }
      : false;

    const shapeOf = (key: string, index: number): BarChartBarShape => {
      const entry = settingsByKey.get(key);
      const inRange =
        entry && index >= entry.range[0] && index <= entry.range[1];
      return (inRange && entry.settings.shape) || barShape;
    };

    // `gradient` and `pattern` paint from an SVG def, so the ids have to be
    // unique per chart instance — same guard the shared container applies.
    const defsId = `bar-${React.useId().replace(/:/g, '')}`;
    const usedShapes = new Set<BarChartBarShape>([barShape]);
    settingsByKey.forEach(({ settings }) => {
      if (settings.shape) usedShapes.add(settings.shape);
    });
    // recharts applies a flat minPointSize to zeroes too, which would draw a
    // sliver where there is nothing to show.
    const minPointSizeFor =
      minPointSize === undefined
        ? undefined
        : (value: number | undefined | null) =>
            value === 0 || value == null ? 0 : minPointSize;

    // Either condition means the chrome can't take recharts' payload as-is.
    const normalizeChrome =
      headroomKeys.size > 0 ||
      usedShapes.has('gradient') ||
      usedShapes.has('pattern');

    const fillOf = (key: string, shape: BarChartBarShape) =>
      shape === 'gradient'
        ? `url(#${defsId}-gradient-${key})`
        : shape === 'pattern'
          ? `url(#${defsId}-pattern-${key})`
          : `var(--color-${key})`;

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

    // Memoized so recharts sees a stable content type across renders — a fresh
    // wrapper each render would remount the caller's tooltip and reset its state.
    const customTooltip = React.useMemo(
      () =>
        tooltipContent
          ? createNormalizedTooltip(tooltipContent)
          : undefined,
      [tooltipContent]
    );

    // Room for the X tick row: recharts' default 30, plus a rotated tick row
    // (+20) and/or the axis title (+18). Additive — both can be present at once,
    // which the old label-or-angle ternary under-allocated.
    const xAxisHeight =
      xAxisLabel || xAxisAngle != null
        ? 30 + (xAxisAngle != null ? 20 : 0) + (xAxisLabel ? 18 : 0)
        : undefined;

    // Round only the growing end: top for vertical bars, right for horizontal.
    const endRadius: [number, number, number, number] =
      orientation === 'horizontal'
        ? [0, barRadius, barRadius, 0]
        : [barRadius, barRadius, 0, 0];
    // A pill rounds every corner; recharts clamps the radius to half the bar's
    // shorter side, so an oversized number gives a true capsule at any width.
    const radiusFor = (shape: BarChartBarShape, rounded: boolean) =>
      shape === 'pill'
        ? 9999
        : barRadius > 0 && rounded
          ? endRadius
          : undefined;

    return (
      <div
        ref={ref}
        data-orientation={orientation}
        data-layout={layout}
        className={cn(barChartVariants({ orientation, layout }), className)}
        {...props}
      >
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsBarChart
            data={chartData as readonly unknown[]}
            layout={rechartsLayout}
            barSize={barSize}
            maxBarSize={maxBarSize}
            barGap={barGap}
            barCategoryGap={barCategoryGap}
          >
            {(usedShapes.has('gradient') || usedShapes.has('pattern')) && (
              <defs>
                {dataKeys.map((key) => (
                  <React.Fragment key={key}>
                    {usedShapes.has('gradient') && (
                      <linearGradient
                        id={`${defsId}-gradient-${key}`}
                        x1="0"
                        y1="0"
                        x2={orientation === 'horizontal' ? '1' : '0'}
                        y2={orientation === 'horizontal' ? '0' : '1'}
                      >
                        <stop
                          offset="0%"
                          stopColor={`var(--color-${key})`}
                          stopOpacity={1}
                        />
                        <stop
                          offset="100%"
                          stopColor={`var(--color-${key})`}
                          stopOpacity={0.35}
                        />
                      </linearGradient>
                    )}
                    {usedShapes.has('pattern') && (
                      <pattern
                        id={`${defsId}-pattern-${key}`}
                        patternUnits="userSpaceOnUse"
                        width={6}
                        height={6}
                        patternTransform="rotate(45)"
                      >
                        <rect
                          width={6}
                          height={6}
                          fill={`var(--color-${key})`}
                          fillOpacity={0.25}
                        />
                        <line
                          x1={0}
                          y1={0}
                          x2={0}
                          y2={6}
                          stroke={`var(--color-${key})`}
                          strokeWidth={3}
                        />
                      </pattern>
                    )}
                  </React.Fragment>
                ))}
              </defs>
            )}
            {showGrid && (
              <CartesianGrid
                horizontal={gridHorizontal ?? orientation === 'vertical'}
                vertical={gridVertical ?? orientation === 'horizontal'}
                strokeDasharray={gridDashed ? '3 3' : undefined}
              />
            )}
            {orientation === 'horizontal' ? (
              <>
                {/* Horizontal bars put the values on X, so the value-axis
                    props (tickCount/domain) belong here — recharts ignores both
                    on the category axis. */}
                <XAxis
                  type="number"
                  hide={!showXAxis}
                  tickLine={false}
                  axisLine={false}
                  unit={xUnit}
                  tickFormatter={xTickFormatter}
                  angle={xAxisAngle}
                  interval={xAxisInterval}
                  textAnchor={
                    xAxisAngle != null ? (xAxisAngle < 0 ? 'end' : 'start') : undefined
                  }
                  tickCount={yAxisTickCount}
                  domain={yDomain}
                  height={xAxisHeight}
                  label={xAxisTitle}
                />
                <YAxis
                  dataKey={xKey}
                  type="category"
                  hide={!showYAxis}
                  tickLine={false}
                  axisLine={false}
                  tick={categoryTick}
                  tickFormatter={yTickFormatter}
                  width={yAxisLabel ? 96 : 80}
                  label={yAxisTitle}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  type="category"
                  hide={!showXAxis}
                  tickLine={false}
                  axisLine={false}
                  tick={categoryTick}
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
              </>
            )}
            {showTooltip &&
              (!normalizeChrome ? (
                <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
              ) : customTooltip ? (
                // Strips the synthetic headroom before the caller's tooltip
                // sees it — those bars decorate a series, they aren't one.
                <ChartTooltip content={customTooltip} />
              ) : (
                <ChartTooltip
                  content={(tp) => (
                    <ChartTooltipContent
                      active={tp.active}
                      label={tp.label}
                      payload={
                        withSeriesColor(
                          dropHeadroomSeries(tp.payload)
                        ) as ChartTooltipContentProps['payload']
                      }
                    />
                  )}
                />
              ))}
            {showLegend &&
              (!normalizeChrome ? (
                <ChartLegend content={<ChartLegendContent />} />
              ) : (
                <ChartLegend
                  content={(lp) => (
                    <ChartLegendContent
                      verticalAlign={lp.verticalAlign}
                      payload={
                        withSeriesColor(
                          dropHeadroomSeries(lp.payload, dataKeys)
                        ) as ChartLegendContentProps['payload']
                      }
                    />
                  )}
                />
              ))}
            {dataKeys.map((key, index) => {
              // In a stack only the last segment's end is rounded; grouped bars
              // each round their own end.
              const rounded = isStacked ? index === dataKeys.length - 1 : true;
              const entry = settingsByKey.get(key);
              const inRange = (row: number) =>
                entry !== undefined &&
                row >= entry.range[0] &&
                row <= entry.range[1];
              // recharts takes one `background` per series, so a range-scoped
              // one is drawn per row: hidden where it doesn't apply.
              const rangeBackground = entry?.settings.background === true;
              const headroomKey = headroomKeys.get(key);
              return (
                <React.Fragment key={key}>
                <Bar
                  dataKey={key}
                  fill={fillOf(key, barShape)}
                  // Its own stack, so the headroom sits on this series' bar
                  // while the series stay side by side.
                  stackId={isStacked ? 'a' : headroomKey ? key : undefined}
                  radius={radiusFor(barShape, rounded)}
                  minPointSize={minPointSizeFor}
                  background={
                    showBackground ? { fill: backgroundFill } : undefined
                  }
                  // recharts' own `background` is all-or-nothing per series, so
                  // a range-scoped track is drawn by the shape, which is handed
                  // the full track geometry alongside the bar's.
                  shape={
                    rangeBackground
                      ? ({ background: track, index: row, ...bar }: BarShapeProps) =>
                          renderBarWithTrack({
                            bar,
                            track: inRange(row) ? track : undefined,
                            trackFill: backgroundFill,
                          })
                      : undefined
                  }
                  activeBar={activeBarOption}
                  {...animation}
                >
                  {entry &&
                    data.map((row, rowIndex) => {
                      const on = inRange(rowIndex);
                      const shape = shapeOf(key, rowIndex);
                      const { fill, opacity, dashed } = entry.settings;
                      // Only a row that actually carries headroom gives up its
                      // rounded end — a row in range whose upper bound is
                      // missing, or no higher than its value, keeps it.
                      const stacksHeadroom =
                        headroomKey !== undefined &&
                        Number(
                          (chartData[rowIndex] as Record<string, unknown>)?.[
                            `${HEADROOM_FIELD_PREFIX}${key}`
                          ]
                        ) > 0;
                      return (
                        <Cell
                          key={`${key}-${String(row[xKey])}-${rowIndex}`}
                          fill={on ? (fill ?? fillOf(key, shape)) : fillOf(key, barShape)}
                          fillOpacity={on ? opacity : undefined}
                          stroke={
                            on && dashed ? `var(--color-${key})` : undefined
                          }
                          strokeWidth={on && dashed ? 1 : undefined}
                          strokeDasharray={on && dashed ? '4 3' : undefined}
                          // Cell types `radius` as the SVG attribute, but it
                          // feeds recharts' Rectangle, which takes the 4-tuple.
                          // A bar with headroom stacked on it hands the rounded
                          // end to that segment instead.
                          radius={
                            (stacksHeadroom
                              ? undefined
                              : radiusFor(on ? shape : barShape, rounded)) as
                              | number
                              | undefined
                          }
                        />
                      );
                    })}
                  {showLabels && (
                    <LabelList
                      dataKey={key}
                      position={barLabelPosition}
                      formatter={toLabelFormatter(labelFormatter)}
                      className={resolveLabelFillClass(barLabelPosition)}
                      fontSize={CHART_LABEL_FONT_SIZE}
                    />
                  )}
                </Bar>
                {headroomKey && (
                  <Bar
                    dataKey={`${HEADROOM_FIELD_PREFIX}${key}`}
                    stackId={key}
                    fill={`var(--color-${key})`}
                    fillOpacity={0.25}
                    radius={radiusFor(barShape, true)}
                    // Decoration for the bar below it — never its own row in the
                    // tooltip or entry in the legend.
                    legendType="none"
                    tooltipType="none"
                    {...animation}
                  />
                )}
                </React.Fragment>
              );
            })}
            {referenceAreas.map(({ area, range }, index) => {
              const [start, end] = range;
              return (
                <ReferenceArea
                  key={`${area.label ?? 'area'}-${index}`}
                  // Bands run along the category axis: X for vertical bars, Y
                  // for horizontal ones.
                  {...(orientation === 'horizontal'
                    ? {
                        y1: data[start]?.[xKey],
                        y2: data[end]?.[xKey],
                      }
                    : {
                        x1: data[start]?.[xKey],
                        x2: data[end]?.[xKey],
                      })}
                  fill="var(--ui-background-surface-secondary)"
                  fillOpacity={0.6}
                  ifOverflow="extendDomain"
                  // A ReferenceLine would sit on the tick's centre; the rule
                  // belongs on the band's edge, which only the band knows.
                  shape={
                    area.divider
                      ? (bandProps: {
                          x?: number;
                          y?: number;
                          width?: number;
                          height?: number;
                        }) =>
                          renderBandWithDivider({
                            band: bandProps,
                            vertical: orientation !== 'horizontal',
                          })
                      : undefined
                  }
                  label={
                    area.label
                      ? {
                          value: area.label,
                          position: 'insideTop',
                          fill: 'var(--ui-text-on-surface-secondary)',
                          fontSize: 12,
                        }
                      : undefined
                  }
                />
              );
            })}
            {referenceLines.map((ref, index) => {
              const value = barChartReferenceValue(ref, data, dataKeys);
              if (value === undefined) return null;
              return (
                <ReferenceLine
                  key={`${ref.label ?? 'ref'}-${index}`}
                  // Draw on the value axis: Y for vertical bars, X for horizontal.
                  {...(orientation === 'horizontal' ? { x: value } : { y: value })}
                  stroke="var(--ui-text-on-surface-secondary)"
                  strokeDasharray="4 4"
                  // extendDomain so a target beyond the data max stays visible.
                  ifOverflow="extendDomain"
                  label={
                    ref.label
                      ? {
                          value: ref.label,
                          // Sit the caption at the top of the line: above the
                          // right end of a horizontal line (vertical bars), or
                          // above the top of a vertical line (horizontal bars).
                          position:
                            orientation === 'horizontal'
                              ? 'top'
                              : 'insideTopRight',
                          fill: 'var(--ui-text-on-surface-secondary)',
                          fontSize: 12,
                        }
                      : undefined
                  }
                />
              );
            })}
            {showBrush && (
              <Brush
                dataKey={xKey}
                // The brush slices rows by index, so its captions come from
                // whichever axis holds the categories — Y for horizontal bars.
                tickFormatter={
                  orientation === 'horizontal' ? yTickFormatter : xTickFormatter
                }
                {...resolveBrushProps({ brushHeight, brushAriaLabel })}
              />
            )}
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
BarChart.displayName = 'BarChart';

export { BarChart, barChartVariants };
