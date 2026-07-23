'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
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

export interface AreaChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof areaChartVariants> {
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
  /** Title rendered beneath the horizontal (X) axis. */
  xAxisLabel?: string;
  /** Title rendered beside the vertical (Y) axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to Y-axis tick values (recharts `unit`; the X axis is categorical). */
  yUnit?: string;
  /** Interpolation between points. */
  curve?: 'linear' | 'monotone' | 'step';
  /** Stroke width of each area's top border. */
  strokeWidth?: number;
  /** Flat-fill opacity — used only when `fill="solid"` (gradient controls its own stops). */
  fillOpacity?: number;
  /** Render a dot at each data point. */
  showDots?: boolean;
  /** Bridge `null` gaps in the data instead of breaking the area. */
  connectNulls?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` /
   * `indicator` — to customize formatting, per-series rows, or extra fields
   * without composing recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
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
      connectNulls = false,
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    const isStacked = layout === 'stacked';
    const isGradient = fill === 'gradient';

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
          <RechartsAreaChart data={data as readonly unknown[]}>
            {isGradient && (
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
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
            )}
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
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key) => (
              <Area
                key={key}
                type={curve ?? 'monotone'}
                dataKey={key}
                stackId={isStacked ? 'a' : undefined}
                stroke={`var(--color-${key})`}
                strokeWidth={strokeWidth}
                fill={isGradient ? `url(#${gradientId}-${key})` : `var(--color-${key})`}
                fillOpacity={isGradient ? 1 : fillOpacity}
                dot={showDots ? { r: 3 } : false}
                activeDot={showDots ? { r: 5 } : false}
                connectNulls={connectNulls}
                isAnimationActive={false}
              />
            ))}
          </RechartsAreaChart>
        </ChartContainer>
      </div>
    );
  }
);
AreaChart.displayName = 'AreaChart';

export { AreaChart, areaChartVariants };
