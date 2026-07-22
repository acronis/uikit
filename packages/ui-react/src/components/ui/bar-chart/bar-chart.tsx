'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
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
    VariantProps<typeof barChartVariants> {
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
  /** Corner radius applied to the growing end of each bar. */
  barRadius?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
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
      orientation = 'vertical',
      layout = 'grouped',
      barRadius = 4,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      ...props
    },
    ref
  ) => {
    // Our `orientation` is bar-direction; recharts' `layout` is the opposite axis.
    const rechartsLayout = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    const isStacked = layout === 'stacked';

    const referenceLines = referenceLine
      ? Array.isArray(referenceLine)
        ? referenceLine
        : [referenceLine]
      : [];

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
        <ChartContainer config={config} className="size-full">
          <RechartsBarChart data={data as readonly unknown[]} layout={rechartsLayout}>
            {showGrid && (
              <CartesianGrid
                horizontal={orientation === 'vertical'}
                vertical={orientation === 'horizontal'}
              />
            )}
            {orientation === 'horizontal' ? (
              <>
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey={xKey}
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  type="category"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis type="number" tickLine={false} axisLine={false} />
              </>
            )}
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
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
                  isAnimationActive={false}
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
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
BarChart.displayName = 'BarChart';

export { BarChart, barChartVariants };
