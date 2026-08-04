'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Cell,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
} from 'recharts';
import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  resolveLabelFillClass,
  type ChartAnimationProps,
  type ChartConfig,
  type TickFormatter,
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

/** Where a stage's label sits relative to its segment. */
export type FunnelChartLabelPosition = 'right' | 'left' | 'inside';

/** What a stage's label says. */
export type FunnelChartLabelFormat =
  | 'name'
  | 'value'
  | 'percent'
  | 'name-value'
  | 'name-percent'
  | 'value-percent';

/** How the stages are coloured: one `config` entry each, or one shared ramp. */
export type FunnelChartColorMode = 'palette' | 'gradient';

/** Override for a single stage, keyed by its `nameKey` value. */
export interface FunnelChartStageSettings {
  /**
   * Paint this stage with a colour of its own, overriding both `config` and
   * `colorMode`. Reference an existing semantic `--ui-*` token.
   */
  color?: string;
  /**
   * Drop the stage from the funnel — and from the legend, labels and the
   * conversion percentages, which are computed over the visible stages only.
   */
  hidden?: boolean;
}

// recharts' `LabelList` positions that a funnel trapezoid understands. `inside`
// is recharts' `center`: a trapezoid has no `insideLeft`/`insideTop` anchor, so
// centring is the only on-segment placement. `outside` is not offered — for a
// funnel it would mean "beside the segment", which is what `right`/`left`
// already are, and recharts' polar `outside` doesn't apply to a trapezoid.
const LABEL_POSITION: Record<
  FunnelChartLabelPosition,
  'right' | 'left' | 'center'
> = {
  right: 'right',
  left: 'left',
  inside: 'center',
};

/**
 * Where the value labels sit when the caller doesn't say: opposite the names, so
 * the two lists never stack on the same edge. `inside` names sit on the segments
 * and leave both edges free, so the values take the default `right`.
 *
 * A static default can't do this — `valuePosition="left"` beside
 * `labelPosition="left"` draws both lists at the same anchor, overprinting the
 * name with its own value.
 */
export function funnelChartOppositeSide(
  labelPosition: FunnelChartLabelPosition
): FunnelChartLabelPosition {
  switch (labelPosition) {
    case 'right':
      return 'left';
    case 'left':
      return 'right';
    case 'inside':
      return 'right';
  }
}

// Synthetic row fields the two label lists read. A `LabelList` resolves its text
// from a `dataKey`, and its `formatter` only ever sees that one field's value —
// so a composite label ("Signups: 52.0%") has to be composed onto the row before
// recharts sees it, the same way `fill` already is.
const STAGE_LABEL_KEY = '__stageLabel';
const STAGE_VALUE_LABEL_KEY = '__stageValueLabel';

// How far the gradient ramp fades by the last stage: the final segment is mixed
// down to this share of the base colour, the first stays at full strength.
const GRADIENT_MIN_MIX = 45;

// Hover highlight for `showActiveShape` — an outline rather than a fill change,
// so the segment keeps the colour that ties it to its legend entry and label.
const ACTIVE_SHAPE = {
  stroke: 'var(--ui-border-on-surface-border-active)',
  strokeWidth: 2,
} as const;

// The inset reserved on whichever side a label list sits. It is *not* label
// room — see `funnelChartLabelReserve` for why — but a label whose text can't
// wrap (one long word) does overflow past the plot edge, and this is what keeps
// that overflow inside the SVG.
const LABEL_SIDE_INSET = 96;

// The plot-area margin a funnel has always been drawn with: the right side
// reserved, the left not.
const BASE_MARGIN = {
  top: 8,
  right: LABEL_SIDE_INSET,
  bottom: 8,
  left: 24,
};

/**
 * Share of the plot area handed to the funnel when a composite label sits to its
 * right. The rest becomes real label room — see `funnelChartLabelReserve`.
 *
 * A percentage, not a pixel count: the plot area is responsive, and recharts
 * resolves `Funnel`'s `width` against it, so a ratio keeps the reserve
 * proportional at every chart size.
 */
const COMPOSITE_FUNNEL_WIDTH = '75%';

