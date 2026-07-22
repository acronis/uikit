'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
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
  type ChartConfig,
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
    VariantProps<typeof radarChartVariants> {
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
}

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
      ...props
    },
    ref
  ) => {
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
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showGrid && <PolarGrid gridType={gridType ?? 'polygon'} />}
            <PolarAngleAxis dataKey={angleKey} />
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
                isAnimationActive={false}
              />
            ))}
          </RechartsRadarChart>
        </ChartContainer>
      </div>
    );
  }
);
RadarChart.displayName = 'RadarChart';

export { RadarChart, radarChartVariants };
