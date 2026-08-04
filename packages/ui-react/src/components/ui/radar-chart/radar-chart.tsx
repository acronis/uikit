'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  type AxisDomainItem,
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

/** Per-series overrides, keyed by the series' `dataKeys` entry. */
export interface RadarChartSeriesSettings {
  /**
   * Fill for this series' area, overriding its `config` color. Reference an
   * existing semantic `--ui-*` token, same as `config`.
   */
  color?: string;
  /**
   * Outline color, when it should read differently from the fill (e.g. a solid
   * outline over a barely-tinted area). Defaults to the fill.
   */
  stroke?: string;
  /** Fill opacity for this series, overriding the chart-level `fillOpacity`. */
  fillOpacity?: number;
  /** Outline width for this series, overriding the chart-level `strokeWidth`. */
  strokeWidth?: number;
  /** Per-point dots for this series, overriding the chart-level `showDots`. */
  dot?: boolean;
  /** Dot radius for this series, overriding the chart-level `dotRadius`. */
  dotRadius?: number;
  /**
   * Highlight this series' hovered point, overriding the chart-level
   * `activeDot`.
   */
  activeDot?: boolean;
}

/**
 * Map the `radiusAxisDomain` preset to a recharts radius-axis `domain`. Exported
 * for unit tests; not part of the package's public API.
 *
 * The radius axis is what scales the web, so this is the difference between "the
 * largest value in the data reaches the outer ring" (recharts' own behavior, and
 * what an unset preset keeps) and "the outer ring is a known maximum" (`fixed`
 * plus `radiusAxisDomainMax`). The two only mean something together: a `fixed`
 * preset with no maximum falls back to the data's own top, i.e. that same
 * default.
 */
export function radarRadiusAxisDomain(
  preset: 'auto' | 'fixed' | undefined,
  max: number | undefined
): Readonly<[AxisDomainItem, AxisDomainItem]> | undefined {
  switch (preset) {
    case 'auto':
      return ['auto', 'auto'];
    case 'fixed':
      return [0, max ?? 'auto'];
    default:
      return undefined;
  }
}