/** A label format that pairs two fields, so its text is roughly twice as wide. */
function isCompositeFormat(format: FunnelChartLabelFormat): boolean {
  return format.includes('-');
}

/**
 * Reserve room for a composite label beside the funnel, by narrowing the
 * **funnel** rather than the plot area.
 *
 * recharts word-wraps a label against the space between its trapezoid's
 * mid-height edge and the *plot area* edge (`getCartesianPosition` clamps
 * `width` to `parentViewBox`, which `Funnel` sets to the plot box). A margin
 * shrinks the plot area and the funnel inside it in lockstep, so widening
 * `margin.right` moves the clamp edge *inward* and leaves a composite label
 * with less room, not more — the reserved strip sits outside `parentViewBox`
 * where the text can never reach it.
 *
 * `Funnel`'s `width` is the lever that works: it scales the funnel within the
 * plot area while `parentViewBox` stays put, and because recharts anchors the
 * funnel at the plot area's left edge (`offsetX = offset.left`), everything it
 * frees lands on the right. Narrowing the funnel to
 * `COMPOSITE_FUNNEL_WIDTH` turns ~35px of wrap width into ~140px on a 460px
 * chart.
 *
 * Returns `undefined` — i.e. leave the funnel at its full width — for every
 * other case, so a funnel with plain labels, no labels, or `inside` labels keeps
 * exactly the geometry it has always had.
 *
 * There is no equivalent lever for `labelPosition="left"`: the widest trapezoid
 * always starts flush at the plot area's left edge, so a left-hand label is
 * bounded by how sharply the funnel narrows and narrowing it further only makes
 * that worse. Composite left-hand labels wrap; that's a recharts limitation, not
 * a tuning choice.
 *
 * A caller-supplied `funnelWidth` always wins — this is only the default.
 */
export function funnelChartLabelReserve(options: {
  showLabels: boolean;
  labelPosition: FunnelChartLabelPosition;
  labelFormat: FunnelChartLabelFormat;
}): string | undefined {
  const { showLabels, labelPosition, labelFormat } = options;
  return showLabels &&
    labelPosition === 'right' &&
    isCompositeFormat(labelFormat)
    ? COMPOSITE_FUNNEL_WIDTH
    : undefined;
}

/**
 * The plot-area margin. Reserves the left inset when a label list sits there, so
 * a left-hand label isn't clipped at the SVG edge; the right inset is always
 * reserved, since that is the geometry every existing funnel was drawn with.
 *
 * This is overflow protection, not label room — the wrap width comes from
 * `funnelChartLabelReserve`. A caller-supplied `margin` is merged over these
 * defaults per side, so `margin={{ right: 160 }}` keeps the default top, bottom
 * and left rather than collapsing them to zero.
 */
export function funnelChartLabelMargin(options: {
  showLabels: boolean;
  labelPosition: FunnelChartLabelPosition;
  showValueLabels: boolean;
  valuePosition: FunnelChartLabelPosition;
}) {
  const { showLabels, labelPosition, showValueLabels, valuePosition } = options;
  const stageLabelAt = showLabels ? labelPosition : undefined;
  const valueLabelAt = showValueLabels ? valuePosition : undefined;

  return {
    ...BASE_MARGIN,
    left:
      stageLabelAt === 'left' || valueLabelAt === 'left'
        ? LABEL_SIDE_INSET
        : BASE_MARGIN.left,
  };
}

/**
 * Format a conversion share the way the default `percent` label reads it:
 * `0.52 → "52.0%"`. Exported so a `percentFormatter` can wrap or replace it.
 */
export const funnelChartPercent: TickFormatter = (value) => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : String(value);
};

/**
 * Compose one stage's label text.
 *
 * `base` is the value the percentage is measured against — the funnel's widest
 * stage, not the sum of every stage. A funnel's stages are nested subsets of
 * each other rather than parts of a whole, so their values don't add up to
 * anything meaningful; the share that reads as information is the conversion
 * from the top of the funnel. (A pie's `percent` is the other way round — there
 * a slice really is a share of the total.)
 *
 * Only the numeric part goes through `formatter`, so a label and its tooltip can
 * share one formatter; the share goes through `percentFormatter`, so a locale
 * that doesn't write a bare `%` can replace it. The percent formats degrade to
 * the name (or to the value) rather than printing `NaN%` when there is nothing
 * to divide by.
 */
