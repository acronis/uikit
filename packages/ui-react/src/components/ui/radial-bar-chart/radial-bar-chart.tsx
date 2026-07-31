'use client';

import * as React from 'react';
import {
  Cell,
  LabelList,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  toLabelFormatter,
  resolveLabelFillClass,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartAnimationProps,
  type ChartDataLabelProps,
  type PolarLabelPosition,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives (a polar/radial
// type). Rows become concentric arcs sized by `dataKey`, each colored from its
// `--color-<name>` var. Like ScatterChart/ComposedChart there's no CVA variant:
// a radial bar's expressiveness is geometry (angles/radii, plain props) and the
// data mapping, not a visual "mode". The angular sweep is exposed as
// startAngle/endAngle props so a caller can build a gauge or a full ring.
export interface RadialBarChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    ChartAnimationProps,
    ChartDataLabelProps {
  /** Row-per-arc data. Each object holds the arc's `nameKey` label + its `dataKey` numeric value. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-arc map of `label` / `color`, keyed by the arc's `nameKey` value
   * (imported from the shared `Chart` primitives). Turned into `--color-<name>`
   * custom properties. Colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Numeric field that sizes each arc. */
  dataKey: string;
  /**
   * Label field that names each arc (drives the legend, tooltip, and
   * `--color-<name>` lookup). Values should be unique per chart (arcs sharing a
   * name share one `config`/color entry) and CSS-safe — they become part of a
   * custom-property name.
   */
  nameKey: string;
  /** Inner radius of the innermost arc. */
  innerRadius?: number;
  /** Outer radius of the outermost arc. */
  outerRadius?: number;
  /** Angle (degrees) the arcs sweep from. */
  startAngle?: number;
  /** Angle (degrees) the arcs sweep to (default is a full clockwise circle). */
  endAngle?: number;
  /** Corner radius on each arc's ends. */
  cornerRadius?: number;
  /** Render a muted background track behind each arc. */
  showBackground?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting, per-arc rows, or extra fields without composing
   * recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
  /**
   * Position of the value labels when `showLabels` is on. Defaults to
   * `insideStart` — the labels sit inside each arc, and therefore render in the
   * on-fill label token so they stay legible over the arc colour.
   */
  labelPosition?: PolarLabelPosition;
}

const RadialBarChart = React.forwardRef<HTMLDivElement, RadialBarChartProps>(
  (
    {
      className,
      config,
      data,
      dataKey,
      nameKey,
      innerRadius = 30,
      outerRadius = 110,
      startAngle = 90,
      endAngle = -270,
      cornerRadius = 4,
      showBackground = true,
      showTooltip = true,
      showLegend = true,
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
    const arcLabelPosition = labelPosition ?? 'insideStart';
    // Stamp each row with its `fill` (the shadcn data-driven pattern) so a real
    // hover resolves the arc color in the tooltip — recharts' RadialBar, like
    // Funnel, carries no per-arc color on the tooltip payload item.
    const seriesData: Record<string, string | number>[] = data.map((row) => ({
      ...row,
      fill: `var(--color-${row[nameKey]})`,
    }));

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer config={config} className="size-full">
          <RechartsRadialBarChart
            data={seriesData}
            dataKey={dataKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
          >
            {showTooltip && (
              <ChartTooltip
                content={
                  tooltipContent ?? (
                    <ChartTooltipContent nameKey={nameKey} hideLabel />
                  )
                }
              />
            )}
            <RadialBar
              dataKey={dataKey}
              background={showBackground}
              cornerRadius={cornerRadius}
              {...animation}
            >
              {seriesData.map((entry, index) => (
                // Keyed by index, not the name: two arcs could share a nameKey
                // value, which would collide as a React key. Same-named arcs
                // intentionally share a color/config entry via `--color-<name>`.
                <Cell key={index} fill={`var(--color-${entry[nameKey]})`} />
              ))}
              {showLabels && (
                <LabelList
                  dataKey={dataKey}
                  position={arcLabelPosition}
                  formatter={toLabelFormatter(labelFormatter)}
                  className={resolveLabelFillClass(arcLabelPosition)}
                  fontSize={CHART_LABEL_FONT_SIZE}
                />
              )}
            </RadialBar>
            {showLegend && (
              <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
            )}
          </RechartsRadialBarChart>
        </ChartContainer>
      </div>
    );
  }
);
RadialBarChart.displayName = 'RadialBarChart';

export { RadialBarChart };
