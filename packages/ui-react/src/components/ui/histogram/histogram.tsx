'use client';

import * as React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  type CartesianAxisProps,
} from '../chart';

// A histogram bins a set of continuous samples into equal-width ranges and plots
// the frequency of each as contiguous bars — distinct from BarChart, whose bars
// are pre-categorized. The binning is the component's job (a pure helper), so the
// consumer passes raw `values`, not pre-aggregated rows. Built on the shared
// `Chart` primitives; no new tokens (the single series' color is caller-supplied
// via `config`, same `--color-<key>` mechanism as the other chart types).

export interface HistogramBin {
  /** Lower bound of the bin (inclusive). */
  x0: number;
  /** Upper bound of the bin (exclusive, except the last bin which is inclusive). */
  x1: number;
  /** Human-readable range label, e.g. `"0–10"`. */
  label: string;
  /** How many samples fell in the bin. */
  count: number;
}

const roundEdge = (n: number) => Number(n.toFixed(2));

/**
 * Split `values` into `binCount` equal-width bins and count the samples in each.
 * The range is `domain` if given, else the data's [min, max]; values outside the
 * domain are dropped, and the max value lands in the last (inclusive) bin.
 * Returns [] when there's nothing to bin. Exported for unit tests; not part of
 * the package's public API.
 */
export function computeHistogramBins(
  values: ReadonlyArray<number>,
  binCount: number,
  domain?: [number, number]
): HistogramBin[] {
  const nums = values.filter(
    (v): v is number => typeof v === 'number' && Number.isFinite(v)
  );
  if (nums.length === 0 || binCount < 1) return [];

  const [d0, d1] = domain ?? [Math.min(...nums), Math.max(...nums)];
  // Normalize an inverted domain ([max, min]) so binning stays robust.
  const min = Math.min(d0, d1);
  const hi = Math.max(d0, d1);
  // A zero-width range (all values equal, or a degenerate domain) can't be
  // divided — widen it by 1 so the single bin has extent.
  const max = min === hi ? min + 1 : hi;
  const width = (max - min) / binCount;

  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const x0 = min + i * width;
    const x1 = i === binCount - 1 ? max : min + (i + 1) * width;
    return { x0, x1, label: `${roundEdge(x0)}–${roundEdge(x1)}`, count: 0 };
  });

  for (const v of nums) {
    if (v < min || v > max) continue;
    let idx = Math.floor((v - min) / width);
    if (idx >= binCount) idx = binCount - 1; // the max value
    bins[idx].count += 1;
  }
  return bins;
}

export interface HistogramProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    CartesianAxisProps {
  /** Raw continuous samples to bin (non-finite values are ignored). */
  values: ReadonlyArray<number>;
  /**
   * Single-series map of `label` / `color`, keyed by `dataKey` (imported from
   * the shared `Chart` primitives). Color is caller-supplied — reference an
   * existing semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** `config` key that colors + labels the frequency bars. */
  dataKey?: string;
  /** Number of equal-width bins. */
  binCount?: number;
  /** Fix the binning range instead of deriving it from the data's min/max. */
  domain?: [number, number];
  /** Title rendered beneath the horizontal (X) axis. */
  xAxisLabel?: string;
  /** Title rendered beside the vertical (Y) axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to Y-axis tick values (recharts `unit`; the X axis is the bin label). */
  yUnit?: string;
  /** Corner radius on the top of each bar. */
  barRadius?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize the tooltip without composing recharts yourself. Ignored when
   * `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

const Histogram = React.forwardRef<HTMLDivElement, HistogramProps>(
  (
    {
      className,
      config,
      values,
      dataKey = 'count',
      binCount = 10,
      domain,
      xAxisLabel,
      yAxisLabel,
      yUnit,
      barRadius = 0,
      showGrid = true,
      showTooltip = true,
      showXAxis = true,
      showYAxis = true,
      xTickFormatter,
      yTickFormatter,
      tooltipContent,
      ...props
    },
    ref
  ) => {
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

    const bins = React.useMemo(
      () => computeHistogramBins(values, binCount, domain),
      [values, binCount, domain]
    );
    // Bars carry the bin `label` as the category and `count` under `dataKey`, so
    // the tooltip resolves the frequency from `config[dataKey]`.
    const data = bins.map((bin) => ({ label: bin.label, [dataKey]: bin.count }));

    return (
      <div
        ref={ref}
        className={cn(className)}
        {...props}
      >
        <ChartContainer
          config={config}
          className="size-full [&_.recharts-label]:fill-foreground"
        >
          <RechartsBarChart data={data} barCategoryGap={0}>
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey="label"
              hide={!showXAxis}
              tickLine={false}
              axisLine={false}
              tickFormatter={xTickFormatter}
              height={xAxisLabel ? 48 : undefined}
              label={xAxisTitle}
            />
            <YAxis
              type="number"
              hide={!showYAxis}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              unit={yUnit}
              tickFormatter={yTickFormatter}
              width={yAxisLabel ? 72 : undefined}
              label={yAxisTitle}
            />
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            <Bar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              // A hairline in the surface color separates the contiguous bars so
              // they don't blend into one mass (same trick as the Treemap cells).
              stroke="var(--ui-background-surface-primary)"
              strokeWidth={1}
              radius={barRadius > 0 ? [barRadius, barRadius, 0, 0] : undefined}
              isAnimationActive={false}
            />
          </RechartsBarChart>
        </ChartContainer>
      </div>
    );
  }
);
Histogram.displayName = 'Histogram';

export { Histogram };
