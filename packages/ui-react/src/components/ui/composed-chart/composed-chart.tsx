'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  LabelList,
  Line,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  CHART_LABEL_FONT_SIZE,
  CHART_LABEL_MARGIN,
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
  toLabelFormatter,
  type ChartConfig,
  type ChartPalette,
  type ChartLegendContentProps,
  type CartesianChartProps,
  type ChartAnimationProps,
  type ChartBrushProps,
  type ChartCategoryRange,
  type ChartDataLabelProps,
  type ChartReferenceLine,
  type CartesianLabelPosition,
  type ChartYAxisTarget,
  type SecondaryYAxisProps,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. A composed
// chart's defining trait is that each series picks its own render type
// (bar / line / area) over one shared category axis, so the mark mix is not a
// variant — it lives in the `series[].type` list. `orientation` is: it is the
// same one-axis choice `BarChart` models (which way the marks grow), and it
// re-roles both axes. The class stays empty because the recharts SVG — not CSS —
// draws the series; CVA is kept so the variant set is a first-class,
// spec-conformant part of the API (matched against ui-spec's api.yaml enums) and
// exposed via `VariantProps`. The resolved value is mirrored onto
// `data-orientation` for styling hooks and tests.
const composedChartVariants = cva('', {
  variants: {
    orientation: {
      vertical: '',
      horizontal: '',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type ComposedSeriesType = 'bar' | 'line' | 'area';

/** Interpolation for a line or area series. */
export type ComposedCurveType = 'linear' | 'monotone' | 'step';

/**
 * How a series is marked in the legend. Deliberately narrower than recharts'
 * icon set: `ChartLegendContent` draws its own marker and reads only whether the
 * entry is a `line` (a rule, dashed when the series is) or anything else (a
 * swatch), so the wider union would advertise icons that never render. `none`
 * keeps the series off the legend entirely.
 */
export type ComposedSeriesLegendType = 'line' | 'rect' | 'none';

/** Plot-area inset, in px. Any side left out keeps the chart's own default. */
export interface ComposedChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

// recharts 3 paints graphical items into z-index layers keyed by their *type*
// (Area 100, Bar 300, Line 400), so JSX order alone decides nothing across
// types — an area would always sit under the bars however the caller ordered
// `series`. Giving each entry an explicit z-index from its index restores
// "later entry paints on top". The band stays under the axis layer (500).
const SERIES_Z_INDEX_BASE = 100;

// A reference band is a backdrop, so it has to sit under the marks. That is
// recharts' own arrangement (its band defaults to 100, below Bar's 300), but
// pulling the series down into the 100s to order them by array index lands them
// on the band's layer — where the band, rendered later, would paint over them.
// Below the series and above the grid (-100) restores the intent. A reference
// *line* keeps its own default (400): a rule reads as an annotation on top.
const REFERENCE_AREA_Z_INDEX = 50;

// recharts keys every axis by id, defaulting to `0` on both the axis and each
// graphical item. The primary value axis keeps that implicit id rather than
// taking an explicit one, so a chart with no secondary series renders
// byte-identically — and `CartesianGrid` (whose own ids default to `0`) keeps
// drawing its lines against the primary scale, which is the only readable
// choice: gridlines from two different scales would cross at meaningless
// heights.
const SECONDARY_VALUE_AXIS_ID = 'secondary';

// recharts' own plot inset, spelled out so a caller-supplied `margin` can
// override one side without erasing the other three.
const DEFAULT_CHART_MARGIN = { top: 5, right: 5, bottom: 5, left: 5 } as const;

/** Fill opacity of a hovered bar when `showActiveBar` is on. */
const ACTIVE_BAR_FILL_OPACITY = 0.85;

// Headroom for the caption a vertical reference rule hangs above the plot. Sized
// to the 12px caption plus its descender, matching CHART_LABEL_MARGIN's top.
const REFERENCE_LABEL_MARGIN = { top: 16 } as const;

export interface ComposedSeries {
  /** Column key to plot — must match a `config` entry; drives its `--color-<key>` paint. */
  key: string;
  /** How this series renders. */
  type: ComposedSeriesType;
  /**
   * Which value axis this series is measured against. Defaults to `primary`.
   * The secondary axis is rendered only when at least one series selects it — use
   * it when a series carries a different unit or magnitude (a rate next to a
   * count) that a shared scale would flatten.
   */
  yAxis?: ChartYAxisTarget;
  /**
   * Paint for this series, overriding its `config` color. Reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  color?: string;
  /**
   * Stack this series with every other series of the *same mark type* carrying
   * the same id. Bars stack with bars and areas with areas — the ids are
   * namespaced per type, so one id can't merge a bar into an area stack. Ignored
   * on a line series, which recharts does not stack.
   */
  stackId?: string;
  /** Interpolation, overriding the chart's `curve`. Line and area series only. */
  curve?: ComposedCurveType;
  /**
   * Stroke width, overriding the chart's `strokeWidth` on a line or area series.
   * On a bar it sizes the dashed outline `strokeDasharray` draws — a bar has no
   * other stroke, so the chart-level default never reaches one and this is the
   * only way to set it.
   */
  strokeWidth?: number;
  /**
   * Dash pattern for the stroke (an SVG `stroke-dasharray`, e.g. `'5 5'`) — the
   * conventional way to mark a series as a projection. On a bar series it draws a
   * dashed outline in the series colour.
   */
  strokeDasharray?: string;
  /** Render a dot at each point, overriding the chart's `showDots`. Line and area series only. */
  showDots?: boolean;
  /** Render the hover dot, overriding the chart's `showActiveDots`. Line and area series only. */
  showActiveDots?: boolean;
  /** Bridge `null` gaps instead of breaking the series, overriding `connectNulls`. */
  connectNulls?: boolean;
  /** Corner radius on the growing end, overriding the chart's `barRadius`. Bar series only. */
  barRadius?: number;
  /** Fixed bar thickness in px, overriding the chart's `barSize`. Bar series only. */
  barSize?: number;
  /** Highlight this bar on hover, overriding the chart's `showActiveBar`. Bar series only. */
  showActiveBar?: boolean;
  /** Draw a full-height track behind this series' bars, overriding `showBackground`. Bar series only. */
  showBackground?: boolean;
  /** Fill opacity, overriding the chart's `fillOpacity` (which applies to area series). */
  fillOpacity?: number;
  /** How this series is marked in the legend — `none` keeps it off the legend. */
  legendType?: ComposedSeriesLegendType;
}

/**
 * A dashed rule on the chart. Either a position on the *value* axis (a fixed
 * `value`, or the mean of one/every series via `average`) or, with `category`, a
 * rule across the *category* axis at one category — the "today" divider between
 * actuals and forecast. A value position wins if both are given.
 */
export interface ComposedChartReferenceLine extends ChartReferenceLine {
  /**
   * Category to draw the rule at — the category's own value (an `xKey` cell) or
   * its 0-based row index.
   */
  category?: string | number;
  /**
   * Which value axis the rule is measured against, on a chart carrying two.
   * Defaults to the axis of the series named by `average`, and to `primary`
   * otherwise — so a target read off the secondary scale lands on it rather
   * than being plotted against the primary one. `average: true` then pools only
   * the series on this axis, never two scales at once. Inert while no series
   * selects the secondary axis.
   */
  yAxis?: ChartYAxisTarget;
}

/** A shaded band behind a range of categories. */
export interface ComposedChartReferenceArea extends ChartCategoryRange {
  /** Caption above the band. */
  label?: string;
}

export interface ComposedChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof composedChartVariants>,
    CartesianChartProps,
    SecondaryYAxisProps,
    ChartAnimationProps,
    ChartBrushProps,
    ChartDataLabelProps {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** Row-per-category data. Each object holds `xKey` + one numeric field per series (`null` breaks a line/area unless `connectNulls`). */
  data: ReadonlyArray<Record<string, string | number | null>>;
  /**
   * Per-series map of `label` / `color`, keyed by `series[].key` (imported from
   * the shared `Chart` primitives). Turned into `--color-<key>` custom
   * properties. Colors are caller-supplied — reference an existing semantic
   * `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /**
   * Series to plot, each `{ key, type }` plus any per-series style override —
   * one bar/line/area per entry. Each key must exist in `config` and every data
   * row. Every styling prop on the chart is the default a series overrides here.
   */
  series: ComposedSeries[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /**
   * One or more dashed reference lines — on a value axis (`value` / `average`,
   * placed by the entry's `yAxis`) or across the category axis (`category`).
   * Pass a single object or an array.
   */
  referenceLine?: ComposedChartReferenceLine | ComposedChartReferenceLine[];
  /**
   * One or more shaded bands behind a range of categories — e.g. a forecast
   * period. Pass a single object or an array to draw several.
   */
  referenceArea?: ComposedChartReferenceArea | ComposedChartReferenceArea[];
  /** Unit suffix on the value-axis tick values when it is X (`orientation="horizontal"`). */
  xUnit?: string;
  /** Interpolation for the line and area series. */
  curve?: ComposedCurveType;
  /** Corner radius on the growing end of bar series. */
  barRadius?: number;
  /** Fixed bar thickness, in px. Unset, recharts sizes bars from the available width. */
  barSize?: number;
  /** Gap between bars of the same category, in px or a percentage string. */
  barGap?: number | string;
  /** Gap between category groups, in px or a percentage string. */
  barCategoryGap?: number | string;
  /** Draw a full-height track behind every bar. */
  showBackground?: boolean;
  /** Fill for the track background. Defaults to the secondary surface. */
  backgroundFill?: string;
  /** Highlight the hovered bar. */
  showActiveBar?: boolean;
  /** Flat-fill opacity for area series. */
  fillOpacity?: number;
  /** Stroke width for the line series. Areas keep recharts' thinner outline unless set. */
  strokeWidth?: number;
  /** Render a dot at each point of the line and area series. */
  showDots?: boolean;
  /** Render the hover dot on the line and area series. Unset, recharts' own default applies. */
  showActiveDots?: boolean;
  /** Bridge `null` gaps in the data instead of breaking the line/area. */
  connectNulls?: boolean;
  /** Plot-area inset. Any side left out keeps the chart's own default. */
  margin?: ComposedChartMargin;
  /** Draw the hover cursor (the band/rule under the tooltip). Defaults to `true`. */
  tooltipCursor?: boolean;
  showLegend?: boolean;
  /** Which edge the legend sits on. Defaults to `bottom`. */
  legendPosition?: 'top' | 'bottom';
  /**
   * Position of the value labels when `showLabels` is on. Defaults to each
   * series' growing end — `top` (or `right` when horizontal), and the centre of
   * a stacked segment, which has no free space at its end.
   */
  labelPosition?: CartesianLabelPosition;
}

// recharts types a legend's `content` as an element *or* a render function.
// Naming that union is what lets the content be built above the returned tree
// (see `legendContent`) without hand-typing the props the render form is given.
type LegendContentType = NonNullable<
  React.ComponentProps<typeof ChartLegend>['content']
>;

const ComposedChart = React.forwardRef<HTMLDivElement, ComposedChartProps>(
  (
    {
      className,
      config,
      palette,
      data,
      series,
      xKey,
      referenceLine,
      referenceArea,
      orientation = 'vertical',
      xAxisLabel,
      yAxisLabel,
      xUnit,
      yUnit,
      curve = 'monotone',
      barRadius = 4,
      barSize,
      barGap,
      barCategoryGap,
      showBackground = false,
      backgroundFill = 'var(--ui-background-surface-secondary)',
      showActiveBar = false,
      fillOpacity = 0.3,
      strokeWidth,
      showDots = false,
      showActiveDots,
      connectNulls = false,
      margin,
      showGrid = true,
      showTooltip = true,
      tooltipCursor = true,
      showLegend = true,
      legendPosition = 'bottom',
      showXAxis = true,
      showYAxis = true,
      xTickFormatter,
      yTickFormatter,
      xAxisAngle,
      xAxisInterval,
      yAxisTickCount,
      yAxisDomain,
      yAxisOrientation,
      showSecondaryYAxis = true,
      secondaryYAxisLabel,
      secondaryYUnit,
      secondaryYTickFormatter,
      secondaryYAxisTickCount,
      secondaryYAxisDomain,
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
    // Our `orientation` is the direction the marks grow; recharts' `layout` is
    // the opposite axis. Horizontal puts the categories on Y and the values on X,
    // which re-roles every axis prop below.
    const isHorizontal = orientation === 'horizontal';
    // Axis titles: the X title sits below the ticks; the Y title is rotated in
    // the side gutter. Passed to recharts' native `label` (themed via the
    // `.recharts-label` fill selector on the container).
    const xAxisTitle = resolveXAxisTitle(xAxisLabel);
    // The secondary axis is derived from the series, not from a flag of its own:
    // that keeps a series from pointing at an id no axis declares, where recharts
    // falls back to an implicit axis — the series still scales off its own data, but
    // silently loses the domain/tickCount/formatter/unit that axis was configured
    // with, and renders no chrome for it.
    const hasSecondaryValueAxis = series.some((s) => s.yAxis === 'secondary');
    // The mirror case the `series` opt-in can't rule out on its own: every series
    // asks for the secondary axis, leaving the primary one with nothing measured
    // against it. recharts gives an axis with no graphical items no ticks at all, so
    // it paints a blank gutter and `CartesianGrid` — which follows it — collapses to
    // the two plot boundaries. Hand the gutter and the grid to the axis that does
    // have the series. Both conditionals are inert on every other chart shape, so
    // single-axis output is untouched.
    const hasPrimarySeries = series.some((s) => s.yAxis !== 'secondary');
    const primaryValueAxisIsOrphaned = hasSecondaryValueAxis && !hasPrimarySeries;
    const primaryOrientation = yAxisOrientation ?? 'left';
    const secondaryOrientation = primaryOrientation === 'left' ? 'right' : 'left';

    // The category axis is pinned to the left when the marks grow horizontally,
    // so its title is angled for that side whatever `yAxisOrientation` says.
    const yAxisTitle = resolveYAxisTitle(
      yAxisLabel,
      isHorizontal ? 'left' : primaryOrientation
    );
    const secondaryYAxisTitle = resolveYAxisTitle(
      secondaryYAxisLabel,
      secondaryOrientation
    );
    // Horizontal puts the second scale on a top X axis, where a rotated title
    // would read sideways over the plot.
    const secondaryXAxisTitle = resolveXAxisTitle(
      secondaryYAxisLabel,
      'insideTop'
    );

    const yDomain = resolveAxisDomain(yAxisDomain);
    const secondaryYDomain = resolveAxisDomain(secondaryYAxisDomain);

    // Which axis a series (or the grid, or a reference element) binds to. The
    // value axis is Y by default and X when horizontal; the primary one keeps
    // recharts' implicit id `0` — `resolveDefaultProps` fills the `undefined` in —
    // so a series that opts out of the secondary axis passes exactly what it
    // passed before that axis existed.
    const valueAxisBinding = (target: ChartYAxisTarget | undefined) => {
      const id = target === 'secondary' ? SECONDARY_VALUE_AXIS_ID : undefined;
      return isHorizontal ? { xAxisId: id } : { yAxisId: id };
    };
    // Spread (rather than passed as an `undefined` prop) so the primary case
    // reorders nothing: see the `orientation` note on the primary axis below.
    const orphanedAxisBinding = primaryValueAxisIsOrphaned
      ? valueAxisBinding('secondary')
      : {};

    const xAxisHeight = resolveXAxisHeight(xAxisLabel, xAxisAngle);

    const referenceLines = referenceLine
      ? Array.isArray(referenceLine)
        ? referenceLine
        : [referenceLine]
      : [];
    const referenceAreas = (
      referenceArea
        ? Array.isArray(referenceArea)
          ? referenceArea
          : [referenceArea]
        : []
    )
      .map((area) => ({ area, range: resolveCategoryRange(area, data, xKey) }))
      .filter(
        (
          entry
        ): entry is { area: ComposedChartReferenceArea; range: [number, number] } =>
          entry.range !== undefined
      );
    // A reference rule belongs to one scale, so both halves of it — which keys
    // an `average` pools, and which axis the result is plotted against — have to
    // agree. When the primary axis is orphaned every series is on the secondary
    // one, so that becomes the default rather than leaving `average: true` with
    // an empty key set.
    const defaultReferenceAxis: ChartYAxisTarget = primaryValueAxisIsOrphaned
      ? 'secondary'
      : 'primary';
    const seriesAxisOf = (s: ComposedSeries) => s.yAxis ?? 'primary';
    const seriesAxisByKey = new Map(series.map((s) => [s.key, seriesAxisOf(s)]));
    const seriesKeysOn = (target: ChartYAxisTarget) =>
      series.filter((s) => seriesAxisOf(s) === target).map((s) => s.key);
    const hiddenLegendKeys = new Set(
      series.filter((s) => s.legendType === 'none').map((s) => s.key)
    );
    // The axis position a band/rule is placed at. `?? undefined` because a row
    // whose category cell is null has no position on the axis — recharts types
    // its reference coordinates as `string | number`.
    const categoryAt = (row: number) => data[row]?.[xKey] ?? undefined;

    // Resolved up here, not inside the map, because the plot margin below has to
    // know whether any rule will hang a caption above the plot.
    const resolvedReferenceLines = referenceLines
      .map((line) => {
        // A category rule is placed by the category's own value, so an index
        // bound is resolved back to it first.
        const categoryRange =
          line.category !== undefined
            ? resolveCategoryRange(
                { from: line.category, to: line.category },
                data,
                xKey
              )
            : undefined;
        // An `average` naming one series is read off that series' own scale
        // unless the caller says otherwise; anything else falls back to the
        // chart's default axis.
        const lineAxis =
          line.yAxis ??
          (typeof line.average === 'string'
            ? (seriesAxisByKey.get(line.average) ?? defaultReferenceAxis)
            : defaultReferenceAxis);
        const value = resolveChartReferenceValue(line, data, seriesKeysOn(lineAxis));
        const category = categoryRange
          ? categoryAt(categoryRange[0])
          : undefined;
        // The value position wins when both are given; a category that resolves
        // to nothing (an unknown bound) draws no rule.
        const position =
          value !== undefined
            ? isHorizontal
              ? { x: value }
              : { y: value }
            : category !== undefined
              ? isHorizontal
                ? { y: category }
                : { x: category }
              : undefined;
        // A value rule runs across the value axis, so it is drawn vertical
        // exactly when the values are on X — and a category rule the other way
        // round.
        const isVerticalRule = (value !== undefined) === isHorizontal;
        return { line, lineAxis, position, isVerticalRule };
      })
      .filter(
        (
          entry
        ): entry is typeof entry & { position: Record<string, string | number> } =>
          entry.position !== undefined
      );

    // Line/area series don't clamp their labels to the plot (see
    // CHART_LABEL_MARGIN); a composed chart can hold either. A caller-supplied
    // margin overrides that per side rather than replacing it, so asking for one
    // wider gutter can't silently drop the label headroom.
    const labelMargin = showLabels ? CHART_LABEL_MARGIN : undefined;
    // A vertical rule hangs its caption off the top end, outside the plot, where
    // recharts' 5px inset clips it — the same headroom problem CHART_LABEL_MARGIN
    // solves for data labels, so it is reserved the same way rather than left for
    // the caller to discover and pass a `margin` for.
    const referenceLabelMargin = resolvedReferenceLines.some(
      (entry) => entry.line.label && entry.isVerticalRule
    )
      ? REFERENCE_LABEL_MARGIN
      : undefined;
    const resolvedMargin =
      margin || labelMargin || referenceLabelMargin
        ? {
            ...(margin ? DEFAULT_CHART_MARGIN : {}),
            ...referenceLabelMargin,
            ...labelMargin,
            ...margin,
          }
        : undefined;

    // Only the segment at the growing end of a stack rounds its corners — the
    // ones below it butt against the next segment.
    const lastIndexInStack = new Map<string, number>();
    series.forEach((s, index) => {
      if (s.stackId && s.type !== 'line') {
        lastIndexInStack.set(`${s.type}-${s.stackId}`, index);
      }
    });

    // Everything from here to the `return` is lifted out of the returned tree
    // only to keep it readable as a flat list of chart children. Nothing in
    // recharts forces the `render*` helpers to be plain functions: axes and
    // series register themselves with the chart's store, and `<Cell>` is the
    // only child still looked up by element type — a component wrapper renders
    // fine (see AreaChart's `AreaFillGradients`). They stay functions because
    // they are declared inside the render body, where a component would get a
    // fresh element type on every render and remount its subtree.

    // The two orientations stay two whole blocks rather than one parameterised
    // axis pair: they swap which axis is `type="number"` and which carries the
    // categories, and they differ in props recharts treats as present-but-
    // undefined vs absent (see the `orientation` note below), which a shared
    // element would have to reintroduce prop by prop anyway.

    // Horizontal marks put the values on X, so the value-axis props
    // (unit/tickCount/domain) belong on the X axis here — recharts ignores them
    // on the category axis.
    const renderHorizontalAxes = () => (
      <>
        <XAxis
          type="number"
          hide={!showXAxis || primaryValueAxisIsOrphaned}
          tickLine={false}
          axisLine={false}
          unit={xUnit}
          tickFormatter={xTickFormatter}
          angle={xAxisAngle}
          interval={xAxisInterval}
          textAnchor={resolveRotatedTickAnchor(xAxisAngle)}
          tickCount={yAxisTickCount}
          domain={yDomain}
          height={xAxisHeight}
          label={xAxisTitle}
        />
        <YAxis
          dataKey={xKey}
          type="category"
          hide={!showYAxis}
          // `yAxisOrientation` picks the side of the *value* axis, which
          // is X here — a left/right choice it has no room for, and one
          // the secondary axis already spends on the top edge. Moving the
          // category axis with it instead would satisfy the prop name and
          // break its contract, so it stays inert in this orientation.
          tickLine={false}
          axisLine={false}
          tickFormatter={yTickFormatter}
          width={yAxisLabel ? 96 : 80}
          label={yAxisTitle}
        />
        {hasSecondaryValueAxis && (
          <XAxis
            xAxisId={SECONDARY_VALUE_AXIS_ID}
            type="number"
            hide={!showSecondaryYAxis}
            orientation="top"
            tickLine={false}
            axisLine={false}
            unit={secondaryYUnit}
            tickFormatter={secondaryYTickFormatter}
            tickCount={secondaryYAxisTickCount}
            domain={secondaryYDomain}
            label={secondaryXAxisTitle}
          />
        )}
      </>
    );

    const renderVerticalAxes = () => (
      <>
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
          textAnchor={resolveRotatedTickAnchor(xAxisAngle)}
          height={xAxisHeight}
          label={xAxisTitle}
        />
        <YAxis
          type="number"
          hide={!showYAxis || primaryValueAxisIsOrphaned}
          // Spread only when set. `orientation={undefined}` would resolve to the
          // same `left`, but the key's presence moves it ahead of `width` in the
          // props object recharts spreads onto its tick labels — reordering the
          // SVG attributes of every existing chart for no functional gain.
          {...(yAxisOrientation ? { orientation: yAxisOrientation } : {})}
          tickLine={false}
          axisLine={false}
          unit={yUnit}
          tickFormatter={yTickFormatter}
          tickCount={yAxisTickCount}
          domain={yDomain}
          width={yAxisLabel ? 72 : undefined}
          label={yAxisTitle}
        />
        {hasSecondaryValueAxis && (
          <YAxis
            yAxisId={SECONDARY_VALUE_AXIS_ID}
            type="number"
            hide={!showSecondaryYAxis}
            orientation={secondaryOrientation}
            tickLine={false}
            axisLine={false}
            unit={secondaryYUnit}
            tickFormatter={secondaryYTickFormatter}
            tickCount={secondaryYAxisTickCount}
            domain={secondaryYDomain}
            width={secondaryYAxisLabel ? 72 : undefined}
            label={secondaryYAxisTitle}
          />
        )}
      </>
    );

    // recharts keeps a `legendType="none"` series in the legend payload (it only
    // drops its icon), so hiding an entry is this filter's job — the same guard
    // `BarChart` applies to its synthetic series. Only wired up when a series
    // asks for it, so every other chart keeps the plain content element.
    const legendContent: LegendContentType =
      hiddenLegendKeys.size > 0
        ? (legendProps) => (
            <ChartLegendContent
              verticalAlign={legendPosition}
              payload={
                legendProps.payload?.filter(
                  (item) => !hiddenLegendKeys.has(String(item.dataKey))
                ) as ChartLegendContentProps['payload']
              }
            />
          )
        : <ChartLegendContent verticalAlign={legendPosition} />;

    const renderSeries = (s: ComposedSeries, index: number) => {
      const color = s.color ?? `var(--color-${s.key})`;
      const zIndex = SERIES_Z_INDEX_BASE + index;
      const axisBinding = valueAxisBinding(s.yAxis);
      const stackId =
        s.stackId && s.type !== 'line' ? `${s.type}-${s.stackId}` : undefined;
      const seriesFillOpacity = s.fillOpacity ?? fillOpacity;
      const seriesConnectNulls = s.connectNulls ?? connectNulls;
      const seriesShowDots = s.showDots ?? showDots;
      const seriesShowActiveDots = s.showActiveDots ?? showActiveDots;
      const seriesLegendType = s.legendType ? { legendType: s.legendType } : {};
      // A stacked segment has no free space at its growing end (the next
      // segment is drawn there), so its labels centre in their own
      // segment instead.
      const seriesLabelPosition = resolveCartesianLabelPosition({
        labelPosition,
        isStacked: stackId !== undefined,
        growingEnd: isHorizontal ? 'right' : 'top',
      });
      const label = showLabels ? (
        <LabelList
          dataKey={s.key}
          position={seriesLabelPosition}
          formatter={toLabelFormatter(labelFormatter)}
          className={resolveLabelFillClass(seriesLabelPosition, {
            translucentSeries: s.type === 'area',
          })}
          fontSize={CHART_LABEL_FONT_SIZE}
        />
      ) : null;

      if (s.type === 'bar') {
        const radius = s.barRadius ?? barRadius;
        const rounded =
          stackId === undefined || lastIndexInStack.get(stackId) === index;
        const barBackground = s.showBackground ?? showBackground;
        // recharts spreads the active option over the bar's own props, so
        // an explicit `undefined` fill would wipe the series color (an
        // unfilled path paints black) — only dim it.
        const barActive = s.showActiveBar ?? showActiveBar;
        return (
          <Bar
            key={s.key}
            dataKey={s.key}
            {...axisBinding}
            fill={color}
            radius={
              radius > 0 && rounded
                ? isHorizontal
                  ? [0, radius, radius, 0]
                  : [radius, radius, 0, 0]
                : undefined
            }
            zIndex={zIndex}
            {...(stackId ? { stackId } : {})}
            {...(s.barSize !== undefined ? { barSize: s.barSize } : {})}
            {...(s.fillOpacity !== undefined
              ? { fillOpacity: s.fillOpacity }
              : {})}
            // A bar has no outline of its own, so a dash pattern brings
            // one with it — in the series colour, at the series' stroke
            // width if it set one.
            {...(s.strokeDasharray !== undefined
              ? {
                  stroke: color,
                  strokeDasharray: s.strokeDasharray,
                  ...(s.strokeWidth !== undefined
                    ? { strokeWidth: s.strokeWidth }
                    : {}),
                }
              : {})}
            {...(barBackground ? { background: { fill: backgroundFill } } : {})}
            {...(barActive
              ? { activeBar: { fillOpacity: ACTIVE_BAR_FILL_OPACITY } }
              : {})}
            {...seriesLegendType}
            {...animation}
          >
            {label}
          </Bar>
        );
      }
      if (s.type === 'area') {
        const width = s.strokeWidth ?? strokeWidth;
        const areaStrokeWidth =
          width !== undefined ? { strokeWidth: width } : {};
        return (
          <Area
            key={s.key}
            type={s.curve ?? curve}
            dataKey={s.key}
            {...axisBinding}
            stroke={color}
            fill={color}
            fillOpacity={seriesFillOpacity}
            zIndex={zIndex}
            {...(stackId ? { stackId } : {})}
            // Areas keep recharts' own thinner outline unless a width is
            // asked for: the chart-level default exists for the lines,
            // where 2px is this suite's stroke.
            {...areaStrokeWidth}
            {...(s.strokeDasharray !== undefined
              ? { strokeDasharray: s.strokeDasharray }
              : {})}
            dot={seriesShowDots ? { r: 3 } : false}
            {...(seriesShowActiveDots !== undefined
              ? { activeDot: seriesShowActiveDots ? { r: 5 } : false }
              : {})}
            connectNulls={seriesConnectNulls}
            {...seriesLegendType}
            {...animation}
          >
            {label}
          </Area>
        );
      }
      return (
        <Line
          key={s.key}
          type={s.curve ?? curve}
          dataKey={s.key}
          {...axisBinding}
          stroke={color}
          strokeWidth={s.strokeWidth ?? strokeWidth ?? 2}
          dot={seriesShowDots ? { r: 3 } : false}
          zIndex={zIndex}
          {...(s.strokeDasharray !== undefined
            ? { strokeDasharray: s.strokeDasharray }
            : {})}
          {...(seriesShowActiveDots !== undefined
            ? { activeDot: seriesShowActiveDots ? { r: 5 } : false }
            : {})}
          connectNulls={seriesConnectNulls}
          {...seriesLegendType}
          {...animation}
        >
          {label}
        </Line>
      );
    };

    const renderReferenceArea = (
      { area, range }: (typeof referenceAreas)[number],
      index: number
    ) => {
      const [start, end] = range;
      return (
        <ReferenceArea
          key={`${area.label ?? 'area'}-${index}`}
          {...orphanedAxisBinding}
          // Bands run along the category axis: X by default, Y when the
          // marks grow horizontally.
          {...(isHorizontal
            ? { y1: categoryAt(start), y2: categoryAt(end) }
            : { x1: categoryAt(start), x2: categoryAt(end) })}
          fill="var(--ui-background-surface-secondary)"
          fillOpacity={0.6}
          zIndex={REFERENCE_AREA_Z_INDEX}
          ifOverflow="extendDomain"
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
    };

    const renderReferenceLine = (
      {
        line,
        lineAxis,
        position,
        isVerticalRule,
      }: (typeof resolvedReferenceLines)[number],
      index: number
    ) => (
      <ReferenceLine
        key={`${line.label ?? 'ref'}-${index}`}
        // Binding to an id no axis declares makes recharts invent an
        // implicit one (see `hasSecondaryValueAxis`), so the request is
        // only honored once a series has brought that axis into being.
        {...(lineAxis === 'secondary' && hasSecondaryValueAxis
          ? valueAxisBinding('secondary')
          : {})}
        {...position}
        // Caption at the top of the rule by default: above the right
        // end of a horizontal one, above the top of a vertical one
        // (which the plot margin reserves room for — see
        // REFERENCE_LABEL_MARGIN). A config's own `labelPosition`
        // overrides that, as on the other cartesian charts.
        {...resolveReferenceLineProps(
          line.label,
          line.labelPosition ?? (isVerticalRule ? 'top' : 'insideTopRight')
        )}
      />
    );

    return (
      <div
        ref={ref}
        data-orientation={orientation}
        className={cn(composedChartVariants({ orientation }), className)}
        {...props}
      >
        <ChartContainer
          config={config}
          palette={palette}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsComposedChart
            data={data as readonly unknown[]}
            layout={isHorizontal ? 'vertical' : 'horizontal'}
            barSize={barSize}
            barGap={barGap}
            barCategoryGap={barCategoryGap}
            margin={resolvedMargin}
          >
            {showGrid && (
              <CartesianGrid
                // Spread only when the primary axis has no series (see above) —
                // an explicit `undefined` id resolves to the same `0` but
                // reorders the grid's SVG attributes on every existing chart.
                {...orphanedAxisBinding}
                horizontal={gridHorizontal ?? !isHorizontal}
                vertical={gridVertical ?? isHorizontal}
                strokeDasharray={gridDashed ? '3 3' : undefined}
              />
            )}
            {isHorizontal ? renderHorizontalAxes() : renderVerticalAxes()}
            {showTooltip && (
              <ChartTooltip
                {...(tooltipCursor ? {} : { cursor: false })}
                content={tooltipContent ?? <ChartTooltipContent />}
              />
            )}
            {showLegend && (
              <ChartLegend
                verticalAlign={legendPosition}
                content={legendContent}
              />
            )}
            {/* Rendered back-to-front in the caller's `series` order — later
                entries sit on top. Order them so thin marks (a line) come after
                the areas/bars they should overlay. */}
            {series.map(renderSeries)}
            {referenceAreas.map(renderReferenceArea)}
            {resolvedReferenceLines.map(renderReferenceLine)}
            {showBrush && (
              <Brush
                dataKey={xKey}
                // The brush slices rows by index, so its captions come from
                // whichever axis holds the categories — Y when horizontal.
                tickFormatter={isHorizontal ? yTickFormatter : xTickFormatter}
                {...resolveBrushProps({ brushHeight, brushAriaLabel })}
              />
            )}
          </RechartsComposedChart>
        </ChartContainer>
      </div>
    );
  }
);
ComposedChart.displayName = 'ComposedChart';

export { ComposedChart, composedChartVariants };
