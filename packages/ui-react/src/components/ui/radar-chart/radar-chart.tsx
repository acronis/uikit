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
  type ResolvedAnimation,
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
   *
   * recharts derives a Radar's legend/tooltip color from its stroke first, so
   * setting this alone also recolors that series' legend swatch and tooltip dot
   * — set `color` too if the marker should keep following the fill.
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
      // A maximum that isn't a positive, finite number can't bound a scale that
      // grows outward from 0: `[0, 0]` collapses the web onto its centre and a
      // negative inverts it. A computed max (`Math.max` over an empty or all-zero
      // series) reaches this, so fall back to the data's own top — the same
      // behavior as `fixed` with no maximum at all.
      return [0, max !== undefined && Number.isFinite(max) && max > 0 ? max : 'auto'];
    default:
      return undefined;
  }
}

/** The chart-level styling a `seriesSettings` entry overrides. */
export interface RadarSeriesDefaults {
  fillOpacity: number;
  strokeWidth: number;
  showDots: boolean;
  dotRadius: number;
  activeDot: boolean | undefined;
}

/** Resolved recharts `<Radar>` styling for one series. */
export interface RadarSeriesStyle {
  fill: string;
  stroke: string;
  fillOpacity: number;
  strokeWidth: number;
  dot: { r: number } | false;
  activeDot: boolean | undefined;
}

/**
 * Fold a series' `seriesSettings` entry over the chart-level styling. Exported
 * for unit tests; not part of the package's public API.
 *
 * Every fallback is `??`, not `||`, so a deliberate falsy override survives —
 * `fillOpacity: 0` (outline only), `strokeWidth: 0` (fill only), `dot: false`
 * and `activeDot: false` all have to beat a truthy chart-level value. An
 * un-overridden fill stays the `--color-<key>` custom property the shared
 * `ChartContainer` injects from `config`, so the series a caller doesn't name
 * keeps reading its config color.
 */
export function radarSeriesStyle(
  key: string,
  settings: RadarChartSeriesSettings | undefined,
  defaults: RadarSeriesDefaults
): RadarSeriesStyle {
  const fill = settings?.color ?? `var(--color-${key})`;
  const dot = settings?.dot ?? defaults.showDots;
  return {
    fill,
    stroke: settings?.stroke ?? fill,
    fillOpacity: settings?.fillOpacity ?? defaults.fillOpacity,
    strokeWidth: settings?.strokeWidth ?? defaults.strokeWidth,
    dot: dot ? { r: settings?.dotRadius ?? defaults.dotRadius } : false,
    activeDot: settings?.activeDot ?? defaults.activeDot,
  };
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
   * aren't plotted are ignored. An overridden `color` — or `stroke`, which
   * recharts reads first — follows through to that series' legend swatch and
   * tooltip dot.
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
   * `radiusAxisAngle` and `radiusAxisOrientation` only describe the drawn scale,
   * so they need it shown. `radiusAxisDomain`, `radiusAxisReversed` and
   * `radiusAxisTickCount` apply while it's hidden too — the first two scale the
   * web, and the third sets how many rings the grid draws (recharts takes the
   * grid's concentric radii from the radius axis' ticks).
   */
  showRadiusAxis?: boolean;
  /**
   * Angle the value scale is drawn at, in degrees counter-clockwise from 3
   * o'clock (recharts' default is `0`). Point it *between* two spokes: on a
   * spoke, the outermost tick collides with that category's own label.
   *
   * The ticks sit over the areas at any angle — a radar's plot area is its
   * areas — so this trades one overlap for none of the other.
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
  /**
   * The value at the outer ring when `radiusAxisDomain` is `fixed`. Must be
   * positive — a `0` or negative maximum can't bound an outward-growing scale, so
   * it falls back to the data's own top.
   */
  radiusAxisDomainMax?: number;
  /**
   * Desired number of ticks on the value scale (a hint, not exact). Defaults to
   * recharts' `5`. Also sets how many rings the grid draws, whether or not the
   * scale itself is shown.
   */
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
  /**
   * Plot-area margin, in px. Omit it entirely to use recharts' default (5 on
   * every side) — passing the object replaces all four, and recharts fills the
   * sides you leave out with `0`, not with `5`. Name every side you want.
   */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showTooltip?: boolean;
  showLegend?: boolean;
  /** Which side of the chart the legend sits on. Defaults to `bottom`. */
  legendPosition?: 'top' | 'bottom';
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting, per-series rows, or extra fields without composing
   * recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
  /** Position of the value labels when `showLabels` is on. Defaults to `top`. */
  labelPosition?: CartesianLabelPosition;
}

// Distance from the polygon to the category tick text when value labels are on
// (recharts' default is 8). Has to clear a CHART_LABEL_FONT_SIZE line plus the
// LabelList's own 5px offset, or the topmost vertex's value overlaps its tick.
const RADAR_LABEL_TICK_SIZE = 30;

/**
 * One series' `<Radar>` (and its value labels).
 *
 * Called as a plain function, never mounted as `<RadarSeries />`: recharts
 * matches a chart's children by element *type*, so a wrapper component would
 * hide the `<Radar>` from `RadarChart`'s child scan — and the `<LabelList>` from
 * `Radar`'s — and the series would simply not be drawn.
 */
function radarSeries({
  seriesKey,
  style,
  animation,
  showLabels,
  labelPosition,
  labelFormatter,
}: {
  seriesKey: string;
  style: RadarSeriesStyle;
  animation: ResolvedAnimation;
  showLabels: boolean;
  labelPosition: CartesianLabelPosition;
  labelFormatter: ChartDataLabelProps['labelFormatter'];
}) {
  return (
    <Radar
      key={seriesKey}
      dataKey={seriesKey}
      stroke={style.stroke}
      fill={style.fill}
      fillOpacity={style.fillOpacity}
      strokeWidth={style.strokeWidth}
      dot={style.dot}
      activeDot={style.activeDot}
      {...animation}
    >
      {showLabels && (
        <LabelList
          dataKey={seriesKey}
          position={labelPosition}
          formatter={toLabelFormatter(labelFormatter)}
          // A radar area is a flat `fillOpacity`, so an `inside*` label sits on
          // the *surface tinted by* the series color, not on the color itself —
          // the white on-fill token disappears into it in light mode. Same call
          // as the other translucent families (Area, the composed chart's areas).
          className={resolveLabelFillClass(labelPosition, {
            translucentSeries: true,
          })}
          fontSize={CHART_LABEL_FONT_SIZE}
        />
      )}
    </Radar>
  );
}

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
    const seriesDefaults: RadarSeriesDefaults = {
      fillOpacity,
      strokeWidth,
      showDots,
      dotRadius,
      activeDot,
    };

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
            {dataKeys.map((key) =>
              radarSeries({
                seriesKey: key,
                style: radarSeriesStyle(
                  key,
                  seriesSettings?.[key],
                  seriesDefaults
                ),
                animation,
                showLabels,
                labelPosition: radarLabelPosition,
                labelFormatter,
              })
            )}
          </RechartsRadarChart>
        </ChartContainer>
      </div>
    );
  }
);
RadarChart.displayName = 'RadarChart';

export { RadarChart, radarChartVariants };
