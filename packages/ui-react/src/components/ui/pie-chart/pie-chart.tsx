'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Cell,
  Curve,
  Label,
  LabelList,
  Pie,
  PieChart as RechartsPieChart,
  type CurveProps,
  type PieLabelRenderProps,
} from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  resolveLabelFillClass,
  CHART_LABEL_FILL_CLASS,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartTooltipContentProps,
  type ChartAnimationProps,
  type ChartDataLabelProps,
  type PolarLabelPosition,
  type TickFormatter,
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

/** Row-per-slice datum: the `nameKey` label plus the `dataKey` value. */
type PieChartDatum = Record<string, string | number>;

/**
 * What a slice's data label reads. `percent` is the slice's share of the sum of
 * every slice value, to one decimal.
 */
export type PieChartLabelFormat =
  | 'value'
  | 'name-value'
  | 'name-percent'
  | 'percent';

/** What the tooltip's value reads — the raw value, or the value and its share. */
export type PieChartTooltipFormat = 'value' | 'value-percent';

/** Per-slice overrides, keyed by the slice's `nameKey` value. */
export interface PieChartSliceSettings {
  /**
   * Fill for this slice, overriding its `config` color. Reference an existing
   * semantic `--ui-*` token, same as `config`.
   */
  color?: string;
  /** Drop this slice's data label while every other slice keeps its own. */
  hideLabel?: boolean;
  /** Label format for this slice only — overrides the chart-level `labelFormat`. */
  labelFormat?: PieChartLabelFormat;
}

const toNumericValue = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

/**
 * A slice's share of the chart's total, to one decimal. The single place the
 * share is computed, so a slice's label and its tooltip row can't disagree.
 * `undefined` when there is nothing to divide — a non-numeric slice value, or a
 * total of zero — which is what lets the callers degrade instead of printing
 * `NaN%`.
 */
const slicePercentText = (
  value: unknown,
  total: number
): string | undefined => {
  const numeric = toNumericValue(value);
  if (numeric === undefined || total <= 0) return undefined;
  return `${((numeric / total) * 100).toFixed(1)}%`;
};

/**
 * Compose one slice's data-label text. Exported for unit tests; not part of the
 * package's public API.
 *
 * A percent needs a numeric slice value *and* a non-zero total, and a value
 * label needs a value at all — so every format degrades rather than printing
 * `NaN%` or a dangling `"Chrome: "`. The two name-carrying formats fall back to
 * the bare name; the value-only ones to `''`, which `resolveSliceLabel`
 * normalizes to `null` (the one value recharts renders no `<text>` for).
 *
 * `labelFormatter` formats the slice's *value*, so it reaches `value` and
 * `name-value` only. A percent is always composed by `slicePercentText` and
 * never passes through the formatter.
 */
export function pieChartLabelText(options: {
  format: PieChartLabelFormat;
  name: string | number;
  value: string | number | undefined;
  total: number;
  formatter?: TickFormatter;
}): string {
  const { format, name, value, total, formatter } = options;
  const valueText =
    value == null ? '' : formatter ? formatter(value) : String(value);
  const percentText = slicePercentText(value, total);

  switch (format) {
    case 'name-value':
      return valueText ? `${name}: ${valueText}` : `${name}`;
    case 'name-percent':
      return percentText ? `${name}: ${percentText}` : `${name}`;
    case 'percent':
      return percentText ?? '';
    default:
      return valueText;
  }
}

/**
 * The row renderer behind `tooltipFormat="value-percent"` — a slice's value
 * followed by its share. Exported for unit tests; not part of the package's
 * public API.
 *
 * A `formatter` replaces the default row wholesale, so the swatch and the name
 * are rebuilt here to match it: the shared `ChartTooltipContent` prefers a
 * `config` entry's `icon` over the color swatch, and this has to do the same or
 * a chart with icons would silently lose them under this preset — and the
 * name/value `gap-4`, which has to be repeated here because a `formatter`
 * replaces the shared row that carries it.
 */
