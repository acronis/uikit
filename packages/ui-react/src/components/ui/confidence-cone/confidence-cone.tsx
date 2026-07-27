'use client';

import * as React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
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
  type ChartConfig,
  type ChartLegendContentProps,
  type ChartTooltipContentProps,
} from '../chart';

// A forecast confidence-cone: a solid line over the known/actual period, a
// dashed line over the forecast period, and a shaded band (the "cone") between
// a lower and upper bound that typically widens with the horizon — visualizing
// growing uncertainty. Built on the shared Chart primitives; no new tokens
// (series colors are caller-supplied via `config`). The whole metric renders in
// one hue — actual and forecast differ by line style, not color — so the cone
// band and the forecast line both reuse the actual series' color.

// The band is a synthetic `[lower, upper]` range field per row that a recharts
// <Area> shades; kept out of the tooltip/legend (see the filters below).
const BAND_KEY = '__cone';

/**
 * Drop the synthetic cone-band range series from a recharts tooltip/legend
 * payload, keeping the real actual/forecast series (and their order). Applied to
 * both the default tooltip and any caller-supplied `tooltipContent`, so the
 * `__cone` band never surfaces regardless of which path renders.
 */
export function dropConeBand<T extends { dataKey?: unknown }>(
  payload: readonly T[] | undefined
): T[] | undefined {
  return payload?.filter((item) => item.dataKey !== BAND_KEY);
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
type TooltipContentFn = Extract<TooltipContentType, (...args: never[]) => unknown>;
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

export interface ConfidenceConeProps
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  /**
   * Row-per-point data — the shared x dimension plus the actual / forecast /
   * bound fields. Rows are naturally sparse (a point has either an actual or a
   * forecast + bounds), so missing fields are allowed. Avoid a field named
   * `__cone` — it's reserved for the internal prediction-band series.
   */
  data: ReadonlyArray<Record<string, string | number | null | undefined>>;
  /**
   * Per-series map of `label` / `color` for the actual + forecast lines
   * (imported from the shared `Chart` primitives). Colors are caller-supplied —
   * reference an existing semantic `--ui-*` token; there is no chart palette tier
   * yet. The cone band and the forecast line both reuse the actual series'
   * color — actual and forecast differ by line style, not hue.
   */
  config: ChartConfig;
  /** Category / time axis key (the shared dimension across rows). */
  xKey: string;
  /** Field for the known/actual values — drawn as a solid line with a filled area. */
  actualKey: string;
  /** Field for the projected values — drawn as a dashed line. */
  forecastKey: string;
  /** Field for the cone's lower bound. */
  lowerKey: string;
  /** Field for the cone's upper bound. */
  upperKey: string;
  /** Title rendered beneath the horizontal (X) axis. */
  xAxisLabel?: string;
  /** Title rendered beside the vertical (Y) axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to Y-axis tick values (recharts `unit`; the X axis is categorical). */
  yUnit?: string;
  /** Stroke width of the actual + forecast lines. */
  strokeWidth?: number;
  /**
   * Set off the forecast period from the actuals with a dashed divider at the
   * hand-off point (the first row with a forecast value) and a subtle shaded
   * band over the forecast region.
   */
  showForecastRegion?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize the tooltip without composing recharts yourself. The synthetic
   * cone band is filtered out of the payload before your tooltip sees it, so a
   * `__cone` item never reaches your formatter. Ignored when `showTooltip` is
   * false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

const ConfidenceCone = React.forwardRef<HTMLDivElement, ConfidenceConeProps>(
  (
    {
      className,
      config,
      data,
      xKey,
      actualKey,
      forecastKey,
      lowerKey,
      upperKey,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      strokeWidth = 2,
      showForecastRegion = true,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    // Memoized so recharts sees a stable content type across renders — a fresh
    // wrapper each render would remount the caller's tooltip and reset its state.
    const customTooltip = React.useMemo(
      () => (tooltipContent ? createConeTooltip(tooltipContent) : undefined),
      [tooltipContent]
    );

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

    // Augment each row with the `[lower, upper]` band tuple the Area shades.
    // Rows missing a numeric bound are left un-coned (the band breaks there).
    const chartData = data.map((row) => {
      const lower = row[lowerKey];
      const upper = row[upperKey];
      return {
        ...row,
        [BAND_KEY]:
          typeof lower === 'number' && typeof upper === 'number'
            ? [lower, upper]
            : undefined,
      };
    });

    // The forecast begins at the first row carrying a forecast value; set that
    // region off from the actuals with a shaded band + a divider at the hand-off.
    const forecastStart = showForecastRegion
      ? data.find((row) => typeof row[forecastKey] === 'number')?.[xKey]
      : undefined;
    const lastX = data[data.length - 1]?.[xKey];

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <ComposedChart data={chartData as readonly unknown[]}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={xAxisLabel ? 48 : undefined}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              unit={yUnit}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {/* Set the forecast region off from the actuals (behind everything). */}
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
            {showTooltip &&
              (customTooltip ? (
                // Strips the synthetic band before the caller's tooltip sees it
                // — the `__cone` series feeds the Area, not the tooltip.
                <ChartTooltip content={customTooltip} />
              ) : (
                <ChartTooltip
                  content={(tp) => (
                    <ChartTooltipContent
                      active={tp.active}
                      label={tp.label}
                      // The synthetic band feeds the Area, not the tooltip.
                      payload={
                        dropConeBand(
                          tp.payload
                        ) as ChartTooltipContentProps['payload']
                      }
                    />
                  )}
                />
              ))}
            {showLegend && (
              <ChartLegend
                content={(lp) => (
                  <ChartLegendContent
                    verticalAlign={lp.verticalAlign}
                    payload={
                      dropConeBand(
                        lp.payload
                      ) as ChartLegendContentProps['payload']
                    }
                  />
                )}
              />
            )}
            {/* The cone renders first so the lines draw on top. One color for the
                whole metric — actual and forecast differ by line style, not hue —
                so the cone + forecast line reuse the actual series' color. */}
            <Area
              dataKey={BAND_KEY}
              type="monotone"
              stroke="none"
              fill={`var(--color-${actualKey})`}
              fillOpacity={0.15}
              connectNulls={false}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              legendType="none"
              tooltipType="none"
            />
            <Area
              dataKey={actualKey}
              type="monotone"
              stroke={`var(--color-${actualKey})`}
              strokeWidth={strokeWidth}
              fill={`var(--color-${actualKey})`}
              fillOpacity={0.15}
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              dataKey={forecastKey}
              type="monotone"
              stroke={`var(--color-${actualKey})`}
              strokeWidth={strokeWidth}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    );
  }
);
ConfidenceCone.displayName = 'ConfidenceCone';

export { ConfidenceCone };
