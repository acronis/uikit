'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Cell, Label, Pie, PieChart as RechartsPieChart } from 'recharts';

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

export interface PieChartCenterLabel {
  // Rendered as SVG <text>, which only lays out text — hence string | number,
  // not ReactNode.
  /** Headline metric rendered large in the donut hole (e.g. a total). */
  value?: string | number;
  /** Caption rendered under the value. */
  label?: string | number;
}

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
  /**
   * Label field that names each slice (drives the legend, tooltip, and
   * `--color-<name>` lookup). Values should be unique per chart — rows sharing a
   * name share one `config`/color entry.
   */
  nameKey: string;
  /** Inner radius of the arc when `shape="donut"` (ignored for `shape="pie"`). */
  innerRadius?: number;
  /**
   * Custom content for the donut hole — a headline `value` and/or a `label`
   * caption, stacked and centered. Rendered only for `shape="donut"` (a filled
   * pie has no hole).
   */
  centerLabel?: PieChartCenterLabel;
  /** Outer radius of the arc. Omit to use recharts' responsive default. */
  outerRadius?: number;
  /** Gap between slices, in degrees. */
  paddingAngle?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
}

// Reserved height (px) of the shared single-row `ChartLegendContent` at the
// bottom of the chart surface. recharts shifts the donut centre up by half of
// this to make room for the legend, but a Pie <Label>'s viewBox does not
// reflect it — so the centre label is nudged up by the same amount. VR
// baselines guard this value if the legend's height ever changes.
const LEGEND_ROW_RESERVE = 28;

const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      className,
      config,
      data,
      dataKey,
      nameKey,
      shape = 'pie',
      centerLabel,
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
              {data.map((entry, index) => (
                // Keyed by index, not the name: two rows may share a nameKey
                // value, which would collide as a React key. Same-named rows
                // intentionally share a color/config entry via `--color-<name>`.
                <Cell key={index} fill={`var(--color-${entry[nameKey]})`} />
              ))}
              {shape === 'donut' && centerLabel && (
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !('cx' in viewBox)) return null;
                    const { cx = 0, cy = 0 } = viewBox as {
                      cx?: number;
                      cy?: number;
                    };
                    // recharts centres the pie in the plot area (surface minus
                    // the legend), but a Pie <Label>'s viewBox reports the full
                    // surface centre — so a bottom legend leaves cy half a legend
                    // row too low. Nudge up onto the real donut centre.
                    const centerY =
                      cy - (showLegend ? LEGEND_ROW_RESERVE / 2 : 0);
                    const hasValue = centerLabel.value != null;
                    const hasLabel = centerLabel.label != null;
                    // Straddle centerY when both lines show, so the value + label
                    // block is centered as a whole (not just the value).
                    const both = hasValue && hasLabel;
                    return (
                      <g>
                        {hasValue && (
                          <text
                            x={cx}
                            y={both ? centerY - 10 : centerY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-foreground text-2xl font-semibold"
                          >
                            {centerLabel.value}
                          </text>
                        )}
                        {hasLabel && (
                          <text
                            x={cx}
                            y={both ? centerY + 13 : centerY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-muted-foreground text-sm"
                          >
                            {centerLabel.label}
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
              )}
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