export function pieChartValuePercentRow(options: {
  config: ChartConfig;
  total: number;
}): NonNullable<ChartTooltipContentProps['formatter']> {
  const { config, total } = options;
  // Named rather than an arrow: it returns JSX, so an anonymous function reads
  // to eslint-plugin-react as a component with no display name.
  return function ValuePercentRow(value, name, item) {
    const itemConfig = config[String(name)];
    const percent = slicePercentText(value, total);
    const valueText = value?.toLocaleString() ?? '';
    return (
      <>
        {itemConfig?.icon ? (
          <itemConfig.icon />
        ) : (
          <div
            // Dotted, not the legend's square swatch: the shared row's
            // "a row is always dotted, whatever marker the legend gives that
            // series" invariant applies here too.
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.payload?.fill ?? item.color }}
          />
        )}
        {/*
         * Mirrors the shared default row's `gap-4` (see `ChartTooltipContent`):
         * a `formatter` replaces that row wholesale, so the floor under the
         * name/value separation has to be restated here. Without it a value
         * *and* its share outgrows the tooltip's `min-w-[8rem]`, leaving
         * `justify-between` no free space to distribute.
         */}
        <div className="flex flex-1 items-center justify-between gap-4 leading-none">
          <span className="text-muted-foreground">
            {itemConfig?.label ?? name}
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {percent ? `${valueText} (${percent})` : valueText}
          </span>
        </div>
      </>
    );
  };
}

/**
 * The configured `ChartTooltipContent` for `tooltipFormat="value-percent"`.
 * Exported so the visual-regression story renders the very same element the
 * component does — recharts can only open a hover tooltip statically via
 * `defaultIndex` on a raw composition, so the preset has to be reachable from
 * outside the component to be snapshotted at all.
 */
