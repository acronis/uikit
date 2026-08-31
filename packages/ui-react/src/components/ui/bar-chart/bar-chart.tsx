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
import { Meter as MeterPrimitive } from '@base-ui/react/meter';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import {
  CHART_LABEL_FONT_SIZE,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  resolveAxisDomain,
  resolveBrushProps,
  resolveCartesianLabelPosition,
  resolveCategoryRange,
  resolveChartReferenceValue,
  resolveLabelFillClass,
  resolveReferenceLineProps,
  resolveRotatedTickAnchor,
  resolveXAxisHeight,
  resolveXAxisTitle,
  resolveYAxisTitle,
  resolveChartColors,
  toLabelFormatter,
  toReferenceLineList,
  type ChartConfig,
  type ChartPalette,
  type ChartStatusTone,
  type ChartReferenceLine,
  type ChartLegendContentProps,
  type ChartTooltipContentProps,
  type CartesianChartProps,
  type ChartAnimationProps,
  type ChartBrushProps,
  type ChartCategoryRange,
  type ChartDataLabelProps,
  type CartesianLabelPosition,
} from '../chart';

// The two CVA axes are the design's Bar-chart variant set (B2): `orientation`
// and `layout` (grouped side-by-side vs stacked). `orientation` is the
// discriminant for *which component this is*: `vertical` renders the typed
// recharts composition over the shared `Chart` primitives (bars rising from a
// category X axis), `horizontal` renders the labelled proportional bar list
// below, which has no axes, grid, or recharts at all. The classes stay empty
// because neither mode is styled by a variant class — the recharts SVG draws
// the vertical bars, and the horizontal list carries its own layout. CVA is
// kept so the variant set is a first-class, spec-conformant part of the API
// (matched against ui-spec's api.yaml enums); the resolved values are mirrored
// onto `data-orientation` / `data-layout` for styling hooks and tests.
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
 * Style override for one series over a range of categories — e.g. "the forecast
 * tail from September onward reads translucent and dashed". Anything left unset
 * keeps the series' normal painting.
 */
