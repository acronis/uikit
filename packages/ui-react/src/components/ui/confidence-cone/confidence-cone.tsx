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
// (series colors are caller-supplied via `config`, and the band is tinted with
// the forecast series' color).

// The band is a synthetic `[lower, upper]` range field per row that a recharts
// <Area> shades; kept out of the tooltip/legend (see the filters below).
const BAND_KEY = '__cone';

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
   * yet. The cone band is tinted with the forecast series' color.
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
      strokeWidth = 2,
      showForecastRegion = true,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      ...props
    },
    ref
  ) => {
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
        <ChartContainer config={config} className="size-full">
          <ComposedChart data={chartData as readonly unknown[]}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xKey}
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis type="number" tickLine={false} axisLine={false} />
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
            {showTooltip && (
              <ChartTooltip
                content={(tp) => (
                  <ChartTooltipContent
                    active={tp.active}
                    label={tp.label}
                    // The synthetic band feeds the Area, not the tooltip.
                    payload={
                      tp.payload?.filter(
                        (item) => item.dataKey !== BAND_KEY
                      ) as ChartTooltipContentProps['payload']
                    }
                  />
                )}
              />
            )}
            {showLegend && (
              <ChartLegend
                content={(lp) => (
                  <ChartLegendContent
                    verticalAlign={lp.verticalAlign}
                    payload={
                      lp.payload?.filter(
                        (item) => item.dataKey !== BAND_KEY
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