export function pieChartValuePercentTooltip(options: {
  nameKey: string;
  config: ChartConfig;
  total: number;
}): React.ReactElement {
  const { nameKey, config, total } = options;
  return (
    <ChartTooltipContent
      nameKey={nameKey}
      hideLabel
      formatter={pieChartValuePercentRow({ config, total })}
    />
  );
}

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
    VariantProps<typeof pieChartVariants>,
    ChartAnimationProps,
    ChartDataLabelProps {
  /** Row-per-slice data. Each object holds the slice's `nameKey` label + its `dataKey` numeric value. */
  data: ReadonlyArray<PieChartDatum>;
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
  /** Corner radius of each slice. */
  cornerRadius?: number;
  /**
   * Angle the sweep starts at, in degrees (0 is 3 o'clock, counter-clockwise).
   * Pair with `endAngle` for a semicircle (`180` → `0`) or an arc.
   *
   * A partial sweep still centres on the full plot area, so a half turn fills
   * only half its box — give the chart a short, wide one rather than expecting
   * the arc to grow into a square.
   */
  startAngle?: number;
  /** Angle the sweep ends at, in degrees. Defaults to a full `360` circle. */
  endAngle?: number;
  /**
   * Smallest angle a non-zero slice may occupy, in degrees — keeps a tiny slice
   * visible (and hoverable) at the cost of being drawn out of proportion.
   */
  minAngle?: number;
  /**
   * Per-slice overrides keyed by the slice's `nameKey` value: its `color`, and
   * whether/how its data label reads. A name with no entry keeps the chart-level
   * behavior.
   */
  sliceSettings?: Record<string, PieChartSliceSettings>;
  showTooltip?: boolean;
  showLegend?: boolean;
  /** Which edge the legend sits on. Defaults to `bottom`. */
  legendPosition?: 'top' | 'bottom';
  /** Plot-area margin, in px. Omit to use recharts' default (5 on every side). */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting, per-slice rows, or extra fields without composing
   * recharts yourself. Takes precedence over `tooltipFormat`. Ignored when
   * `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
  /**
   * How the default tooltip reads a slice: its `value` alone (the default), or
   * the value followed by its share of the total (`value-percent`). The preset
   * covers the common case without hand-rolling a `tooltipContent`.
   *
   * The share is rendered as `NN.N%`, same as a data label's — not locale-aware.
   * Pass your own `tooltipContent` if you need to format it.
   */
  tooltipFormat?: PieChartTooltipFormat;
  /**
   * Position of the value labels when `showLabels` is on. Defaults to `outside`,
   * which keeps them on the chart surface — the only placement that reliably
   * has contrast, since slice fills are caller-supplied saturated colors. The
   * on-arc placements are available but switch to the on-fill label token.
   * Ignored when `labelLine` is on — a leader line only ever ends outside the arc.
   */
  labelPosition?: PolarLabelPosition;
  /**
   * What each data label reads when `showLabels` is on — the value alone (the
   * default), or the slice name and/or its share of the total. Overridable per
   * slice via `sliceSettings`.
   *
   * `labelFormatter` formats the slice's *value*, so it reaches `value` and
   * `name-value` only: a share is always rendered as `NN.N%` (a `.` decimal and
   * a bare `%`, not locale-aware) and never passes through the formatter.
   */
  labelFormat?: PieChartLabelFormat;
  /**
   * Draw a leader line from each slice to its data label, in the slice's own
   * color. Moves the labels outside the arc (see `labelPosition`); slices whose
   * label is hidden by `sliceSettings` get no line either.
   *
   * A label reaching out past the arc needs horizontal room — give the chart a
   * box wider than it is tall, or shrink the arc (`outerRadius`/`margin`), or
   * the outermost labels are clipped at the surface edge.
   */
  labelLine?: boolean;
}

// Reserved height (px) of the shared single-row `ChartLegendContent` on
// whichever edge `legendPosition` puts it — the same on both, since the legend's
// own padding is symmetric (`pt-3` / `pb-3`). recharts shifts the donut centre
// away from that edge by half of this to make room, but a Pie <Label>'s viewBox
// does not reflect it — so the centre label is nudged by the same amount, in the
// same direction. VR baselines guard this value if the legend's height changes.
const LEGEND_ROW_RESERVE = 28;

/**
 * Content for the donut hole's centre readout, bound to the legend layout it has
 * to compensate for.
 *
 * recharts centres the pie in the plot area (surface minus the legend), but a
 * Pie `<Label>`'s viewBox reports the full surface centre — so a bottom legend
 * leaves `cy` half a legend row too low, and a top legend half a row too high.
 * The nudge puts the text back on the real donut centre, in whichever direction
 * the legend row was reserved.
 */
function renderCenterLabel({
  centerLabel,
  showLegend,
  legendPosition,
}: {
  centerLabel: PieChartCenterLabel;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom';
}) {
  return function PieChartCenterLabel({ viewBox }: { viewBox?: object }) {
    if (!viewBox || !('cx' in viewBox)) return null;
    const { cx = 0, cy = 0 } = viewBox as { cx?: number; cy?: number };

    const legendNudge = showLegend ? LEGEND_ROW_RESERVE / 2 : 0;
    const centerY = cy + (legendPosition === 'top' ? legendNudge : -legendNudge);
    const hasValue = centerLabel.value != null;
    const hasLabel = centerLabel.label != null;
    // Straddle centerY when both lines show, so the value + label block is
    // centered as a whole (not just the value).
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
  };
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
      centerLabel,
      innerRadius = 60,
      outerRadius,
      paddingAngle = 0,
      cornerRadius,
      startAngle,
      endAngle,
      minAngle,
      sliceSettings,
      showTooltip = true,
      showLegend = true,
      legendPosition = 'bottom',
      margin,
      tooltipContent,
      tooltipFormat = 'value',
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
      showLabels = false,
      labelPosition,
      labelFormat = 'value',
      labelFormatter,
      labelLine = false,
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
    const pieLabelPosition = labelPosition ?? 'outside';
    const resolvedInnerRadius = shape === 'donut' ? innerRadius : 0;

    // The denominator behind every percent — the labels' and the tooltip's — so
    // the two always agree. Non-numeric cells count as nothing rather than NaN.
    const total = data.reduce(
      (sum, row) => sum + (toNumericValue(row[dataKey]) ?? 0),
      0
    );

    // Always null, never '', for a slice with nothing to show — whether its
    // label was switched off or its format degraded to empty. recharts renders
    // no <text> at all for a nullish label value (`Label` bails on `isNullish`),
    // where an empty string still emits one wrapping an empty <tspan>.
    const resolveSliceLabel = (row: PieChartDatum | undefined): string | null => {
      if (!row) return null;
      const settings = sliceSettings?.[String(row[nameKey])];
      if (settings?.hideLabel) return null;
      return (
        pieChartLabelText({
          format: settings?.labelFormat ?? labelFormat,
          name: row[nameKey],
          value: row[dataKey],
          total,
          formatter: labelFormatter,
        }) || null
      );
    };

    // Leader lines are the one thing a `LabelList` can't draw: recharts only
    // renders them alongside the `label` prop's own outside placement. So the
    // labels move to that path when `labelLine` is on, and stay on the
    // position-aware `LabelList` otherwise.
    const showLeaderLines = showLabels && labelLine;

    const renderLeaderLabel = (labelProps: PieLabelRenderProps) => {
      const text = resolveSliceLabel(labelProps.payload as PieChartDatum);
      // An empty <g>, not null: recharts only takes the render function's output
      // when it's an element — a nullish return falls through to its own <Text>
      // painting the raw value.
      if (!text) return <g />;
      return (
        <text
          x={labelProps.x}
          y={labelProps.y}
          textAnchor={labelProps.textAnchor}
          dominantBaseline="central"
          // Always the on-surface fill: this path only ever places labels
          // outside the arc, never over a slice.
          className={CHART_LABEL_FILL_CLASS}
          fontSize={CHART_LABEL_FONT_SIZE}
        >
          {text}
        </text>
      );
    };

    // recharts draws a line per sector independently of what the label renders,
    // so a slice hidden via `sliceSettings` would keep a line pointing at
    // nothing. Rebuilding the default `Curve` here is what lets it be dropped.
    const renderLeaderLine = ({
      key,
      payload,
      ...lineProps
    }: CurveProps & { key?: React.Key; payload?: PieChartDatum }) => {
      if (!resolveSliceLabel(payload)) return <g />;
      return (
        <Curve {...lineProps} type="linear" className="recharts-pie-label-line" />
      );
    };

    return (
      <div
        ref={ref}
        data-shape={shape}
        className={cn(pieChartVariants({ shape }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RechartsPieChart margin={margin}>
            {showTooltip && (
              <ChartTooltip
                content={
                  tooltipContent ??
                  (tooltipFormat === 'value-percent' ? (
                    pieChartValuePercentTooltip({ nameKey, config, total })
                  ) : (
                    <ChartTooltipContent nameKey={nameKey} hideLabel />
                  ))
                }
              />
            )}
            <Pie
              data={data as unknown[]}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={resolvedInnerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              cornerRadius={cornerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
              minAngle={minAngle}
              label={showLeaderLines ? renderLeaderLabel : false}
              labelLine={showLeaderLines ? renderLeaderLine : false}
              {...animation}
            >
              {data.map((entry, index) => (
                // Keyed by index, not the name: two rows may share a nameKey
                // value, which would collide as a React key. Same-named rows
                // intentionally share a color/config entry via `--color-<name>`.
                <Cell
                  key={index}
                  fill={
                    sliceSettings?.[String(entry[nameKey])]?.color ??
                    `var(--color-${entry[nameKey]})`
                  }
                />
              ))}
              {shape === 'donut' && centerLabel && (
                <Label
                  content={renderCenterLabel({
                    centerLabel,
                    showLegend,
                    legendPosition,
                  })}
                />
              )}
              {showLabels && !showLeaderLines && (
                <LabelList
                  // `valueAccessor` rather than `dataKey`: the label text can
                  // carry the slice's name and share, which only the whole row
                  // (and the chart's total) can compose. recharts ignores the
                  // accessor when a dataKey is set, so the two can't be combined.
                  valueAccessor={(entry) =>
                    resolveSliceLabel(entry.payload as PieChartDatum)
                  }
                  // Always explicit: recharts' polar fallback for an unset
                  // position is the sector centroid — inside the fill — which
                  // is exactly the placement the on-surface token can't survive.
                  position={pieLabelPosition}
                  className={resolveLabelFillClass(pieLabelPosition)}
                  fontSize={CHART_LABEL_FONT_SIZE}
                />
              )}
            </Pie>
            {showLegend && (
              <ChartLegend
                verticalAlign={legendPosition}
                content={
                  <ChartLegendContent
                    nameKey={nameKey}
                    verticalAlign={legendPosition}
                  />
                }
              />
            )}
          </RechartsPieChart>
        </ChartContainer>
      </div>
    );
  }
);
PieChart.displayName = 'PieChart';

export { PieChart, pieChartVariants };
