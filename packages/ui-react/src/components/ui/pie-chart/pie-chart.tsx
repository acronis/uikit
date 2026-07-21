'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. The single
// CVA axis is the design's Pie-chart variant set: `shape` (a filled pie vs a
// hollow-centre donut). The class stays empty because recharts' SVG — not CSS —
// draws the arc: `shape` drives the `<Pie>`'s `innerRadius` (0 for a pie, the
// `innerRadius` prop for a donut). CVA is kept so the variant set is a
// first-class, spec-conformant part of the API (matched against ui-spec's
// api.yaml enums) and exposed via `VariantProps`; the resolved value is also
// mirrored onto `data-shape`.
const pieChartVariants = cva('', {
  variants: {
    shape: {
      pie: '',
      donut: '',
    },
  },
  defaultVariants: {
    shape: 'pie',
  },
});

export interface PieChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof pieChartVariants> {
  /** Row-per-slice data. Each object holds the slice's `nameKey` label + its `dataKey` numeric value. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-slice map of `label` / `color`, keyed by the slice's `nameKey` value
   * (imported from the shared `Chart` primitives). Turned into `--color-<name>`
   * custom properties. Colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Numeric field that sizes each slice. */
  dataKey: string;
  /** Label field that names each slice (drives the legend, tooltip, and `--color-<name>` lookup). */
  nameKey: string;
  /** Inner radius of the arc when `shape="donut"` (ignored for `shape="pie"`). */
  innerRadius?: number;
  /** Outer radius of the arc. Omit to use recharts' responsive default. */
  outerRadius?: number;
  /** Gap between slices, in degrees. */
  paddingAngle?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      className,
      config,
      data,
      dataKey,
      nameKey,
      shape = 'pie',
      innerRadius = 60,
      outerRadius,
      paddingAngle = 0,
      showTooltip = true,
      showLegend = true,
      ...props
    },
    ref
  ) => {
    const resolvedInnerRadius = shape === 'donut' ? innerRadius : 0;

    return (
      <div
        ref={ref}
        data-shape={shape}
        className={cn(pieChartVariants({ shape }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RechartsPieChart>
            {showTooltip && (
              <ChartTooltip
                content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
              />
            )}
            <Pie
              data={data as unknown[]}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={resolvedInnerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell
                  key={String(entry[nameKey])}
                  fill={`var(--color-${entry[nameKey]})`}
                />
              ))}
            </Pie>
            {showLegend && (
              <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
            )}
          </RechartsPieChart>
        </ChartContainer>
      </div>
    );
  }
);
PieChart.displayName = 'PieChart';

export { PieChart, pieChartVariants };
