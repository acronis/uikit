'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
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
  toLabelFormatter,
  resolveLabelFillClass,
  resolveCartesianLabelPosition,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type CartesianChartProps,
  type ChartAnimationProps,
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
  /** Unit suffix on X-axis tick values (recharts `unit`) — applies when the X axis is numeric (`orientation="horizontal"`). */
  xUnit?: string;
  /** Corner radius applied to the growing end of each bar. */
  barRadius?: number;
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
      xAxisLabel,
      yAxisLabel,
      xUnit,
      yUnit,
      orientation = 'vertical',
      layout = 'grouped',
      barRadius = 4,
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
          <RechartsBarChart data={data as readonly unknown[]} layout={rechartsLayout}>
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
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key, index) => {
              // In a stack only the last segment's end is rounded; grouped bars
              // each round their own end.
              const rounded = isStacked ? index === dataKeys.length - 1 : true;
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  stackId={isStacked ? 'a' : undefined}
                  radius={barRadius > 0 && rounded ? endRadius : undefined}
                  {...animation}
                >
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
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
BarChart.displayName = 'BarChart';

export { BarChart, barChartVariants };
