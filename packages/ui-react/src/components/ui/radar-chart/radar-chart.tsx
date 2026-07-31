'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
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
  type CartesianLabelPosition,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives — the first
// polar chart type. The single CVA axis is the design's Radar-chart variant set:
// `gridType` (the polar web is drawn as straight-edged `polygon` rings or smooth
// `circle` rings). The class stays empty because recharts' SVG — not CSS — draws
// the web: `gridType` drives `<PolarGrid gridType>`. CVA is kept so the variant
// set is a first-class, spec-conformant part of the API (matched against
// ui-spec's api.yaml enums) and exposed via `VariantProps`; the resolved value is
// also mirrored onto `data-grid-type`.
const radarChartVariants = cva('', {
  variants: {
    gridType: {
      polygon: '',
      circle: '',
    },
  },
  defaultVariants: {
    gridType: 'polygon',
  },
});

export interface RadarChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof radarChartVariants>,
    ChartAnimationProps,
    ChartDataLabelProps {
  /** Row-per-axis data. Each object holds the `angleKey` label + one numeric field per series. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-series map of `label` / `color` (imported from the shared `Chart`
   * primitives). Turned into `--color-<key>` custom properties. Series colors
   * are caller-supplied — reference an existing semantic `--ui-*` token; there is
   * no chart palette tier yet.
   */
  config: ChartConfig;
  /** Series to plot — one `<Radar>` per key. Each must exist in `config` and in every data row. */
  dataKeys: string[];
  /** The categorical axis key placed around the web (e.g. `"subject"`). */
  angleKey: string;
  /** Fill opacity of each radar area. */
  fillOpacity?: number;
  /** Stroke width of each radar outline. */
  strokeWidth?: number;
  /** Render a dot at each axis point. */
  showDots?: boolean;
  /** Render the polar grid (the web). */
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
  /** Position of the value labels when `showLabels` is on. Defaults to `top`. */
  labelPosition?: CartesianLabelPosition;
}

// Distance from the polygon to the category tick text when value labels are on
// (recharts' default is 8). Has to clear a CHART_LABEL_FONT_SIZE line plus the
// LabelList's own 5px offset, or the topmost vertex's value overlaps its tick.
const RADAR_LABEL_TICK_SIZE = 30;

const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      className,
      config,
      data,
      dataKeys,
      angleKey,
      gridType = 'polygon',
      fillOpacity = 0.3,
      strokeWidth = 2,
      showDots = false,
      showGrid = true,
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
    const radarLabelPosition = labelPosition ?? 'top';
    return (
      <div
        ref={ref}
        data-grid-type={gridType}
        className={cn(radarChartVariants({ gridType }), className)}
        {...props}
      >
        <ChartContainer
          config={config}
          // The shared container themes cartesian axis ticks but not polar ones,
          // so scope the angle-axis (spoke) labels to the muted-foreground token
          // here — otherwise they render near-black and vanish in dark mode. This
          // is a shared-primitives gap (a Chart task); worked around locally, not
          // by editing chart.tsx.
          className="size-full [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground"
        >
          <RechartsRadarChart data={data as readonly unknown[]}>
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            {showGrid && <PolarGrid gridType={gridType ?? 'polygon'} />}
            <PolarAngleAxis
              dataKey={angleKey}
              // Push the category ticks out when value labels are on. recharts
              // gives a Radar's label list a *cartesian* viewBox (width/height 0
              // at the vertex), so `top` offsets straight up in screen space —
              // at the topmost vertex the value lands on its own category tick.
              // The tick text is drawn at `outerRadius + tickSize`, so this is
              // the only lever that adds *absolute* clearance: shrinking
              // outerRadius scales the tick ring down with the polygon and keeps
              // the overlap.
              tickSize={showLabels ? RADAR_LABEL_TICK_SIZE : undefined}
            />
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key) => (
              <Radar
                key={key}
                dataKey={key}
                stroke={`var(--color-${key})`}
                fill={`var(--color-${key})`}
                fillOpacity={fillOpacity}
                strokeWidth={strokeWidth}
                dot={showDots ? { r: 3 } : false}
                {...animation}
              >
                {showLabels && (
                  <LabelList
                    dataKey={key}
                    position={radarLabelPosition}
                    formatter={toLabelFormatter(labelFormatter)}
                    className={resolveLabelFillClass(radarLabelPosition)}
                    fontSize={CHART_LABEL_FONT_SIZE}
                  />
                )}
              </Radar>
            ))}
          </RechartsRadarChart>
        </ChartContainer>
      </div>
    );
  }
);
RadarChart.displayName = 'RadarChart';

export { RadarChart, radarChartVariants };