export interface BarChartBarSettings extends ChartCategoryRange {
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
export interface BarChartReferenceArea extends ChartCategoryRange {
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
  // recharts sorts the legend payload alphabetically by series name by default
  // (its `itemSorter: 'value'`), so passing `dataKeys` puts the entries back in
  // the order the caller declared them.
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

type LegendContentType = NonNullable<
  React.ComponentProps<typeof ChartLegend>['content']
>;
type LegendContentFn = Extract<LegendContentType, (...args: never[]) => unknown>;
type LegendRenderProps = Parameters<LegendContentFn>[0];

/**
 * Tooltip content that normalizes recharts' payload before anything renders it:
 * the synthetic headroom series stripped, the rows put back in `dataKeys` order,
 * and paint-server fills swapped back to the series color. Falls through to a
 * caller-supplied `content`, preserving recharts' own mount semantics — a
 * function via `createElement` (its own component identity + hook state), an
 * element via `cloneElement`.
 *
 * This is a component rather than a per-render wrapper factory on purpose:
 * recharts renders `content` by cloning the element it is given
 * (`Tooltip.js:27-28`), so a stable module-level type here means the subtree is
 * never remounted, whatever the caller passes.
 */
export function NormalizedTooltipContent({
  content,
  dataKeys,
  ...props
}: Partial<TooltipRenderProps> & {
  content?: TooltipContentType;
  dataKeys?: string[];
}) {
  const merged = {
    ...props,
    payload: withSeriesColor(dropHeadroomSeries(props.payload, dataKeys)),
  } as TooltipRenderProps;

  if (!content) {
    return <ChartTooltipContent {...(merged as ChartTooltipContentProps)} />;
  }
  return typeof content === 'function'
    ? React.createElement(
        content as React.FunctionComponent<TooltipRenderProps>,
        merged
      )
    : React.cloneElement(content, merged);
}

/**
 * Legend content over the same normalization. Ordering is the reason this
 * applies unconditionally: recharts sorts legend entries alphabetically by
 * series name by default (`itemSorter: 'value'`), so without putting them back
 * in `dataKeys` order the legend would silently reorder itself depending on
 * which bar-styling props happen to be set.
 */
export function NormalizedLegendContent({
  dataKeys,
  ...props
}: Partial<LegendRenderProps> & { dataKeys: string[] }) {
  return (
    <ChartLegendContent
      verticalAlign={props.verticalAlign}
      payload={
        withSeriesColor(
          dropHeadroomSeries(props.payload, dataKeys)
        ) as ChartLegendContentProps['payload']
      }
    />
  );
}

/** Paint overrides recharts spreads over a bar to mark it as the active one. */
interface BarPaintOverride {
  fill?: string;
  fillOpacity?: number;
}

/**
 * Draw a bar, optionally over its full-height track (recharts hands a custom
 * `<Bar shape>` the track geometry alongside the bar's). Only geometry and
 * paint props are forwarded — recharts also passes the whole data entry, and
 * spreading that onto an SVG node would leak data fields into the DOM.
 *
 * `paint` is how the active bar keeps its track: recharts swaps a custom
 * `shape` out for the `activeBar` option while a bar is hovered
 * (`Bar.js` `BarRectangleWithActiveState`), so the active option has to be a
 * shape of its own that redraws the track and applies the highlight itself.
 */
function renderBarWithTrack({
  bar,
  track,
  trackFill,
  paint,
}: {
  bar: Omit<BarShapeProps, 'background' | 'index'>;
  track?: BarShapeProps['background'];
  trackFill: string;
  paint?: BarPaintOverride;
}) {
  return (
    <>
      {track && (
        <Rectangle
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
        fill={paint?.fill ?? bar.fill}
        fillOpacity={paint?.fillOpacity ?? bar.fillOpacity}
        stroke={bar.stroke}
        strokeWidth={bar.strokeWidth}
        strokeDasharray={bar.strokeDasharray}
      />
    </>
  );
}

/**
 * Build the `<Bar shape>` that draws a range-scoped track. recharts' own
 * `background` is all-or-nothing per series, so the track is drawn per row and
 * hidden where the range doesn't apply.
 */
export function createTrackShape({
  inRange,
  trackFill,
  paint,
}: {
  inRange: (row: number) => boolean;
  trackFill: string;
  paint?: BarPaintOverride;
}) {
  return ({ background: track, index: row, ...bar }: BarShapeProps) =>
    renderBarWithTrack({
      bar,
      track: inRange(row) ? track : undefined,
      trackFill,
      paint,
    });
}

/**
 * The `shape` / `activeBar` pair one series' `<Bar>` is given.
 *
 * They resolve together because recharts swaps a custom `shape` out for the
 * `activeBar` option while a bar is hovered: a range-scoped track has to be
 * redrawn by the active option too, or the track blinks out under the cursor.
 */
function resolveBarShapes({
  rangeBackground,
  inRange,
  trackFill,
  activeBarOption,
}: {
  /**
   * recharts takes one `background` per series, so a range-scoped one is drawn
   * per row by a custom shape instead: hidden where it doesn't apply.
   */
  rangeBackground: boolean;
  inRange: (row: number) => boolean;
  trackFill: string;
  activeBarOption: BarPaintOverride | false;
}) {
  if (!rangeBackground) {
    return { shape: undefined, activeBar: activeBarOption };
  }
  return {
    shape: createTrackShape({ inRange, trackFill }),
    activeBar: activeBarOption
      ? createTrackShape({ inRange, trackFill, paint: activeBarOption })
      : activeBarOption,
  };
}

/**
 * Draw a highlight band plus a dashed rule on its leading edge — the left edge,
 * since the category axis runs along X.
 *
 * The band's own paint comes from the props recharts hands the shape — a
 * `<ReferenceArea shape>` still receives the element's `fill`/`fillOpacity`
 * (`ReferenceArea.js` `renderRect`), so hardcoding them here would quietly
 * ignore whatever the caller set.
 */
function renderBandWithDivider(band: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  fillOpacity?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill, fillOpacity } = band;
  return (
    <>
      <Rectangle
        className="recharts-reference-area-rect"
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={y + height}
        stroke="var(--ui-border-on-surface-border)"
        strokeDasharray="4 4"
      />
    </>
  );
}

/**
 * The `<ReferenceArea shape>` for a band, or `undefined` so recharts draws its
 * own rect. A custom shape is only needed for the leading-edge rule: a
 * `ReferenceLine` would sit on the tick's centre, and only the band knows where
 * its own edge is.
 */
function resolveBandShape(divider: boolean | undefined) {
  if (!divider) return undefined;
  return renderBandWithDivider;
}

/**
 * A band's caption as recharts' native `label`. `'insideTop'` is asserted
 * because, read outside the JSX attribute, it would widen to `string` and stop
 * matching recharts' `Position` union.
 */
function resolveBandLabel(label: string | undefined) {
  return label
    ? {
        value: label,
        position: 'insideTop' as const,
        fill: 'var(--ui-text-on-surface-secondary)',
        fontSize: 12,
      }
    : undefined;
}

/**
 * The `<defs>` a `gradient` / `pattern` bar fills from — one paint server per
 * series, since each is painted in that series' own color. Ids are namespaced
 * by the chart instance so two charts on a page can't collide.
 *
 * Safe to render as a component: unlike `Bar`'s cells, the chart renders its
 * children straight through rather than looking them up by type.
 */
function BarPaintServers({
  id,
  dataKeys,
  shapes,
}: {
  id: string;
  dataKeys: string[];
  shapes: ReadonlySet<BarChartBarShape>;
}) {
  const hasGradient = shapes.has('gradient');
  const hasPattern = shapes.has('pattern');
  if (!hasGradient && !hasPattern) return null;

  return (
    <defs>
      {dataKeys.map((key) => (
        <React.Fragment key={key}>
          {/* Bars grow up, so a gradient runs top-down. */}
          {hasGradient && (
            <linearGradient id={`${id}-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
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
          {hasPattern && (
            <pattern
              id={`${id}-pattern-${key}`}
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
  );
}

/** Corner radius as recharts' `Rectangle` takes it: one value or a 4-tuple. */
type BarRadius = number | [number, number, number, number] | undefined;

interface RangeCellsOptions {
  data: ReadonlyArray<Record<string, string | number>>;
  /** `data` plus the synthetic headroom fields, if any were added. */
  chartData: ReadonlyArray<Record<string, string | number>>;
  xKey: string;
  seriesKey: string;
  settings: BarChartBarSettings;
  /** Inclusive row bounds the settings apply to. */
  range: [number, number];
  headroomKey: string | undefined;
  barShape: BarChartBarShape;
  rounded: boolean;
  fillOf: (key: string, shape: BarChartBarShape) => string;
  radiusFor: (shape: BarChartBarShape, rounded: boolean) => BarRadius;
}

/**
 * The `<Cell>` list that applies a series' `barSettings` over its range: the
 * matched rows take the override fill/opacity/dash/shape, the rest keep the
 * series' normal painting.
 *
 * A plain function returning the elements, deliberately not a component:
 * `Bar` discovers its cells with `findAllByType(props.children, Cell)`
 * (recharts `Bar.js`), which matches each direct child on its own display
 * name. Wrapping these in a component would make that lookup find nothing and
 * silently drop every per-range style — no error, just unstyled bars.
 * Returning an array keeps them direct children, since recharts' `toArray`
 * flattens arrays and unwraps fragments.
 */
function rangeCells({
  data,
  chartData,
  xKey,
  seriesKey,
  settings,
  range,
  headroomKey,
  barShape,
  rounded,
  fillOf,
  radiusFor,
}: RangeCellsOptions) {
  const { fill, opacity, dashed } = settings;

  return data.map((row, rowIndex) => {
    const on = rowIndex >= range[0] && rowIndex <= range[1];
    const shape = (on && settings.shape) || barShape;
    // Only a row that actually carries headroom gives up its rounded end — a
    // row in range whose upper bound is missing, or no higher than its value,
    // keeps it.
    const stacksHeadroom =
      headroomKey !== undefined &&
      Number(
        (chartData[rowIndex] as Record<string, unknown>)?.[
          `${HEADROOM_FIELD_PREFIX}${seriesKey}`
        ]
      ) > 0;

    return (
      <Cell
        key={`${seriesKey}-${String(row[xKey])}-${rowIndex}`}
        fill={
          on ? (fill ?? fillOf(seriesKey, shape)) : fillOf(seriesKey, barShape)
        }
        fillOpacity={on ? opacity : undefined}
        stroke={on && dashed ? `var(--color-${seriesKey})` : undefined}
        strokeWidth={on && dashed ? 1 : undefined}
        strokeDasharray={on && dashed ? '4 3' : undefined}
        // Cell types `radius` as the SVG attribute, but it feeds recharts'
        // Rectangle, which takes the 4-tuple. A bar with headroom stacked on it
        // hands the rounded end to that segment instead.
        radius={
          (stacksHeadroom ? undefined : radiusFor(shape, rounded)) as
            | number
            | undefined
        }
      />
    );
  });
}

/**
 * The recharts bar chart: bars rising from a category X axis, with axes, grid,
 * tooltip and legend. This is the default — `orientation` is only spelled out
 * to discriminate it from the horizontal mode below.
 */
export interface BarChartVerticalProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    Omit<VariantProps<typeof barChartVariants>, 'orientation'>,
    CartesianChartProps,
    ChartAnimationProps,
    ChartBrushProps,
    ChartDataLabelProps {
  /** Selects the recharts bar chart. Omit it — this is the default. */
  orientation?: 'vertical';
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** Row-per-category data. Each object holds the category key + one numeric field per series. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-series map of `label` / `icon` / `tone` (from the shared `Chart`
   * primitives). Series take their colour from the container's `palette`; each
   * entry maps a key to a `label` and an optional `tone`.
   */
  config: ChartConfig;
  /** Series to plot — one `<Bar>` per key. Each must exist in `config` and in every data row. */
  dataKeys: string[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /**
   * One or more dashed reference/average lines on the value (Y) axis. Each is
   * driven by a fixed `value` or a computed series `average`. Pass a single
   * object or an array to draw several at once.
   */
  referenceLine?: ChartReferenceLine | ChartReferenceLine[];
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
   * Position of the value labels when `showLabels` is on. Defaults to the bar's
   * growing end (`top`), or the segment centre when the layout is stacked.
   */
  labelPosition?: CartesianLabelPosition;
}

/** One row of the horizontal bar list. */
export interface BarChartItem {
  /** Row label, shown at the start of the row. */
  label: string;
  /** The value this row represents. */
  value: number;
  /**
   * Fill color — any CSS color; prefer an existing `--ui-*` token. Required
   * when no `palette` is passed to the chart. Omit when supplying `tone`
   * together with `palette`.
   */
  color?: string;
  /**
   * Palette tone for this row. Resolved against the `palette` prop on the
   * enclosing `BarChart`; ignored when `palette` is omitted and `color` is set.
   */
  tone?: { status: ChartStatusTone };
  /**
   * Projected/forecast total value. When set and greater than `value`, renders
   * a translucent bar (same color, 30% opacity) extending from the actual
   * value's edge to the forecast value. The actual bar renders solid on top.
   * ARIA values always reflect the actual value; `aria-valuetext` also
   * mentions the forecast value. Ignored when `<= value`.
   */
  forecast?: number;
}

/**
 * The labelled proportional bar list: one row per `items` entry carrying its
 * label, value, share of `max`, and a track bar. No axes, grid, or recharts.
 */
export interface BarChartHorizontalProps
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Selects the labelled bar list. */
  orientation: 'horizontal';
  /** Rows to render — one labelled bar per item. */
  items: BarChartItem[];
  /** Upper bound the values are shares of. Defaults to the sum of every item's value. */
  max?: number;
  /** Format the numeric value in the label. Defaults to `toLocaleString()`. */
  valueFormatter?: (value: number) => string;
  /** Show the hover tooltip per row. On by default. */
  showTooltip?: boolean;
  /** Tooltip content shared by every row (replaces the default). Ignored when `showTooltip` is false. */
  tooltip?: React.ReactNode;
  /**
   * Dataviz palette to resolve each item's color from. When provided, each
   * `items` entry should carry a `tone` (and can omit `color`). The colors are
   * resolved in the same order and with the same tone rules as the vertical
   * chart — `status` tones pick a specific palette stop, slot-less items
   * consume the next available stop.
   */
  palette?: ChartPalette;
}

/**
 * Unified BarChart props — `orientation` selects what gets rendered:
 * - omitted / `'vertical'`: the recharts bar chart (axes, grid, legend).
 * - `'horizontal'`: the labelled proportional bar list.
 */
export type BarChartProps = BarChartVerticalProps | BarChartHorizontalProps;

const defaultFormat = (value: number) => value.toLocaleString();

/**
 * One labelled bar. Base UI's `Meter` primitive supplies `role="meter"` and the
 * indicator's proportional width; the row is not a control, so the only reason
 * it takes focus is to make the tooltip reachable without a pointer.
 */
function HorizontalBarRow({
  item,
  resolvedColor,
  max,
  valueFormatter,
  showTooltip,
  tooltip,
}: {
  item: BarChartItem;
  resolvedColor: string;
  max: number;
  valueFormatter: (value: number) => string;
  showTooltip: boolean;
  tooltip?: React.ReactNode;
}) {
  const { label, value, forecast } = item;
  const color = resolvedColor;
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const hasForecast = forecast != null && forecast > value;

  const root = (
    <MeterPrimitive.Root
      value={value}
      max={max}
      aria-valuemax={max}
      aria-valuetext={
        hasForecast
          ? `${valueFormatter(value)} of ${valueFormatter(max)} (${pct}%), forecast ${valueFormatter(forecast)}`
          : `${valueFormatter(value)} of ${valueFormatter(max)} (${pct}%)`
      }
      tabIndex={showTooltip ? 0 : undefined}
      className="flex w-full flex-col gap-1.5"
    >
      <div className="flex items-baseline justify-between gap-2 text-sm leading-none">
        <MeterPrimitive.Label className="truncate font-semibold">
          {label}
        </MeterPrimitive.Label>
        <span className="shrink-0 tabular-nums">
          <span className="font-semibold text-[var(--ui-text-on-surface-link-idle)]">
            {valueFormatter(value)}
          </span>
          <span className="text-muted-foreground"> {pct}%</span>
        </span>
      </div>
      <MeterPrimitive.Track className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--ui-background-status-neutral-pressed)]">
        {hasForecast && (
          <div
            data-forecast
            className="absolute inset-y-0 start-0 rounded-full"
            style={{
              backgroundColor: color,
              opacity: 0.3,
              width: `${(forecast / max) * 100}%`,
            }}
          />
        )}
        <MeterPrimitive.Indicator
          className="relative rounded-full"
          style={{ backgroundColor: color }}
        />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  );

  if (!showTooltip) return root;

  return (
    <Tooltip>
      <TooltipTrigger render={root} />
      <TooltipContent
        className={cn(
          'border border-border bg-background text-foreground shadow-md',
          !tooltip && 'flex items-center gap-2'
        )}
      >
        {tooltip ?? (
          <>
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="font-semibold">{label}</span>
            <span className="text-muted-foreground">
              {valueFormatter(value)} of {valueFormatter(max)} · {pct}%
            </span>
          </>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

const HorizontalBarLayout = React.forwardRef<
  HTMLDivElement,
  Omit<BarChartHorizontalProps, 'orientation'>
>(
  (
    {
      items,
      max,
      palette,
      valueFormatter = defaultFormat,
      showTooltip = true,
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    // A max of 0 (or a negative one) would make every share meaningless, so it
    // falls back to the total — and to 1 when even that is 0, so the rows read
    // as empty rather than dividing by zero.
    const safeMax =
      max !== undefined && max > 0
        ? max
        : items.reduce((sum, item) => sum + item.value, 0) || 1;

    // When a palette is supplied, resolve each item's color through the same
    // palette machinery as the vertical chart — a synthetic config maps each
    // item's index key to its tone (or explicit color as a pinned stop).
    const resolvedColors = React.useMemo(() => {
      if (!palette) return null;
      // Items with an explicit `color` bypass the palette; items with `tone`
      // (or neither) are resolved through `resolveChartColors`.
      const config: ChartConfig = Object.fromEntries(
        items.map((item, i) => [
          `item${i}`,
          { label: item.label, ...(item.tone ? { tone: item.tone } : {}) },
        ])
      );
      const resolved = resolveChartColors(config, palette);
      return items.map((item, i) => item.color ?? resolved[`item${i}`]?.color ?? '');
    }, [items, palette]);

    return (
      <div
        ref={ref}
        data-orientation="horizontal"
        className={cn('flex flex-col gap-4', className)}
        {...props}
      >
        {items.map((item, i) => (
          <HorizontalBarRow
            key={`${i}-${item.label}`}
            item={item}
            resolvedColor={resolvedColors ? (resolvedColors[i] ?? '') : (item.color ?? '')}
            max={safeMax}
            valueFormatter={valueFormatter}
            showTooltip={showTooltip}
            tooltip={tooltip}
          />
        ))}
      </div>
    );
  }
);
HorizontalBarLayout.displayName = 'HorizontalBarLayout';

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (rawProps, ref) => {
    // useId must be called unconditionally before any early return (Rules of Hooks).
    const instanceId = React.useId().replace(/:/g, '');

    if (rawProps.orientation === 'horizontal') {
      const { orientation: _orientation, ...horizontalProps } = rawProps;
      return <HorizontalBarLayout {...horizontalProps} ref={ref} />;
    }

    const {
      className,
      config,
      palette,
      data,
      dataKeys,
      xKey,
      referenceLine,
      referenceArea,
      barSettings,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      // Consumed rather than spread: a literal `orientation` attribute on the
      // wrapper `<div>` is not a valid DOM prop.
      orientation = 'vertical',
      layout = 'grouped',
      barRadius = 8,
      barShape = 'rounded',
      barSize = 8,
      maxBarSize,
      barGap = 4,
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
      gridDashed = true,
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
    } = rawProps;

    const animation = resolveAnimation({
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
    });
    // recharts' `layout` names the axis the *categories* run along, which for
    // bars rising out of an X axis is its `'horizontal'`.
    const rechartsLayout = 'horizontal';
    const isStacked = layout === 'stacked';
    // Labels sit at the growing end of the bar — above it — or centred in the
    // segment when stacked.
    const barLabelPosition = resolveCartesianLabelPosition({
      labelPosition,
      isStacked,
      growingEnd: 'top',
    });

    const referenceLines = toReferenceLineList(referenceLine);

    // Bands + the per-series overrides resolved to inclusive row indices once,
    // so the Cells below are a lookup rather than a search per bar.
    const referenceAreas = (
      referenceArea
        ? Array.isArray(referenceArea)
          ? referenceArea
          : [referenceArea]
        : []
    )
      .map((area) => ({ area, range: resolveCategoryRange(area, data, xKey) }))
      .filter(
        (entry): entry is { area: BarChartReferenceArea; range: [number, number] } =>
          entry.range !== undefined
      );

    const settingsByKey = new Map(
      dataKeys.flatMap((key) => {
        const settings = barSettings?.[key];
        const range = settings
          ? resolveCategoryRange(settings, data, xKey)
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

    // The ticks under a band pick up the accent styling unless the band opts
    // out. Resolved to the categories' own values rather than kept as row
    // indices, because neither index a tick carries can be trusted here: the
    // `index` prop is a position in the list recharts actually renders, which
    // a numeric `interval` (and the default `preserveEnd`, dropping labels that
    // don't fit) has already filtered, and `payload.index` is relative to the
    // slice a `showBrush` selection leaves. The value survives both.
    const highlightedValues = new Set(
      referenceAreas
        .filter(({ area }) => area.highlightTicks !== false)
        .flatMap(({ range }) =>
          data.slice(range[0], range[1] + 1).map((row) => row[xKey])
        )
    );

    // recharts places the tick and hands the element its final geometry; we
    // reuse its own <Text> so angle/anchor behavior is unchanged and only add
    // the accent styling for the highlighted range. The formatter still takes
    // the rendered position, since that is what recharts passes its own
    // `tickFormatter`.
    const categoryTick = highlightedValues.size
      ? ({
          payload,
          index,
          ...tickProps
        }: {
          payload: { value: string | number };
          index: number;
        }) => {
          const value = xTickFormatter
            ? xTickFormatter(payload.value as never, index)
            : payload.value;
          return (
            <Text
              {...tickProps}
              className={cn(
                'fill-muted-foreground',
                highlightedValues.has(payload.value) && 'fill-primary italic'
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

    // `gradient` and `pattern` paint from an SVG def, so the ids have to be
    // unique per chart instance — same guard the shared container applies.
    const defsId = `bar-${instanceId}`;
    const usedShapes = new Set<BarChartBarShape>([barShape]);
    settingsByKey.forEach(({ settings }) => {
      if (settings.shape) usedShapes.add(settings.shape);
    });
    // recharts applies a flat minPointSize to zeroes too, which would draw a
    // sliver where there is nothing to show. For a grouped bar it hands the
    // callback the row's own value, but inside a stack it hands the running
    // total, so a zero segment riding on a non-zero stack would slip through —
    // there the value is read back off the row instead. That read uses the
    // index recharts counts from the *displayed* slice, so a stacked chart
    // whose brush has been dragged off its full range falls back to flooring
    // the zero; the plain (unbrushed) stack, which is what the prop is for, is
    // exact.
    const minPointSizeFor = (key: string) =>
      minPointSize === undefined
        ? undefined
        : (top: number | undefined | null, row: number) => {
            const own = isStacked ? chartData[row]?.[key] : top;
            return typeof own === 'number' && own !== 0 ? minPointSize : 0;
          };

    const fillOf = (key: string, shape: BarChartBarShape) =>
      shape === 'gradient'
        ? `url(#${defsId}-gradient-${key})`
        : shape === 'pattern'
          ? `url(#${defsId}-pattern-${key})`
          : `var(--color-${key})`;

    // Axis titles: the X title sits below the ticks; the Y title is rotated in
    // the left gutter. Passed to recharts' native `label` (themed via the
    // `.recharts-label` fill selector on the container).
    const xAxisTitle = resolveXAxisTitle(xAxisLabel);
    const yAxisTitle = resolveYAxisTitle(yAxisLabel);

    const yDomain = resolveAxisDomain(yAxisDomain);

    const xAxisHeight = resolveXAxisHeight(xAxisLabel, xAxisAngle);

    // Round only the growing end — the top of the bar.
    const endRadius: [number, number, number, number] = [
      barRadius,
      barRadius,
      0,
      0,
    ];
    // A pill rounds every corner; recharts clamps the radius to half the bar's
    // shorter side, so an oversized number gives a true capsule at any width.
    const radiusFor = (shape: BarChartBarShape, rounded: boolean) =>
      shape === 'pill'
        ? 9999
        : barRadius > 0 && rounded
          ? endRadius
          : undefined;

    // Both take the normalization unconditionally: gating it on "is a
    // headroom/paint-server series in play" is what let the legend's ordering
    // drift between otherwise identical charts. The helpers are no-ops when
    // there is nothing to strip or recolor.
    const tooltipElement = (
      <NormalizedTooltipContent content={tooltipContent} dataKeys={dataKeys} />
    );
    const legendElement = <NormalizedLegendContent dataKeys={dataKeys} />;

    // The long chart children are lifted into these renderers so the returned
    // tree reads as a flat list. They are plain functions, not components:
    // recharts looks some of its children up by element type (see `rangeCells`
    // above), so what they return has to stay a *direct* child — an array or a
    // fragment is flattened, a component wrapper would not be.

    // The categories run along X and the values along Y, so the category props
    // (dataKey/tick) belong to the X axis and the value props
    // (unit/tickCount/domain) to the Y axis — recharts ignores each set on the
    // other axis.
    const renderAxes = () => (
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

    const renderSeries = () =>
      dataKeys.map((key, index) => {
        // In a stack only the last segment's end is rounded; grouped bars
        // each round their own end.
        const rounded = isStacked ? index === dataKeys.length - 1 : true;
        const entry = settingsByKey.get(key);
        const inRange = (row: number) =>
          entry !== undefined && row >= entry.range[0] && row <= entry.range[1];
        const headroomKey = headroomKeys.get(key);
        const { shape, activeBar: activeBarShape } = resolveBarShapes({
          rangeBackground: entry?.settings.background === true,
          inRange,
          trackFill: backgroundFill,
          activeBarOption,
        });
        const cells =
          entry &&
          rangeCells({
            data,
            chartData,
            xKey,
            seriesKey: key,
            settings: entry.settings,
            range: entry.range,
            headroomKey,
            barShape,
            rounded,
            fillOf,
            radiusFor,
          });
        const labels = showLabels && (
          <LabelList
            dataKey={key}
            position={barLabelPosition}
            formatter={toLabelFormatter(labelFormatter)}
            className={resolveLabelFillClass(barLabelPosition)}
            fontSize={CHART_LABEL_FONT_SIZE}
          />
        );
        return (
          <React.Fragment key={key}>
            <Bar
              dataKey={key}
              fill={fillOf(key, barShape)}
              // Its own stack, so the headroom sits on this series' bar
              // while the series stay side by side.
              stackId={isStacked ? 'a' : headroomKey ? key : undefined}
              radius={radiusFor(barShape, rounded)}
              minPointSize={minPointSizeFor(key)}
              background={showBackground ? { fill: backgroundFill } : undefined}
              shape={shape}
              activeBar={activeBarShape}
              {...animation}
            >
              {cells}
              {labels}
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
      });

    const renderReferenceAreas = () =>
      referenceAreas.map(({ area, range }, index) => {
        const [start, end] = range;
        return (
          <ReferenceArea
            key={`${area.label ?? 'area'}-${index}`}
            // Bands run along the category axis, which is X.
            x1={data[start]?.[xKey]}
            x2={data[end]?.[xKey]}
            fill="var(--ui-background-surface-secondary)"
            fillOpacity={0.6}
            ifOverflow="extendDomain"
            shape={resolveBandShape(area.divider)}
            label={resolveBandLabel(area.label)}
          />
        );
      });

    const renderReferenceLines = () =>
      referenceLines.map((ref, index) => {
        const value = resolveChartReferenceValue(ref, data, dataKeys);
        if (value === undefined) return null;
        return (
          <ReferenceLine
            key={`${ref.label ?? 'ref'}-${index}`}
            // Drawn on the value axis, which is Y.
            y={value}
            // By default the caption sits above the line's right end.
            {...resolveReferenceLineProps(
              ref.label,
              ref.labelPosition ?? 'insideTopRight'
            )}
          />
        );
      });

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
          palette={palette}
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
            <BarPaintServers id={defsId} dataKeys={dataKeys} shapes={usedShapes} />
            {showGrid && (
              <CartesianGrid
                horizontal={gridHorizontal ?? true}
                vertical={gridVertical ?? false}
                strokeDasharray={gridDashed ? '3 3' : undefined}
              />
            )}
            {renderAxes()}
            {showTooltip && <ChartTooltip content={tooltipElement} />}
            {showLegend && <ChartLegend content={legendElement} />}
            {renderSeries()}
            {renderReferenceAreas()}
            {renderReferenceLines()}
            {showBrush && (
              <Brush
                dataKey={xKey}
                // The brush slices rows by index, so its captions come from the
                // axis holding the categories — X.
                tickFormatter={xTickFormatter}
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
