'use client';

import * as React from 'react';
import {
  Cell,
  Label,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from 'recharts';

import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  resolveChartColors,
  resolveLabelFillClass,
  CHART_DEFAULT_PALETTE,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartPalette,
  type ChartAnimationProps,
  type ChartDataLabelProps,
  type ChartTooltipContentProps,
  type PolarLabelPosition,
  type ResolvedAnimation,
  type TickFormatter,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives (a polar/radial
// type). Rows become concentric arcs sized by `dataKey`, each colored from its
// `--color-<name>` var; `dataKeys` switches to one arc per metric instead. Like
// ScatterChart/ComposedChart there's no CVA variant: a radial bar's
// expressiveness is geometry (angles/radii, plain props) and the data mapping,
// not a visual "mode". The angular sweep is exposed as startAngle/endAngle props
// so a caller can build a gauge or a full ring.

/** Row-per-arc datum: the `nameKey` label plus each metric's numeric value. */
type RadialBarChartDatum = Record<string, string | number>;

/** What an arc's data label reads. */
export type RadialBarChartLabelFormat = 'value' | 'name-value';

export interface RadialBarChartCenterLabel {
  // Rendered as SVG <text>, which only lays out text — hence string | number,
  // not ReactNode.
  /** Headline metric rendered large in the hole (e.g. the gauge's value). */
  value?: string | number;
  /** Caption rendered under the value. */
  label?: string | number;
}

/**
 * The readout in the hole at the centre of the arcs — a headline value over a
 * caption. Rendered as a recharts `<Label>`, which is what supplies the polar
 * viewBox the text centres itself on.
 *
 * There is one readout for the whole chart, so it hangs off the first series
 * drawn — every series shares the same viewBox.
 */
function RadialBarChartCenterLabelContent({
  centerLabel,
}: {
  centerLabel: RadialBarChartCenterLabel;
}) {
  return (
    <Label
      content={({ viewBox }) => {
        if (!viewBox || !('cx' in viewBox)) return null;
        const { cx: centerX = 0, cy: centerY = 0 } = viewBox as {
          cx?: number;
          cy?: number;
        };
        const hasValue = centerLabel.value != null;
        const hasLabel = centerLabel.label != null;
        // Straddle the centre when both lines show, so the value + label block
        // is centered as a whole (not just the value).
        const both = hasValue && hasLabel;
        return (
          <g>
            {hasValue && (
              <text
                x={centerX}
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
                x={centerX}
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
  );
}

/**
 * Compose one arc's data-label text. Exported for unit tests; not part of the
 * package's public API.
 *
 * `labelFormatter` only ever formats the numeric part, so a chart's labels and
 * its tooltip stay in the same units under either format. A nullish value yields
 * an empty label, which recharts renders as no `<text>` at all.
 */
export function radialBarChartLabelText(options: {
  format: RadialBarChartLabelFormat;
  name: string | number | undefined;
  value: string | number | undefined;
  formatter?: TickFormatter;
}): string {
  const { format, name, value, formatter } = options;
  if (value == null) return '';
  const valueText = formatter ? formatter(value) : String(value);
  return format === 'name-value' && name != null
    ? `${name}: ${valueText}`
    : valueText;
}

/** One piece of a segmented gauge's ring: a length in degrees and what it is. */
export interface RadialBarChartSegment {
  /** Synthetic series key — stable for a given (index, kind). */
  key: string;
  /** Angular length of the piece, in degrees. */
  degrees: number;
  /** `value` is the metric, `track` the unreached remainder, `gap` the notch. */
  kind: 'value' | 'track' | 'gap';
}

/** Fallback gap between a segmented gauge's segments, in degrees. */
const SEGMENT_GAP = 3;

/**
 * Cut a gauge's sweep into equal segments separated by gaps, and split the
 * segment the value ends inside into its reached and unreached parts. Exported
 * for unit tests; not part of the package's public API.
 *
 * Lengths come back in **degrees**, which is what lets the ring be built as one
 * stack of synthetic series over a `[0, sweep]` angular scale: recharts lays
 * stacked radial bars out sequentially along the angle, so a transparent series
 * between two colored ones reads as a real notch in the ring. A `gap` that
 * would leave no room for the segments themselves is clamped.
 */
export function radialBarChartSegments(options: {
  value: number;
  domain: [number, number];
  segments: number;
  gap: number;
  /** Absolute sweep of the chart, in degrees. */
  sweep: number;
  /** A full-circle sweep also needs a gap between the last segment and the first. */
  closed: boolean;
}): RadialBarChartSegment[] {
  const { value, domain, segments, sweep, closed } = options;
  const gapCount = closed ? segments : segments - 1;
  // Leave at least half the sweep for the segments, however wide a gap is asked
  // for — an all-gap ring would render as nothing at all. A negative gap would
  // stretch the pieces past the sweep and overlap them, so it floors at zero.
  const gap =
    gapCount > 0
      ? Math.min(Math.max(options.gap, 0), sweep / (2 * gapCount))
      : 0;
  const segmentDegrees = (sweep - gap * gapCount) / segments;
  const [min, max] = domain;
  const span = max - min;
  // A domain with no span (`[n, n]`) or an inverted one (`[max, min]`) cannot
  // place a value on the ring at all, so there is no fraction to draw and the
  // ring stays empty. It deliberately does not fall back to comparing the value
  // against zero: that reported a *full* ring for `{ value: 5, domain: [100,
  // 100] }`, i.e. claimed completion the data never supported. For a gauge,
  // under-reading a domain that says nothing is the safe direction.
  const fraction =
    span > 0 ? Math.min(Math.max((value - min) / span, 0), 1) : 0;
  // The value maps onto the *drawn* ring, so the gaps never eat into it.
  let remainingValue = fraction * segmentDegrees * segments;

  const pieces: RadialBarChartSegment[] = [];
  for (let index = 0; index < segments; index++) {
    const reached = Math.min(Math.max(remainingValue, 0), segmentDegrees);
    remainingValue -= reached;
    // Both halves are always emitted, including at zero length: a stable key set
    // keeps recharts' series identities steady as the value changes.
    pieces.push({ key: `seg-${index}-value`, degrees: reached, kind: 'value' });
    pieces.push({
      key: `seg-${index}-track`,
      degrees: segmentDegrees - reached,
      kind: 'track',
    });
    if (gap > 0 && (closed || index < segments - 1)) {
      pieces.push({ key: `seg-${index}-gap`, degrees: gap, kind: 'gap' });
    }
  }
  return pieces;
}

/**
 * Fill for one piece of a segmented gauge's ring. Exported for unit tests and so
 * the forced-open tooltip story can build a ring from the real implementation
 * rather than a copy of it; not part of the package's public API.
 */
export function radialBarChartSegmentFill(
  kind: RadialBarChartSegment['kind'],
  colorName: string | number
): string {
  if (kind === 'gap') return 'transparent';
  // The unreached remainder plays the part `showBackground`'s track plays on a
  // continuous arc, so it takes the same muted surface.
  return kind === 'track'
    ? 'var(--ui-border-on-status-neutral)'
    : `var(--color-${colorName})`;
}

/**
 * What a segmented gauge's tooltip reads. Exported for unit tests; not part of
 * the package's public API.
 *
 * A segmented ring's series are pieces of geometry, so recharts would offer the
 * hovered piece's own name and length ("seg-3-value", 41.2°). Hovering anywhere
 * on the ring should read the metric instead, so the reading is rebuilt from the
 * data row.
 */
export function radialBarChartSegmentedReading(options: {
  config: ChartConfig;
  row: RadialBarChartDatum;
  nameKey: string;
  dataKey: string;
  /** The `valueDomain` maximum, when the gauge has one. */
  domainMax?: number;
}): { colorName: string; label: React.ReactNode; valueText: string } {
  const { config, row, nameKey, dataKey, domainMax } = options;
  const colorName = String(row[nameKey]);
  const value = row[dataKey];
  const valueText =
    typeof value === 'number' ? value.toLocaleString() : String(value ?? '');
  return {
    colorName,
    label: config[colorName]?.label ?? colorName,
    // The gauge's scale is the other half of the reading, so a known maximum
    // comes along: "29 / 38", not a bare "29".
    valueText:
      domainMax == null
        ? valueText
        : `${valueText} / ${domainMax.toLocaleString()}`,
  };
}

/**
 * The tooltip a segmented gauge shows — the same swatch/name/value layout the
 * default `ChartTooltipContent` row uses, dot included, over the reading from
 * `radialBarChartSegmentedReading`. Exported for the forced-open
 * visual-regression story; not part of the package's public API.
 *
 * `payload` is trimmed to one row: a radial tooltip is axis-shared and collects a
 * row from every series — two dozen identical rows for one metric.
 * (`tooltipType="none"` only tags them, and scoping the tooltip to the hovered
 * item instead would drop it in the corner — unlike Pie/Bar sectors, a RadialBar
 * sector carries no tooltip coordinate.)
 *
 * A real component rather than a closure so it can be handed to `ChartTooltip`
 * as an *element*: recharts `cloneElement`s an element but `createElement`s a
 * function, and a closure rebuilt each render is a new element *type* — which
 * remounts the tooltip on every parent render instead of updating it.
 */
export function RadialBarChartSegmentedTooltipContent({
  active,
  payload,
  ...reading
}: {
  active?: boolean;
  // Loosely typed on purpose: recharts' own payload generics are wider than the
  // shared `ChartTooltipContentProps` accepts, and only the row count matters.
  payload?: readonly unknown[];
  config: ChartConfig;
  row: RadialBarChartDatum;
  nameKey: string;
  dataKey: string;
  domainMax?: number;
}) {
  const { colorName, label, valueText } =
    radialBarChartSegmentedReading(reading);

  return (
    <ChartTooltipContent
      active={active}
      payload={payload?.slice(0, 1) as ChartTooltipContentProps['payload']}
      hideLabel
      formatter={() => (
        <>
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: `var(--color-${colorName})` }}
          />
          <div className="flex flex-1 items-center justify-between gap-2 leading-none">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium tabular-nums text-foreground">
              {valueText}
            </span>
          </div>
        </>
      )}
    />
  );
}

/**
 * The band a multi-metric tooltip's header names. Exported for unit tests; not
 * part of the package's public API.
 *
 * Each tooltip row is one metric, so the header names the band the hovered arc
 * belongs to. recharts' own label is the radius-axis index, which reads as a
 * bare number.
 */
export function radialBarChartBandName(
  row: RadialBarChartDatum | undefined,
  nameKey: string
): string {
  const name = row?.[nameKey];
  return name == null ? '' : String(name);
}

/**
 * What an arc's data label calls the arc: the row's own `nameKey` value, or — in
 * multi-metric mode, where one arc *is* one metric — that metric's `config` label.
 */
function radialBarChartArcName(options: {
  key: string;
  row: RadialBarChartDatum | undefined;
  isMultiMetric: boolean;
  nameKey: string;
  config: ChartConfig;
}): string | number | undefined {
  const { key, row, isMultiMetric, nameKey, config } = options;
  if (!isMultiMetric) return row?.[nameKey];
  // ChartConfig labels are ReactNode; only a plain string/number can go into an
  // SVG <text>.
  const label = config[key]?.label;
  return typeof label === 'string' || typeof label === 'number' ? label : key;
}

/**
 * The default mapping's arcs: one `RadialBar` per series — one for the single
 * `dataKey`, or one per `dataKeys` entry in multi-metric mode — drawn
 * concentrically.
 *
 * recharts collects its graphical items from the store (each `RadialBar`
 * registers itself on render) rather than by scanning the chart's children for
 * their types, so grouping them inside a component of our own is invisible to it.
 * The `Cell`s stay direct children of their `RadialBar`, which *does* read its own
 * children by type.
 */
function RadialBarChartSeries({
  seriesKeys,
  seriesData,
  isMultiMetric,
  config,
  nameKey,
  showBackground,
  cornerRadius,
  minPointSize,
  animation,
  centerLabel,
  showLabels,
  labelPosition,
  labelFormat,
  labelFormatter,
}: {
  seriesKeys: string[];
  seriesData: RadialBarChartDatum[];
  isMultiMetric: boolean;
  config: ChartConfig;
  nameKey: string;
  showBackground: boolean;
  cornerRadius: number;
  minPointSize: number | undefined;
  animation: ResolvedAnimation;
  centerLabel: RadialBarChartCenterLabel | undefined;
  showLabels: boolean;
  labelPosition: PolarLabelPosition;
  labelFormat: RadialBarChartLabelFormat;
  labelFormatter?: TickFormatter;
}) {
  return seriesKeys.map((key, seriesIndex) => (
    <RadialBar
      key={key}
      dataKey={key}
      fill={isMultiMetric ? `var(--color-${key})` : undefined}
      background={showBackground ? { fill: 'var(--ui-border-on-status-neutral)' } : false}
      cornerRadius={cornerRadius}
      minPointSize={minPointSize}
      {...animation}
    >
      {!isMultiMetric &&
        seriesData.map((entry, index) => (
          // Keyed by index, not the name: two arcs could share a nameKey
          // value, which would collide as a React key. Same-named arcs
          // intentionally share a color/config entry via `--color-<name>`.
          <Cell key={index} fill={`var(--color-${entry[nameKey]})`} />
        ))}
      {seriesIndex === 0 && centerLabel && (
        <RadialBarChartCenterLabelContent centerLabel={centerLabel} />
      )}
      {showLabels && (
        <LabelList
          // `valueAccessor` rather than `dataKey`: the label text can
          // carry the arc's name, which only the whole row (single
          // metric) or the metric's config entry can supply. recharts
          // ignores the accessor when a dataKey is set, so the two
          // can't be combined.
          valueAccessor={(entry) =>
            radialBarChartLabelText({
              format: labelFormat,
              name: radialBarChartArcName({
                key,
                row: entry.payload as RadialBarChartDatum | undefined,
                isMultiMetric,
                nameKey,
                config,
              }),
              value: entry.value as string | number | undefined,
              formatter: labelFormatter,
            })
          }
          position={labelPosition}
          className={resolveLabelFillClass(labelPosition)}
          fontSize={CHART_LABEL_FONT_SIZE}
        />
      )}
    </RadialBar>
  ));
}

/**
 * A segmented gauge's ring: the pieces from `radialBarChartSegments` as one stack
 * of synthetic series, so they lay out sequentially around the ring instead of
 * concentrically and the `gap` pieces read as notches.
 */
function RadialBarChartSegmentedSeries({
  ringSegments,
  row,
  nameKey,
  cornerRadius,
  animation,
  centerLabel,
}: {
  ringSegments: RadialBarChartSegment[];
  row: RadialBarChartDatum;
  nameKey: string;
  cornerRadius: number;
  animation: ResolvedAnimation;
  centerLabel: RadialBarChartCenterLabel | undefined;
}) {
  return ringSegments.map((segment, index) => (
    <RadialBar
      key={segment.key}
      dataKey={segment.key}
      stackId="segments"
      // The metric's name, so the hover has a row to key off at all
      // (`ChartTooltipContent` keys its row off `name`).
      name={String(row[nameKey])}
      fill={radialBarChartSegmentFill(segment.kind, row[nameKey])}
      cornerRadius={cornerRadius}
      {...animation}
    >
      {index === 0 && centerLabel && (
        <RadialBarChartCenterLabelContent centerLabel={centerLabel} />
      )}
    </RadialBar>
  ));
}

export interface RadialBarChartProps
  extends
    Omit<React.ComponentProps<'div'>, 'children'>,
    ChartAnimationProps,
    ChartDataLabelProps {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** Row-per-arc data. Each object holds the arc's `nameKey` label + its `dataKey` numeric value. */
  data: ReadonlyArray<RadialBarChartDatum>;
  /**
   * Per-arc map of `label` / `icon` / `tone`, keyed by the arc's `nameKey` value
   * — or, in multi-metric mode, by each `dataKeys` entry (imported from the
   * shared `Chart` primitives). Turned into `--color-<name>` custom properties.
   * Series take their colour from the container's `palette`; each entry maps a
   * key to a `label` and an optional `tone`.
   */
  config: ChartConfig;
  /** Numeric field that sizes each arc. Ignored when `dataKeys` is set. */
  dataKey: string;
  /**
   * Plot several metrics instead of one arc per row: one arc per key, colored and
   * named from `config` keyed by the **key** (not by `nameKey`) — the same
   * convention as the cartesian charts. Every metric shares one angular scale, so
   * pair it with `valueDomain` when the metrics are measured against a known
   * maximum. `nameKey` still names the band each metric's arc sits in.
   */
  dataKeys?: string[];
  /**
   * Label field that names each arc (drives the legend, tooltip, and
   * `--color-<name>` lookup). Values should be unique per chart (arcs sharing a
   * name share one `config`/color entry) and CSS-safe — they become part of a
   * custom-property name. In multi-metric mode it names the band rather than the
   * arc, so the legend and colors come from `dataKeys` instead.
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
  /**
   * The value range the sweep represents, as `[min, max]`. Without it every arc
   * is drawn relative to the largest value in the data — so a **single** value
   * always fills the whole sweep, which is never what a gauge means. Set it to
   * the metric's own scale (e.g. `[0, 100]` for a percentage) and each arc
   * becomes that fraction of the sweep, over the `showBackground` track.
   */
  valueDomain?: [number, number];
  /** Corner radius on each arc's ends. */
  cornerRadius?: number;
  /**
   * Horizontal center of the arcs, in px or a percentage of the width.
   * Defaults to the middle (`50%`).
   */
  cx?: number | string;
  /**
   * Vertical center of the arcs, in px or a percentage of the height. Defaults to
   * the middle (`50%`) — worth moving for a half-circle gauge, whose drawn half
   * otherwise sits in the upper half of the surface.
   */
  cy?: number | string;
  /** Thickness of each arc, in px. Omit to let the radii and the gaps size it. */
  barSize?: number;
  /** Gap between the arcs of different metrics in one band, in px. */
  barGap?: number | string;
  /** Gap between bands, in px or a percentage string. */
  barCategoryGap?: number | string;
  /**
   * Smallest angle a non-zero arc may occupy, in degrees, so a tiny value stays
   * visible (and hoverable). recharts applies the floor to a `0` as well, which
   * reads as a small positive value — leave this unset when a metric can
   * legitimately be zero.
   */
  minAngle?: number;
  /** Plot-area margin, in px. Omit to use recharts' default (5 on every side). */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  /**
   * Draw the gauge's ring as this many equal segments, notched apart — the
   * segmented-gauge look. Applies to a **single-value gauge** only and needs
   * `valueDomain` to know what a full ring means. Anything that isn't one — more
   * than one row, `dataKeys` set, fewer than two segments, or a `dataKey` value
   * that isn't a number (a stringified `"29"` off an API) — falls back to the
   * normal concentric arcs, legend included, rather than erroring.
   *
   * The ring is then synthetic geometry rather than data rows, so the arc labels
   * and the legend are suppressed: put the readout in `centerLabel`. The tooltip
   * stays, and reads the metric (with the `valueDomain` maximum when there is
   * one) wherever on the ring it is hovered. `showBackground` is redundant too —
   * the unreached segments *are* the track.
   */
  segments?: number;
  /** Gap between a segmented gauge's segments, in degrees. Defaults to `3`. */
  segmentGap?: number;
  /** Render a muted background track behind each arc. */
  showBackground?: boolean;
  /** Draw the concentric polar grid behind the arcs. */
  showPolarGrid?: boolean;
  /**
   * Custom content for the hole at the center — a headline `value` and/or a
   * `label` caption, stacked and centered. Needs an `innerRadius` big enough to
   * hold the text; it is not clipped to the hole.
   */
  centerLabel?: RadialBarChartCenterLabel;
  showTooltip?: boolean;
  showLegend?: boolean;
  /**
   * Format each arc's value in the list legend. In single-metric mode each arc
   * row gets its formatted value next to its label; in multi-metric mode values
   * are per-row (not per-series) so this is ignored.
   */
  legendValueFormatter?: (value: string | number) => string;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting, per-arc rows, or extra fields without composing
   * recharts yourself. Ignored when `showTooltip` is false.
   *
   * On a segmented gauge it takes over from the built-in reading, and the payload
   * it receives is the ring's synthetic pieces (`seg-2-track`, a length in
   * degrees) rather than data rows — read the metric off `payload[0].payload`.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
  /**
   * Position of the value labels when `showLabels` is on. Defaults to
   * `insideStart` — the labels sit inside each arc, and therefore render in the
   * on-fill label token so they stay legible over the arc colour.
   */
  labelPosition?: PolarLabelPosition;
  /**
   * What each data label reads when `showLabels` is on — the value alone (the
   * default), or the arc's name and its value. The name is the row's `nameKey`
   * value, or the metric's `config` label in multi-metric mode.
   */
  labelFormat?: RadialBarChartLabelFormat;
}

const RadialBarChart = React.forwardRef<HTMLDivElement, RadialBarChartProps>(
  (
    {
      className,
      config,
      palette,
      data,
      dataKey,
      dataKeys,
      nameKey,
      innerRadius = 20,
      outerRadius = 60,
      startAngle = 90,
      endAngle = -270,
      valueDomain,
      cornerRadius = 4,
      cx,
      cy,
      barSize,
      barGap,
      barCategoryGap,
      minAngle,
      margin,
      segments,
      segmentGap = SEGMENT_GAP,
      showBackground = true,
      showPolarGrid = false,
      centerLabel,
      showTooltip = true,
      showLegend = true,
      legendValueFormatter,
      tooltipContent,
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
      showLabels = false,
      labelPosition,
      labelFormat = 'value',
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
    const isMultiMetric = !!dataKeys?.length;
    // A segmented ring is one metric cut into pieces, so it only means anything
    // for a single-row, single-metric chart.
    const isSegmented =
      segments != null &&
      segments > 1 &&
      !isMultiMetric &&
      data.length === 1 &&
      typeof data[0][dataKey] === 'number';
    const seriesKeys = isMultiMetric ? dataKeys! : [dataKey];
    // Stable across renders so the memoized legend content below keeps its
    // identity; `seriesKeys` itself is a fresh array every render.
    const legendKeys = React.useMemo(
      () => (dataKeys?.length ? dataKeys : [dataKey]),
      [dataKeys, dataKey]
    );
    const sweep = Math.abs(endAngle - startAngle);
    const ringSegments = isSegmented
      ? radialBarChartSegments({
          value: data[0][dataKey] as number,
          // Without a domain a lone value is its own maximum, so the ring fills.
          domain: valueDomain ?? [0, data[0][dataKey] as number],
          segments: segments!,
          gap: segmentGap,
          sweep,
          closed: sweep >= 360,
        })
      : [];

    // Stamp each row with its `fill` (the shadcn data-driven pattern) so a real
    // hover resolves the arc color in the tooltip — recharts' RadialBar, like
    // Funnel, carries no per-arc color on the tooltip payload item. Only in
    // single-metric mode: with one color per *metric*, a row-level fill would
    // paint every tooltip swatch the same.
    const seriesData: RadialBarChartDatum[] = isMultiMetric
      ? (data as RadialBarChartDatum[])
      : data.map((row) => ({
          ...row,
          fill: `var(--color-${row[nameKey]})`,
        }));

    // Each piece of the ring becomes a synthetic series on the one row, measured
    // in degrees — see `radialBarChartSegments`. Built from the raw row, *not*
    // from `seriesData`: a row-level `fill` wins over a series' own `fill` in
    // recharts, which would paint the track and the notches the arc's color.
    const plotData: RadialBarChartDatum[] = isSegmented
      ? [
          {
            ...data[0],
            ...Object.fromEntries(ringSegments.map((s) => [s.key, s.degrees])),
          },
        ]
      : seriesData;

    // recharts measures the radial floor in degrees, then extends the arc by
    // `mathSign(deltaAngle || minPointSize)`, where `deltaAngle` is the *arc's*
    // own angular length (RadialBar.js). So for a non-zero arc the floor already
    // grows along the arc's direction whatever sign it carries; the sign only
    // decides which way an arc of exactly zero degrees grows. Carry the sweep's
    // sign so that one grows forwards on a counter-clockwise chart too.
    const minPointSize =
      minAngle === undefined
        ? undefined
        : endAngle < startAngle
          ? -minAngle
          : minAngle;

    // Resolve colors so the external list legend has the same values as the chart
    // plot without needing to be inside ChartContainer's context.
    const resolvedConfigForLegend = React.useMemo(
      () => (showLegend ? resolveChartColors(config, palette ?? CHART_DEFAULT_PALETTE) : null),
      [showLegend, config, palette]
    );
    const rightLegendPayload: LegendPayload[] = React.useMemo(() => {
      if (!resolvedConfigForLegend) return [];
      if (isMultiMetric) {
        // Multi-metric: one entry per dataKey. No per-series row value is
        // meaningful (each metric spans multiple rows), so values are omitted.
        return legendKeys.map((key) => ({
          value: key,
          dataKey: key,
          color: resolvedConfigForLegend[key]?.color ?? `var(--color-${key})`,
          type: 'rect' as const,
          payload: {} as Record<string, unknown>,
        }));
      }
      // Single-metric: one entry per data row.
      return data.map((row) => ({
        value: String(row[nameKey]),
        dataKey: nameKey,
        color:
          resolvedConfigForLegend[String(row[nameKey])]?.color ??
          `var(--color-${String(row[nameKey])})`,
        type: 'rect' as const,
        payload: row as Record<string, unknown>,
      }));
    }, [resolvedConfigForLegend, isMultiMetric, legendKeys, data, nameKey]);

    const hasLegend = showLegend && !isSegmented && !!resolvedConfigForLegend;

    // The built-in tooltip reading, which each mapping composes differently: a
    // segmented ring rebuilds it from the data row, multi-metric renames the
    // header after the band, and the default mapping reads the hovered arc.
    const getDefaultTooltipContent = () => {
      if (isSegmented) {
        return (
          <RadialBarChartSegmentedTooltipContent
            config={config}
            row={data[0]}
            nameKey={nameKey}
            dataKey={dataKey}
            domainMax={valueDomain?.[1]}
          />
        );
      }

      if (isMultiMetric) {
        return (
          <ChartTooltipContent
            labelFormatter={(_, payload) =>
              radialBarChartBandName(
                payload?.[0]?.payload as RadialBarChartDatum | undefined,
                nameKey
              )
            }
          />
        );
      }

      return <ChartTooltipContent nameKey={nameKey} hideLabel />;
    };

    // Shared recharts chart composition (used in both layout modes).
    const radialChartContent = (
      <RechartsRadialBarChart
        data={plotData}
        // Only meaningful for the single-metric mapping; in multi-metric and
        // segmented mode each <RadialBar> carries its own key and the scale
        // spans them all.
        dataKey={isMultiMetric || isSegmented ? undefined : dataKey}
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        barSize={barSize}
        barGap={barGap}
        barCategoryGap={barCategoryGap}
        margin={margin ?? { top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {showPolarGrid && (
          <PolarGrid gridType="circle" radialLines={false} />
        )}
        {(valueDomain || isSegmented) && (
          // The angular scale itself, not chrome: it maps a value onto a
          // fraction of the sweep. Ticks/axis line stay off — the arcs and
          // the optional center readout are the readout. A segmented ring is
          // already measured in degrees, so its scale *is* the sweep.
          <PolarAngleAxis
            type="number"
            domain={isSegmented ? [0, sweep] : valueDomain}
            tick={false}
            axisLine={false}
          />
        )}
        {showTooltip && (
          <ChartTooltip
            // The hover cursor marks which band of the angular axis is
            // active, which on a segmented ring is one metric either way —
            // it just draws a hairline across the gauge.
            cursor={isSegmented ? false : undefined}
            content={tooltipContent ?? getDefaultTooltipContent()}
          />
        )}
        {isSegmented ? (
          <RadialBarChartSegmentedSeries
            ringSegments={ringSegments}
            row={data[0]}
            nameKey={nameKey}
            cornerRadius={cornerRadius}
            animation={animation}
            centerLabel={centerLabel}
          />
        ) : (
          <RadialBarChartSeries
            seriesKeys={seriesKeys}
            seriesData={seriesData}
            isMultiMetric={isMultiMetric}
            config={config}
            nameKey={nameKey}
            showBackground={showBackground}
            cornerRadius={cornerRadius}
            minPointSize={minPointSize}
            animation={animation}
            centerLabel={centerLabel}
            showLabels={showLabels}
            labelPosition={arcLabelPosition}
            labelFormat={labelFormat}
            labelFormatter={labelFormatter}
          />
        )}
      </RechartsRadialBarChart>
    );

    const chartDivSize =
      showLabels && (arcLabelPosition === 'outside' || arcLabelPosition === 'end')
        ? 'size-[200px]'
        : 'size-[120px]';

    return (
      <div
        ref={ref}
        className={cn('flex flex-row items-center gap-4', !hasLegend && 'justify-center', className)}
        {...props}
      >
        <div className={cn(chartDivSize, 'shrink-0')}>
          <ChartContainer config={config} palette={palette} className="size-full">
            {radialChartContent}
          </ChartContainer>
        </div>
        {showLegend && !isSegmented && resolvedConfigForLegend && (
          <ChartLegendContent
            variant="list"
            payload={rightLegendPayload}
            config={resolvedConfigForLegend}
            nameKey={nameKey}
            valueKey={isMultiMetric ? undefined : dataKey}
            valueFormatter={isMultiMetric ? undefined : legendValueFormatter}
            className="min-w-0 flex-1"
          />
        )}
      </div>
    );
  }
);
RadialBarChart.displayName = 'RadialBarChart';

export { RadialBarChart };
