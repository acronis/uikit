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
    fill: 'gradient',
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
  /** Row-per-point data. Each object holds the category key + one numeric field per series (`null` breaks the area unless `connectNulls`). */
  data: ReadonlyArray<Record<string, string | number | null>>;
  /**
   * Per-series map of `label` / `color` (imported from the shared `Chart`
   * primitives). Series colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
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
  showLegend?: boolean;
  /** Position of the value labels when `showLabels` is on. Defaults to `top`. */
  labelPosition?: CartesianLabelPosition;
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
      data,
      dataKeys,
      xKey,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      layout = 'single',
      fill = 'gradient',
      curve = 'monotone',
      strokeWidth = 2,
      fillOpacity = 0.4,
      showDots = false,
      dotSize = 3,
      showActiveDot,
      connectNulls = false,
      areaSettings,
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

    // recharts renders SVG <defs> once per chart; the gradient ids must be unique
    // across chart instances on the page. useId gives a stable per-instance id;
    // strip the colons React emits (invalid in a url(#…) reference) — same guard
    // the shared ChartContainer applies to its chart id.
    const gradientId = `area-gradient-${React.useId().replace(/:/g, '')}`;

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
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsAreaChart
            data={data as readonly unknown[]}
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
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
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
