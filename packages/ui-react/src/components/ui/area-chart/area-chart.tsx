'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Brush,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  Text,
  XAxis,
  YAxis,
  useXAxisScale,
  usePlotArea,
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
  dropProjectionPayload,
  resolveChartReferenceValue,
  resolveLabelFillClass,
  resolveReferenceLineProps,
  resolveRotatedTickAnchor,
  resolveXAxisHeight,
  resolveXAxisTitle,
  resolveYAxisTitle,
  toLabelFormatter,
  toReferenceLineList,
  type ChartConfig,
  type ChartPalette,
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
// axes are the design's Area-chart variant set: `layout` (independent
// overlapping areas vs summed on a shared stack) and `fill` (a flat translucent
// fill vs a vertical gradient). The classes stay empty because recharts' SVG —
// not CSS — draws the areas: `layout` drives each `<Area>`'s `stackId` and `fill`
// drives whether it paints from a `<linearGradient>` def or a flat token color.
// CVA is kept so the variant set is a first-class, spec-conformant part of the
// API (matched against ui-spec's api.yaml enums) and exposed via `VariantProps`;
// the resolved values are also mirrored onto `data-layout` / `data-fill`.
const areaChartVariants = cva('', {
  variants: {
    layout: {
      single: '',
      stacked: '',
    },
    fill: {
      solid: '',
      gradient: '',
    },
  },
  defaultVariants: {
    layout: 'single',
    fill: 'solid',
  },
});

/**
 * Style override for one series, keyed by its `dataKeys` entry. Anything left
 * unset falls back to the chart-wide prop, so an entry only states what differs
 * — e.g. a projection band that reads fainter than the actuals beside it.
 */
export interface AreaChartAreaSettings {
  /** Stroke and fill color. Defaults to the series' `config` color. */
  color?: string;
  /** Width of this series' top border. Defaults to the chart's `strokeWidth`. */
  strokeWidth?: number;
  /** Dash this series' top border. */
  dashed?: boolean;
  /** Interpolation for this series only. Defaults to the chart's `curve`. */
  curveType?: ChartCurveType;
  /**
   * Fill opacity for this series. Under `fill="gradient"` it scales the
   * gradient's own alpha rather than replacing it.
   */
  fillOpacity?: number;
  /** Render this series' per-point dots. Defaults to the chart's `showDots`. */
  showDots?: boolean;
  /** Dot radius for this series, in px. Defaults to the chart's `dotSize`. */
  dotSize?: number;
  /** Show/hide this series' value labels, overriding the chart's `showLabels`. */
  showLabel?: boolean;
  /** Position of this series' value labels. Defaults to the chart's `labelPosition`. */
  labelPosition?: CartesianLabelPosition;
}

