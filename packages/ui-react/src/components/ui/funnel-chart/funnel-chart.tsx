'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Cell, Funnel, FunnelChart as RechartsFunnelChart, LabelList } from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. The single
// CVA axis is the design's Funnel-chart variant set: `lastShape` (does the
// funnel narrow to a point — `triangle` — or end flat — `rectangle`). The class
// stays empty because recharts' SVG — not CSS — draws the funnel: `lastShape`
// drives the `<Funnel>`'s `lastShapeType`. CVA is kept so the variant set is a
// first-class, spec-conformant part of the API (matched against ui-spec's
// api.yaml enums) and exposed via `VariantProps`; the resolved value is also
// mirrored onto `data-last-shape`.
const funnelChartVariants = cva('', {
  variants: {
    lastShape: {
      triangle: '',
      rectangle: '',
    },
  },
  defaultVariants: {
    lastShape: 'triangle',
  },
});

export interface FunnelChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof funnelChartVariants> {
  /** Row-per-stage data. Each object holds the stage's `nameKey` label + its `dataKey` numeric value. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-stage map of `label` / `color`, keyed by the stage's `nameKey` value
   * (imported from the shared `Chart` primitives). Turned into `--color-<name>`
   * custom properties. Colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Numeric field that sizes each stage (the funnel narrows as it drops). */
  dataKey: string;
  /**
   * Label field that names each stage (drives the legend, tooltip, on-chart
   * labels, and the `--color-<name>` lookup). Values should be unique per chart —
   * stages sharing a name share one `config`/color entry.
   */
  nameKey: string;
  /** Flip the funnel so it widens toward the bottom instead of narrowing. */
  reversed?: boolean;
  /** Render each stage's name beside its segment. */
  showLabels?: boolean;
  showTooltip?: boolean;
}

const FunnelChart = React.forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      className,
      config,
      data,
      dataKey,
      nameKey,
      lastShape = 'triangle',
      reversed = false,
      showLabels = true,
      showTooltip = true,
      ...props
    },
    ref
  ) => {
    // Stamp each row with its `fill` (the shadcn data-driven pattern). A Funnel's
    // default fill is grey (#808080) and recharts doesn't carry a per-segment
    // color on the tooltip/legend payload item, so putting the color on the data
    // row is what lets a real hover resolve each segment's color. (The forced-open
    // `defaultIndex` VR snapshot can still show a neutral indicator — it
    // synthesizes the open state without a pointer hover.)
    const seriesData: Record<string, string | number>[] = data.map((row) => ({
      ...row,
      fill: `var(--color-${row[nameKey]})`,
    }));

    return (
      <div
        ref={ref}
        data-last-shape={lastShape}
        className={cn(funnelChartVariants({ lastShape }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RechartsFunnelChart margin={{ top: 8, right: 96, bottom: 8, left: 24 }}>
            {showTooltip && (
              <ChartTooltip
                content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
              />
            )}
            <Funnel
              dataKey={dataKey}
              nameKey={nameKey}
              data={seriesData}
              lastShapeType={lastShape ?? 'triangle'}
              reversed={reversed}
              isAnimationActive={false}
            >
              {seriesData.map((entry, index) => (
                // Keyed by index, not the name: two stages could share a nameKey
                // value, which would collide as a React key. Same-named stages
                // intentionally share a color/config entry via `--color-<name>`.
                <Cell key={index} fill={`var(--color-${entry[nameKey]})`} />
              ))}
              {showLabels && (
                <LabelList
                  position="right"
                  dataKey={nameKey}
                  className="fill-foreground"
                  stroke="none"
                />
              )}
            </Funnel>
          </RechartsFunnelChart>
        </ChartContainer>
      </div>
    );
  }
);
FunnelChart.displayName = 'FunnelChart';

export { FunnelChart, funnelChartVariants };