export function funnelChartLabelText(options: {
  name: string;
  value: number | string;
  base: number;
  format: FunnelChartLabelFormat;
  formatter?: TickFormatter;
  percentFormatter?: TickFormatter;
}): string {
  const {
    name,
    value,
    base,
    format,
    formatter,
    percentFormatter = funnelChartPercent,
  } = options;
  const text = formatter ? formatter(value) : String(value);
  const numeric = typeof value === 'number' ? value : Number(value);
  const share =
    base > 0 && Number.isFinite(numeric)
      ? percentFormatter(numeric / base)
      : '';

  switch (format) {
    case 'name':
      return name;
    case 'value':
      return text;
    case 'percent':
      return share;
    case 'name-value':
      return `${name}: ${text}`;
    case 'name-percent':
      return share ? `${name}: ${share}` : name;
    case 'value-percent':
      return share ? `${text} (${share})` : text;
  }
}

/**
 * Mix one stage of the gradient ramp. Mixing toward the surface (rather than
 * lowering alpha) keeps every stage opaque, so an on-segment label keeps its
 * contrast and the ramp reads the same over any card background.
 */
function gradientStageFill(base: string, index: number, count: number): string {
  if (count <= 1) return base;
  const strength = 100 - ((100 - GRADIENT_MIN_MIX) * index) / (count - 1);
  return `color-mix(in oklab, ${base} ${strength.toFixed(1)}%, var(--ui-background-surface-primary))`;
}