export interface RadarChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof radarChartVariants>,
    ChartAnimationProps,
    ChartDataLabelProps {
  /**
   * Row-per-axis data. Each object holds the `angleKey` label + one numeric field
   * per series. Every plotted series needs a value in every row: recharts places a
   * missing one at the centre, which reads as a zero rather than as a gap.
   */
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
  /**
   * Per-series style overrides, keyed by a `dataKeys` entry — color, outline, and
   * dots for one series while the rest keep the chart-level values. Keys that
   * aren't plotted are ignored. An overridden color follows through to that
   * series' legend swatch and tooltip indicator.
   */
  seriesSettings?: Record<string, RadarChartSeriesSettings>;
  /** Fill opacity of each radar area. */
  fillOpacity?: number;
  /** Stroke width of each radar outline. */
  strokeWidth?: number;
  /** Render a dot at each axis point. */
  showDots?: boolean;
  /** Radius of the per-point dots when `showDots` is on. */
  dotRadius?: number;
  /**
   * Enlarge the hovered point's dot. On by default (recharts' behavior) — pass
   * `false` for a chart that shouldn't react to the pointer at all.
   */
  activeDot?: boolean;
  /** Render the polar grid (the web). */
  showGrid?: boolean;
  /**
   * Draw the grid's spokes — the radial lines from the centre out to each
   * category. Defaults to `true`; off leaves only the concentric rings.
   */
  radialLines?: boolean;
  /**
   * Render the categorical axis around the web (its spoke labels, tick lines,
   * and outer line). Defaults to `true`. Turning it off keeps the axis itself —
   * so the tooltip still names each category — and only hides its chrome.
   */
  showAngleAxis?: boolean;
  /** Place the spoke labels outside the web (default) or inside it. */
  angleAxisOrientation?: 'inner' | 'outer';
  /** Draw the line around the web that the spoke labels sit against. Defaults to `true`. */
  angleAxisLine?: boolean;
  /**
   * Shape of that line: straight-edged `polygon` (recharts' default) or a smooth
   * `circle`. Independent of `gridType`, so pair them to keep a circular web's
   * outline circular too.
   */
  angleAxisLineType?: 'polygon' | 'circle';
  /** Draw a tick line from the axis line to each spoke label. Defaults to `true`. */
  angleTickLine?: boolean;
  /**
   * Distance from the web to the spoke labels, in px (recharts' default is 8).
   * Left alone, `showLabels` widens it so a vertex's value can't land on its own
   * category label.
   */
  angleTickSize?: number;
  /**
   * Render the value scale — a radial axis of ticks from the centre outward, so
   * an area can be read as a number and not only compared to its neighbours.
   * Defaults to `false` (recharts draws no radius axis unless asked).
   *
   * The `radiusAxisAngle` / `radiusAxisOrientation` / `radiusAxisTickCount` knobs
   * describe that drawn scale, so they need it shown. `radiusAxisDomain` and
   * `radiusAxisReversed` also apply while it's hidden — they scale the web.
   */
  showRadiusAxis?: boolean;
  /**
   * Angle the value scale is drawn at, in degrees counter-clockwise from 3
   * o'clock (recharts' default is `0`). Point it along a spoke — or between two
   * — so its ticks don't sit on top of the areas.
   */
  radiusAxisAngle?: number;
  /** Which side of the scale its tick labels sit on. Defaults to `right`. */
  radiusAxisOrientation?: 'left' | 'right' | 'middle';
  /**
   * How the value scale is bounded — and with it the web, since the radius axis
   * is what maps a value to a radius:
   *
   * - unset — recharts' own scaling: the data's largest value reaches the outer
   *   ring, so two charts of the same metric aren't comparable.
   * - `fixed` — pin the outer ring to `radiusAxisDomainMax` (the metric's own
   *   maximum, e.g. a score out of 150), which is what makes a radar readable as
   *   an absolute profile rather than a relative one.
   * - `auto` — fit the data at both ends; the scale need not start at 0.
   *
   * Takes effect whether or not the scale is shown, so a chart can be scaled to a
   * known maximum without displaying the ticks.
   */
  radiusAxisDomain?: 'auto' | 'fixed';
  /** The value at the outer ring when `radiusAxisDomain` is `fixed`. */
  radiusAxisDomainMax?: number;
  /** Desired number of ticks on the value scale (a hint, not exact). */
  radiusAxisTickCount?: number;
  /**
   * Invert the value scale — the maximum at the centre and 0 at the outer ring —
   * for a metric where less is better (latency, error rate), so a good profile
   * still reads as a large area.
   */
  radiusAxisReversed?: boolean;
  /** Horizontal centre of the web, in px or a percentage of the width. Defaults to `50%`. */
  cx?: number | string;
  /** Vertical centre of the web, in px or a percentage of the height. Defaults to `50%`. */
  cy?: number | string;
  /** Angle the first category sits at, in degrees. Defaults to `90` (12 o'clock). */
  startAngle?: number;
  /**
   * Angle the sweep ends at, in degrees. Defaults to `-270` — a full turn
   * clockwise from `startAngle`. Together the two rotate the web (or wrap the
   * categories into a partial sweep).
   */
  endAngle?: number;
  /**
   * Radius of the hole at the centre, in px or a percentage of the available
   * radius. Defaults to `0`. Also lifts the grid and the areas off the centre,
   * which separates the series where they all bottom out.
   */
  innerRadius?: number | string;
  /** Outer radius of the web, in px or a percentage of the available radius. Defaults to `80%`. */
  outerRadius?: number | string;
  /** Plot-area margin, in px. Omit to use recharts' default (5 on every side). */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showTooltip?: boolean;
  showLegend?: boolean;
  /** Which side of the chart the legend sits on. Defaults to `bottom`. */
  legendPosition?: 'top' | 'bottom';
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
      seriesSettings,
      gridType = 'polygon',
      fillOpacity = 0.3,
      strokeWidth = 2,
      showDots = false,
      dotRadius = 3,
      activeDot,
      showGrid = true,
      radialLines = true,
      showAngleAxis = true,
      angleAxisOrientation,
      angleAxisLine = true,
      angleAxisLineType,
      angleTickLine = true,
      angleTickSize,
      showRadiusAxis = false,
      radiusAxisAngle,
      radiusAxisOrientation,
      radiusAxisDomain,
      radiusAxisDomainMax,
      radiusAxisTickCount,
      radiusAxisReversed = false,
      cx,
      cy,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
      margin,
      showTooltip = true,
      showLegend = true,
      legendPosition = 'bottom',
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
    const radiusDomain = radarRadiusAxisDomain(
      radiusAxisDomain,
      radiusAxisDomainMax
    );
    // The radius axis is only mounted when it has something to do: it either
    // paints the scale, or it carries a domain/reversal that rescales the web
    // (recharts registers those from the element even when nothing is drawn).
    // Without one of the three, leaving the element out keeps recharts' own
    // implicit axis — and every existing chart's geometry.
    const hasRadiusAxis =
      showRadiusAxis || radiusDomain !== undefined || radiusAxisReversed;

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
          // so scope the angle-axis (spoke) labels and the radius-axis scale to
          // the muted-foreground / border tokens here — otherwise they render
          // near-black (or recharts' raw `#ccc`) and vanish in dark mode. This
          // is a shared-primitives gap (a Chart task); worked around locally, not
          // by editing chart.tsx.
          className="size-full [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground [&_.recharts-polar-radius-axis-line]:stroke-border [&_.recharts-polar-radius-axis-tick_text]:fill-muted-foreground"
        >
          <RechartsRadarChart
            data={data as readonly unknown[]}
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            margin={margin}
          >
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? <ChartTooltipContent />} />
            )}
            {showGrid && (
              <PolarGrid gridType={gridType ?? 'polygon'} radialLines={radialLines} />
            )}
            <PolarAngleAxis
              dataKey={angleKey}
              orientation={angleAxisOrientation}
              axisLineType={angleAxisLineType}
              // `showAngleAxis` hides the chrome rather than dropping the axis:
              // the angle axis is also what maps a row to its category name, so
              // removing it would leave the tooltip labelling rows by index.
              tick={showAngleAxis}
              axisLine={showAngleAxis && angleAxisLine}
              tickLine={showAngleAxis && angleTickLine}
              // Push the category ticks out when value labels are on. recharts
              // gives a Radar's label list a *cartesian* viewBox (width/height 0
              // at the vertex), so `top` offsets straight up in screen space —
              // at the topmost vertex the value lands on its own category tick.
              // The tick text is drawn at `outerRadius + tickSize`, so this is
              // the only lever that adds *absolute* clearance: shrinking
              // outerRadius scales the tick ring down with the polygon and keeps
              // the overlap.
              tickSize={
                angleTickSize ?? (showLabels ? RADAR_LABEL_TICK_SIZE : undefined)
              }
            />
            {hasRadiusAxis && (
              <PolarRadiusAxis
                angle={radiusAxisAngle}
                orientation={radiusAxisOrientation}
                domain={radiusDomain}
                tickCount={radiusAxisTickCount}
                reversed={radiusAxisReversed}
                tick={showRadiusAxis}
                axisLine={showRadiusAxis}
              />
            )}
            {showLegend && (
              <ChartLegend
                verticalAlign={legendPosition}
                content={<ChartLegendContent verticalAlign={legendPosition} />}
              />
            )}
            {dataKeys.map((key) => {
              const settings = seriesSettings?.[key];
              const fill = settings?.color ?? `var(--color-${key})`;
              const seriesDot = settings?.dot ?? showDots;
              const seriesActiveDot = settings?.activeDot ?? activeDot;
              return (
                <Radar
                  key={key}
                  dataKey={key}
                  stroke={settings?.stroke ?? fill}
                  fill={fill}
                  fillOpacity={settings?.fillOpacity ?? fillOpacity}
                  strokeWidth={settings?.strokeWidth ?? strokeWidth}
                  dot={
                    seriesDot ? { r: settings?.dotRadius ?? dotRadius } : false
                  }
                  activeDot={seriesActiveDot}
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
              );
            })}
          </RechartsRadarChart>
        </ChartContainer>
      </div>
    );
  }
);
RadarChart.displayName = 'RadarChart';

export { RadarChart, radarChartVariants };