export interface AreaChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof areaChartVariants>,
    CartesianChartProps,
    ChartAnimationProps,
    ChartBrushProps,
    ChartDataLabelProps {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** Row-per-point data. Each object holds the category key + one numeric field per series (`null` breaks the area unless `connectNulls`). */
  data: ReadonlyArray<Record<string, string | number | null>>;
  /**
   * Per-series map of `label` / `icon` / `tone` (from the shared `Chart`
   * primitives). Series take their colour from the container's `palette`; each
   * entry maps a key to a `label` and an optional `tone`.
   */
  config: ChartConfig;
  /** Series to plot — one `<Area>` per key. Each must exist in `config` and in every data row. */
  dataKeys: string[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /** Interpolation between points. */
  curve?: ChartCurveType;
  /** Stroke width of each area's top border. */
  strokeWidth?: number;
  /** Flat-fill opacity — used only when `fill="solid"` (gradient controls its own stops). */
  fillOpacity?: number;
  /** Render a dot at each data point. */
  showDots?: boolean;
  /** Radius of each point's dot, in px. Its hover dot is 2px larger. */
  dotSize?: number;
  /**
   * Enlarge the hovered point's dot. Defaults to following `showDots`, so pass
   * it explicitly to get hover dots on a dot-less area (`showDots={false}` with
   * `showActiveDot`) or a static-only area (dots without the hover one).
   */
  showActiveDot?: boolean;
  /** Bridge `null` gaps in the data instead of breaking the area. */
  connectNulls?: boolean;
  /**
   * Per-series style overrides, keyed by `dataKeys` entry. Series with no entry
   * render from the chart-wide props.
   */
  areaSettings?: Record<string, AreaChartAreaSettings>;
  /**
   * One or more dashed reference/average lines on the value axis — a target, a
   * threshold, or a series mean. Pass a single object or an array to draw
   * several at once. On a stacked chart the value is read against the stack's
   * axis, not one series.
   */
  referenceLine?: ChartReferenceLine | ChartReferenceLine[];
  /**
   * The category value (matching an `xKey` entry) at which the projection
   * zone starts. Ticks from this point onward render in the disabled text
   * color (`--ui-text-on-surface-disabled`). The chart data and series
   * themselves are not affected — only the X-axis tick appearance changes.
   *
   * Use this when displaying a forecast/projection range where future
   * data points should be visually de-emphasized on the axis.
   */
  projectionStart?: string | number;
  showLegend?: boolean;
  /** Position of the value labels when `showLabels` is on. Defaults to `top`. */
  labelPosition?: CartesianLabelPosition;
}

type TooltipContentType = NonNullable<React.ComponentProps<typeof ChartTooltip>['content']>;
type TooltipContentFn = Extract<TooltipContentType, (...args: never[]) => unknown>;
type TooltipRenderProps = Parameters<TooltipContentFn>[0];
type LegendContentFn = Extract<
  React.ComponentProps<typeof ChartLegend>['content'],
  (...args: never[]) => unknown
>;
type LegendContentProps = Parameters<LegendContentFn>[0];

function createProjectionTooltip(tooltipContent: TooltipContentType) {
  return function ProjectionTooltip(props: TooltipRenderProps) {
    const merged = {
      ...props,
      payload: dropProjectionPayload(props.payload),
    } as TooltipRenderProps;
    return typeof tooltipContent === 'function'
      ? React.createElement(
          tooltipContent as React.FunctionComponent<TooltipRenderProps>,
          merged
        )
      : React.cloneElement(tooltipContent, merged);
  };
}

// Renders two <clipPath> defs (actual / projection) and a dashed separator
// line at the visual midpoint between the last actual tick and the first
// projection tick. Both the actual and projection <Area> series reference
// these clip regions, so the exact same curve renders on each side — no kink.
function ProjectionClip({
  projectionStart,
  prevTick,
  clipId,
}: {
  projectionStart: string | number;
  prevTick: string | number;
  clipId: string;
}) {
  const xScale = useXAxisScale();
  const plotArea = usePlotArea();
  if (!xScale || !plotArea) return null;
  const prevX = xScale(prevTick as string);
  const currX = xScale(projectionStart as string);
  if (prevX == null || currX == null) return null;
  const midX = (prevX + currX) / 2;
  const { x, y, width, height } = plotArea;
  return (
    <>
      <defs>
        <clipPath id={`${clipId}-actual`}>
          <rect x={x} y={y} width={midX - x} height={height} />
        </clipPath>
        <clipPath id={`${clipId}-projection`}>
          <rect x={midX} y={y} width={x + width - midX} height={height} />
        </clipPath>
      </defs>
      <line
        x1={midX}
        y1={y}
        x2={midX}
        y2={y + height}
        stroke="var(--ui-border-on-surface-border)"
        strokeDasharray="4 4"
      />
    </>
  );
}

/**
 * One top-to-bottom fade per series, referenced by each `<Area>`'s `fill`.
 *
 * The ids are scoped by `gradientId` because SVG `<defs>` ids are
 * document-global: two AreaCharts on the same page would otherwise share (and
 * silently overwrite) each other's stops.
 */
function AreaFillGradients({
  dataKeys,
  gradientId,
  colorFor,
}: {
  dataKeys: string[];
  gradientId: string;
  colorFor: (key: string) => string;
}) {
  return (
    <defs>
      {dataKeys.map((key) => (
        <linearGradient
          key={key}
          id={`${gradientId}-${key}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="5%" stopColor={colorFor(key)} stopOpacity={0.8} />
          <stop offset="95%" stopColor={colorFor(key)} stopOpacity={0.1} />
        </linearGradient>
      ))}
    </defs>
  );
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      className,
      config,
      palette,
      data,
      dataKeys,
      xKey,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      layout = 'single',
      fill = 'solid',
      curve = 'monotone',
      strokeWidth = 2,
      fillOpacity = 0.4,
      showDots = false,
      dotSize = 3,
      showActiveDot,
      connectNulls = false,
      areaSettings,
      referenceLine,
      projectionStart,
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
    const isStacked = layout === 'stacked';
    const areaLabelPosition = resolveCartesianLabelPosition({
      labelPosition,
      isStacked,
    });
    const isGradient = fill === 'gradient';
    const referenceLines = toReferenceLineList(referenceLine);

    // A series' `color` override has to reach its gradient stops too, or a
    // gradient-filled chart would keep painting the `config` color.
    const colorFor = (key: string) =>
      areaSettings?.[key]?.color ?? `var(--color-${key})`;

    // The plot inset is needed as soon as *any* series carries outside labels —
    // a per-series `showLabel` counts, not only the chart-wide `showLabels`.
    const hasLabels =
      showLabels ||
      Object.values(areaSettings ?? {}).some((settings) => settings.showLabel);

    // Axis titles: the X title sits below the ticks; the Y title is rotated in
    // the left gutter. Passed to recharts' native `label` (themed via the
    // `.recharts-label` fill selector on the container).
    const xAxisTitle = resolveXAxisTitle(xAxisLabel);
    const yAxisTitle = resolveYAxisTitle(yAxisLabel);

    const yDomain = resolveAxisDomain(yAxisDomain);

    const xAxisHeight = resolveXAxisHeight(xAxisLabel, xAxisAngle);

    const projStartIndex = React.useMemo(() => {
      if (projectionStart === undefined) return -1;
      return data.findIndex((row) => row[xKey] === projectionStart);
    }, [projectionStart, data, xKey]);
    // projStartIndex === 0 (boundary at the first tick) is excluded: there is no
    // "previous tick" to define the clip midpoint, so clipPath defs can't be
    // emitted, which would make all series invisible. Treat it as no-projection.
    const hasProjection = projStartIndex > 0;

    // Build the projection tick renderer when projectionStart is set. Each tick
    // past (and including) the start value renders in the disabled text color;
    // ticks before it stay in the muted-foreground color. Returns undefined when
    // projectionStart is absent or not found so recharts uses its own renderer.
    const projectionTick = React.useMemo(() => {
      if (!hasProjection) return undefined;
      const projectedValues = new Set(
        data.slice(projStartIndex).map((row) => row[xKey])
      );
      const ProjectionTick = ({
        payload,
        ...tickProps
      }: {
        payload: { value: string | number };
        [key: string]: unknown;
      }) => (
        <Text
          {...(tickProps as React.ComponentProps<typeof Text>)}
          fontSize={12}
          className={
            projectedValues.has(payload.value)
              ? 'fill-[var(--ui-text-on-surface-disabled)]'
              : 'fill-muted-foreground'
          }
        >
          {xTickFormatter
            ? xTickFormatter(payload.value as never, 0)
            : payload.value}
        </Text>
      );
      return ProjectionTick;
    }, [hasProjection, projStartIndex, data, xKey, xTickFormatter]);

    // When projection is active, copy each series value to `_proj_${key}` — same
    // data, no nulls. Both the actual and projection <Area> see the identical curve;
    // the clipPath (computed in ProjectionClip) restricts which half each paints.
    const chartData = React.useMemo(() => {
      if (!hasProjection) return data;
      return data.map((row) => ({
        ...row,
        ...Object.fromEntries(
          dataKeys.map((k) => [`_proj_${k}`, row[k]])
        ),
      }));
    }, [hasProjection, data, dataKeys]);

    // The tick immediately before the projection boundary — needed to compute the
    // visual midpoint where the clip edge and separator line are placed.
    const prevTickValue = React.useMemo(() => {
      if (projStartIndex <= 0) return undefined;
      return data[projStartIndex - 1]?.[xKey];
    }, [projStartIndex, data, xKey]);

    const projectionTooltip = React.useMemo(
      () =>
        hasProjection && tooltipContent
          ? createProjectionTooltip(tooltipContent)
          : undefined,
      [hasProjection, tooltipContent]
    );

    const tooltipNode = hasProjection
      ? (projectionTooltip ??
          ((tp: TooltipRenderProps) => (
            <ChartTooltipContent
              active={tp.active}
              label={tp.label}
              payload={
                dropProjectionPayload(
                  tp.payload
                ) as ChartTooltipContentProps['payload']
              }
            />
          )))
      : (tooltipContent ?? <ChartTooltipContent />);

    const legendNode = hasProjection
      ? (lp: LegendContentProps) => (
          <ChartLegendContent
            verticalAlign={lp.verticalAlign}
            payload={
              dropProjectionPayload(
                lp.payload
              ) as ChartLegendContentProps['payload']
            }
          />
        )
      : <ChartLegendContent />;

    // recharts renders SVG <defs> once per chart; the gradient/clip ids must be
    // unique across chart instances on the page. useId gives a stable per-instance
    // id; strip the colons React emits (invalid in a url(#…) reference).
    const gradientId = `area-gradient-${React.useId().replace(/:/g, '')}`;
    const clipId = `area-proj-${React.useId().replace(/:/g, '')}`;

    return (
      <div
        ref={ref}
        data-layout={layout}
        data-fill={fill}
        className={cn(areaChartVariants({ layout, fill }), className)}
        {...props}
      >
        <ChartContainer
          config={config}
          palette={palette}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsAreaChart
            data={chartData as readonly unknown[]}
            margin={hasLabels ? CHART_LABEL_MARGIN : undefined}
          >
            {isGradient && (
              <AreaFillGradients
                dataKeys={dataKeys}
                gradientId={gradientId}
                colorFor={colorFor}
              />
            )}
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
              tickFormatter={projectionTick ? undefined : xTickFormatter}
              tick={projectionTick}
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
            {showTooltip && <ChartTooltip content={tooltipNode} />}
            {showLegend && <ChartLegend content={legendNode} />}
            {hasProjection && prevTickValue != null && (
              <ProjectionClip
                projectionStart={projectionStart!}
                prevTick={prevTickValue}
                clipId={clipId}
              />
            )}
            {dataKeys.map((key) => {
              const settings = areaSettings?.[key];
              const seriesDots = settings?.showDots ?? showDots;
              const dotRadius = settings?.dotSize ?? dotSize;
              // The hover dot follows the static dots unless asked otherwise, so
              // a chart that sets neither renders exactly as before.
              const activeDot = showActiveDot ?? seriesDots;
              const seriesLabel = settings?.showLabel ?? showLabels;
              const seriesLabelPosition =
                settings?.labelPosition ?? areaLabelPosition;
              return (
                <Area
                  key={key}
                  type={settings?.curveType ?? curve ?? 'monotone'}
                  dataKey={key}
                  stackId={isStacked ? 'a' : undefined}
                  stroke={colorFor(key)}
                  strokeWidth={settings?.strokeWidth ?? strokeWidth}
                  strokeDasharray={settings?.dashed ? '5 5' : undefined}
                  fill={
                    isGradient ? `url(#${gradientId}-${key})` : colorFor(key)
                  }
                  fillOpacity={
                    settings?.fillOpacity ?? (isGradient ? 1 : fillOpacity)
                  }
                  dot={seriesDots ? { r: dotRadius } : false}
                  activeDot={activeDot ? { r: dotRadius + 2 } : false}
                  connectNulls={connectNulls}
                  clipPath={hasProjection ? `url(#${clipId}-actual)` : undefined}
                  {...animation}
                >
                  {seriesLabel && (
                    <LabelList
                      dataKey={key}
                      position={seriesLabelPosition}
                      formatter={toLabelFormatter(labelFormatter)}
                      className={resolveLabelFillClass(seriesLabelPosition, {
                        translucentSeries: true,
                      })}
                      fontSize={CHART_LABEL_FONT_SIZE}
                    />
                  )}
                </Area>
              );
            })}
            {hasProjection &&
              dataKeys.map((key) => {
                const settings = areaSettings?.[key];
                return (
                  <Area
                    key={`_proj_${key}`}
                    type={settings?.curveType ?? curve ?? 'monotone'}
                    dataKey={`_proj_${key}`}
                    name={key}
                    stroke={colorFor(key)}
                    strokeWidth={settings?.strokeWidth ?? strokeWidth}
                    strokeDasharray="5 5"
                    fill={
                      isGradient ? `url(#${gradientId}-${key})` : colorFor(key)
                    }
                    fillOpacity={
                      settings?.fillOpacity ?? (isGradient ? 1 : fillOpacity)
                    }
                    dot={false}
                    activeDot={false}
                    clipPath={`url(#${clipId}-projection)`}
                    legendType="none"
                    tooltipType="none"
                    {...animation}
                  />
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
          </RechartsAreaChart>
        </ChartContainer>
      </div>
    );
  }
);
AreaChart.displayName = 'AreaChart';

export { AreaChart, areaChartVariants };