export interface FunnelChartProps
  extends
    Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof funnelChartVariants>,
    ChartAnimationProps {
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
  /** Render a label for each stage — see `labelFormat` and `labelPosition`. */
  showLabels?: boolean;
  /**
   * What each stage's label says. `percent` is the stage's share of the widest
   * stage — its conversion from the top of the funnel.
   */
  labelFormat?: FunnelChartLabelFormat;
  /**
   * Where each stage's label sits. Defaults to `right`, beside the segment.
   * `inside` centres it on the segment, which only works while every stage is
   * wide enough to hold the text — a funnel narrows, so its last stages often
   * are not. Keep the text short there (`percent`) or leave the labels beside
   * the funnel.
   */
  labelPosition?: FunnelChartLabelPosition;
  /**
   * Render a second label carrying the stage's value, so the name and the number
   * can sit on opposite sides of the funnel.
   */
  showValueLabels?: boolean;
  /**
   * Where the value label sits. Defaults to the side opposite `labelPosition`,
   * where every stage has room — so it follows the names rather than pinning
   * itself to one edge. See `labelPosition` before choosing `inside`.
   */
  valuePosition?: FunnelChartLabelPosition;
  /**
   * Colour for both label lists, overriding the contrast-matched default (the
   * on-surface token beside the funnel, the on-fill token on a segment). Pass a
   * `--ui-*` token; only use it when the default doesn't work on your surface.
   */
  labelFill?: string;
  /** Format the numeric part of a label — pass the same formatter used elsewhere. */
  labelFormatter?: TickFormatter;
  /**
   * Format the conversion share behind the `percent` formats. Receives the share
   * as a fraction (`0.52`); defaults to `funnelChartPercent` (`"52.0%"`). Pass
   * `createTickFormatter({ style: 'percent', minimumFractionDigits: 1 }, locale)`
   * for a locale that doesn't write a bare `%`.
   */
  percentFormatter?: TickFormatter;
  /** Render the legend. Off by default: a funnel labels its stages on the chart. */
  showLegend?: boolean;
  /** Which edge the legend sits on. */
  legendPos?: 'top' | 'bottom';
  /**
   * How the stages are coloured. `palette` (the default) gives each stage its own
   * `config` colour; `gradient` ramps one hue — `gradientColor` — from the widest
   * stage down to the narrowest.
   */
  colorMode?: FunnelChartColorMode;
  /**
   * The hue `colorMode="gradient"` ramps. Defaults to the first visible stage's
   * own colour — including a `stageSettings` colour set on it — so a palette
   * config becomes a ramp without a second colour decision. Ignored when
   * `colorMode` is `palette`.
   */
  gradientColor?: string;
  /** Per-stage `color` / `hidden` overrides, keyed by the stage's `nameKey` value. */
  stageSettings?: Record<string, FunnelChartStageSettings>;
  /** Outline the hovered segment. */
  showActiveShape?: boolean;
  /**
   * Segment border colour. Reference an existing semantic `--ui-*` token.
   * Defaults to the border token when `strokeWidth` is set on its own.
   */
  stroke?: string;
  /** Segment border width, in px. Implies a default `stroke` when given alone. */
  strokeWidth?: number;
  /**
   * Funnel width — a number in px or a percentage of the plot area (`'70%'`).
   * Defaults to the full plot area, except that a composite `labelFormat` beside
   * the funnel narrows it to leave the label real room to wrap into.
   */
  funnelWidth?: number | string;
  /**
   * Plot-area margin, in px. Merged over the defaults per side, so passing one
   * side keeps the others.
   */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showTooltip?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting, per-series rows, or extra fields without composing
   * recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
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
      labelFormat = 'name',
      labelPosition = 'right',
      showValueLabels = false,
      valuePosition,
      labelFill,
      labelFormatter,
      percentFormatter,
      showLegend = false,
      legendPos = 'bottom',
      colorMode = 'palette',
      gradientColor,
      stageSettings,
      showActiveShape = false,
      stroke,
      strokeWidth,
      funnelWidth,
      margin,
      showTooltip = true,
      tooltipContent,
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
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

    // Stamp each row with its `fill` and its label texts (the shadcn data-driven
    // pattern). A Funnel's default fill is grey (#808080) and recharts doesn't
    // carry a per-segment color on the tooltip/legend payload item, so putting the
    // color on the data row is what lets a real hover resolve each segment's
    // color. (The forced-open `defaultIndex` VR snapshot can still show a neutral
    // indicator — it synthesizes the open state without a pointer hover.)
    const seriesData = React.useMemo(() => {
      const visible = data.filter(
        (row) => !stageSettings?.[String(row[nameKey])]?.hidden
      );
      // The ramp's default hue is the first visible stage's own colour — its
      // `stageSettings` override if it has one, otherwise `--color-*` rather than
      // `config[name].color` so a per-theme `theme` entry resolves too. Reading
      // the override matters because that stage paints with it, so ramping from
      // the config colour would start the ramp on a hue nothing on screen shows.
      const firstName = visible.length ? String(visible[0][nameKey]) : undefined;
      const base =
        gradientColor ??
        (firstName === undefined
          ? undefined
          : (stageSettings?.[firstName]?.color ?? `var(--color-${firstName})`));
      // The percentages are conversions from the funnel's widest stage, and
      // recharts sizes the trapezoids off `Math.max` of the values — so the base
      // is the largest visible value, not the first row. Taking the first row
      // would read as a conversion above 100% whenever the data isn't sorted
      // descending.
      const conversionBase = visible.reduce((widest, row) => {
        const value = Number(row[dataKey]);
        return Number.isFinite(value) && value > widest ? value : widest;
      }, 0);

      return visible.map((row, index) => {
        const name = String(row[nameKey]);
        const override = stageSettings?.[name]?.color;
        const fill =
          override ??
          (colorMode === 'gradient' && base
            ? gradientStageFill(base, index, visible.length)
            : `var(--color-${name})`);
        const labelArgs = {
          name,
          value: row[dataKey],
          base: conversionBase,
          formatter: labelFormatter,
          percentFormatter,
        };

        return {
          ...row,
          fill,
          [STAGE_LABEL_KEY]: funnelChartLabelText({
            ...labelArgs,
            format: labelFormat,
          }),
          [STAGE_VALUE_LABEL_KEY]: funnelChartLabelText({
            ...labelArgs,
            format: 'value',
          }),
        } as Record<string, string | number>;
      });
    }, [
      colorMode,
      data,
      dataKey,
      gradientColor,
      labelFormat,
      labelFormatter,
      nameKey,
      percentFormatter,
      stageSettings,
    ]);

    // recharts 3 builds the legend payload from the graphical item, and `Funnel`
    // — unlike Bar/Line/Area/Pie/Radar/RadialBar/Scatter — never registers one,
    // so a `<Legend>` inside a `FunnelChart` renders empty. The payload is
    // synthesized from the visible stages instead and handed to the shared
    // `ChartLegendContent`, which keeps the funnel on the same legend markers,
    // labels and `config` lookup as every other chart. `payload` carries the row
    // so each entry resolves its own `config` entry via `nameKey`.
    //
    // One entry per *distinct* stage name: same-named stages deliberately share a
    // `--color-<name>`/`config` entry, so a second entry would repeat the first
    // verbatim — and `ChartLegendContent` keys its entries on `value`, so it would
    // also be a duplicate React key.
    const legendPayload = React.useMemo<LegendPayload[]>(() => {
      const seen = new Set<string>();
      return seriesData.flatMap((row) => {
        const value = String(row[nameKey]);
        if (seen.has(value)) return [];
        seen.add(value);
        return [
          {
            value,
            dataKey: nameKey,
            type: 'rect' as const,
            color: String(row.fill),
            payload: row,
          },
        ];
      });
    }, [nameKey, seriesData]);

    const resolvedValuePosition =
      valuePosition ?? funnelChartOppositeSide(labelPosition);
    const stagePosition = LABEL_POSITION[labelPosition];
    const valueLabelPosition = LABEL_POSITION[resolvedValuePosition];
    const plotMargin = {
      ...funnelChartLabelMargin({
        showLabels,
        labelPosition,
        showValueLabels,
        valuePosition: resolvedValuePosition,
      }),
      ...margin,
    };
    // A caller-supplied `funnelWidth` wins; otherwise a composite label beside the
    // funnel narrows it to leave itself room to wrap into.
    const resolvedFunnelWidth =
      funnelWidth ??
      funnelChartLabelReserve({ showLabels, labelPosition, labelFormat });
    // recharts defaults a Funnel's stroke to a hardcoded `#fff` that
    // `ChartContainer` neutralizes, so a bare `strokeWidth` would widen an
    // invisible border. Pair it with the border token instead.
    const resolvedStroke =
      stroke ??
      (strokeWidth != null ? 'var(--ui-border-on-surface-border)' : undefined);

    return (
      <div
        ref={ref}
        data-last-shape={lastShape}
        className={cn(funnelChartVariants({ lastShape }), className)}
        {...props}
      >
        <ChartContainer config={config} className="size-full">
          <RechartsFunnelChart margin={plotMargin}>
            {showTooltip && (
              <ChartTooltip
                content={
                  tooltipContent ?? (
                    <ChartTooltipContent nameKey={nameKey} hideLabel />
                  )
                }
              />
            )}
            {showLegend && (
              <ChartLegend
                verticalAlign={legendPos}
                content={() => (
                  <ChartLegendContent
                    payload={legendPayload}
                    verticalAlign={legendPos}
                    nameKey={nameKey}
                  />
                )}
              />
            )}
            <Funnel
              dataKey={dataKey}
              nameKey={nameKey}
              data={seriesData}
              lastShapeType={lastShape ?? 'triangle'}
              reversed={reversed}
              width={resolvedFunnelWidth}
              stroke={resolvedStroke}
              strokeWidth={strokeWidth}
              activeShape={showActiveShape ? ACTIVE_SHAPE : undefined}
              {...animation}
            >
              {seriesData.map((entry, index) => (
                // Keyed by index, not the name: two stages could share a nameKey
                // value, which would collide as a React key. Same-named stages
                // intentionally share a color/config entry via `--color-<name>`.
                <Cell key={index} fill={String(entry.fill)} />
              ))}
              {showLabels && (
                <LabelList
                  position={stagePosition}
                  dataKey={STAGE_LABEL_KEY}
                  className={
                    labelFill ? undefined : resolveLabelFillClass(stagePosition)
                  }
                  fill={labelFill}
                  stroke="none"
                />
              )}
              {showValueLabels && (
                <LabelList
                  position={valueLabelPosition}
                  dataKey={STAGE_VALUE_LABEL_KEY}
                  className={
                    labelFill
                      ? undefined
                      : resolveLabelFillClass(valueLabelPosition)
                  }
                  fill={labelFill}
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
