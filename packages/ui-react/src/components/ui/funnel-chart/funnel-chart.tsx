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
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  resolveChartColors,
  resolveLabelFillClass,
  type ChartAnimationProps,
  type ChartConfig,
  type ChartPalette,
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

/** Override for a single stage, keyed by its `nameKey` value. */
export interface FunnelChartStageSettings {
  /**
   * Paint this stage with a colour of its own instead of its `palette` stop —
   * the same per-item escape hatch `PieChart`'s `sliceSettings` offers.
   * Reference an existing semantic `--ui-*` token.
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

// Which stage this row is. recharts hands a custom `shape` the data row as
// `payload` but no index, and the first stage is the one that must *not* be
// pushed down — its top edge is the top of the funnel.
const STAGE_INDEX_KEY = '__stageIndex';

// Hover highlight for `showActiveShape` — an outline rather than a fill change,
// so the segment keeps the colour that ties it to its legend entry and label.
const ACTIVE_STROKE = 'var(--ui-border-on-surface-border-active)';
const ACTIVE_STROKE_WIDTH = 2;

/**
 * The design's funnel plot: a 120×120 square beside its legend — the same
 * geometry `ChartDonut` uses in Figma, which is why `PieChart` and
 * `RadialBarChart` size their plot exactly this way too.
 *
 * The *component* is still parent-responsive: the root is a flex row whose
 * legend column takes every pixel the plot doesn't, so a funnel widens with its
 * widget instead of the plot growing into a tall, narrow wedge.
 *
 * Figma: `8811:175245` → `Chart` is `size-[120px]`, `gap-[16px]`, legend
 * `flex-[1_0_0]`.
 */
const PLOT_SIZE_CLASS = 'size-[120px]';

/**
 * Surface showing between two stages, in px. recharts draws the stages flush —
 * `Funnel` has no gap prop and `Trapezoid` no radius — so both come from the
 * custom `shape` below.
 *
 * Figma `8811:175245` stacks the stages at y = 4 / 34 / 64 / 94 with shapes 28
 * tall: a 2px gap, three times over for four stages.
 */
const STAGE_GAP = 2;

/** Corner rounding on the two upper edges of each stage (Figma: ~2px clip along the top edge). */
const STAGE_RADIUS = 2;

/**
 * Corner rounding on the two lower edges of each stage.
 *
 * Figma's bottom corners clip ~0.85px — significantly less than the upper
 * corners. The asymmetry is intentional: the diagonal-meets-flat-bottom
 * transition is shallow, so a smaller radius keeps it from looking over-rounded
 * at the narrow tail of the funnel. 1px is the nearest integer match.
 */
const STAGE_BOTTOM_RADIUS = 1;

/**
 * The plot-area inset when nothing sits beside the funnel. Figma's widest stage
 * spans 102.67 of the 120px box and the stack runs y=4 → ~115.7, i.e. ~8px of
 * horizontal and 4px of vertical breathing room.
 */
const PLOT_MARGIN = { top: 4, right: 8, bottom: 4, left: 8 };

/**
 * The palette Figma paints the funnel from: the sequential blue ramp, whose
 * stops read as one quantity falling down the funnel. Every other chart keeps
 * the shared categorical default — a funnel's stages are an *ordered* series,
 * which is what a sequential ramp is for.
 *
 * Figma `8811:175245` uses `dataviz/sequential/blue/{2,4,6,8}`.
 */
export const FUNNEL_CHART_DEFAULT_PALETTE: ChartPalette = Object.freeze({
  type: 'sequential',
  ramp: 'blue',
});

type StagePoint = readonly [number, number];

const distance = (a: StagePoint, b: StagePoint) =>
  Math.hypot(b[0] - a[0], b[1] - a[1]);

/** A point `d` px from `from` along the segment toward `to`. */
function along(from: StagePoint, to: StagePoint, d: number): StagePoint {
  const length = distance(from, to);
  if (length === 0) return from;
  return [
    from[0] + ((to[0] - from[0]) * d) / length,
    from[1] + ((to[1] - from[1]) * d) / length,
  ];
}

// Trimmed to 3dp so the emitted `d` is stable across platforms — a raw float
// makes every visual-regression baseline and DOM assertion renderer-dependent.
const coord = ([x, y]: StagePoint) =>
  `${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;

/**
 * A closed polygon with rounded corners, as an SVG path.
 *
 * Each corner is trimmed back along both of its edges and bridged with a
 * quadratic curve through the original vertex. The radius is clamped to half of
 * either adjacent edge, so two corners can never overrun each other on a short
 * edge — which is the normal case at the bottom of a funnel, where the last
 * stages are only a few px wide.
 */
function roundedPolygonPath(
  points: readonly StagePoint[],
  radius: number | readonly number[]
): string {
  const count = points.length;
  if (count < 3) return '';

  let path = '';
  for (let i = 0; i < count; i++) {
    const r = typeof radius === 'number' ? radius : radius[i];
    const previous = points[(i - 1 + count) % count];
    const current = points[i];
    const next = points[(i + 1) % count];
    const corner = Math.max(
      0,
      Math.min(
        r,
        distance(previous, current) / 2,
        distance(current, next) / 2
      )
    );
    const entry = along(current, previous, corner);
    const exit = along(current, next, corner);
    path += `${i === 0 ? 'M' : ' L'} ${coord(entry)}`;
    path += ` Q ${coord(current)} ${coord(exit)}`;
  }
  return `${path} Z`;
}

/**
 * The `d` for one funnel stage — recharts' trapezoid geometry with the design's
 * rounded corners.
 *
 * `x`/`y` is the top-left of the *upper* edge and the shape is centred on
 * `x + upperWidth / 2`, matching recharts' own `getTrapezoidPath`.
 *
 * Either edge can collapse to a single rounded apex rather than a zero-length
 * one — the `triangle` last shape narrows to a point at the bottom, and a
 * `reversed` funnel stands that same triangle on its head at the top.
 */
export function funnelChartStagePath(options: {
  x: number;
  y: number;
  upperWidth: number;
  lowerWidth: number;
  height: number;
  /**
   * Uniform corner radius — applies to all four corners. Overridden per-side
   * by `topRadius` / `bottomRadius`. When absent, defaults to
   * `STAGE_RADIUS` (top) and `STAGE_BOTTOM_RADIUS` (bottom).
   */
  radius?: number;
  /** Radius for the two upper corners (default: `STAGE_RADIUS = 2`). */
  topRadius?: number;
  /**
   * Radius for the two lower corners (default: `STAGE_BOTTOM_RADIUS = 1`).
   *
   * Figma's bottom corners clip ~0.85px — much smaller than the upper ones —
   * so the default is intentionally lower than `topRadius`.
   */
  bottomRadius?: number;
}): string {
  const { x, y, upperWidth, lowerWidth, height } = options;
  // `radius` is a backward-compat shorthand for all corners.
  // Per-side props win; if only `radius` is given it applies to both sides.
  // If nothing is given, use the asymmetric Figma defaults.
  const uniformRadius = options.radius;
  const topRadius = options.topRadius ?? uniformRadius ?? STAGE_RADIUS;
  const bottomRadius =
    options.bottomRadius ?? uniformRadius ?? STAGE_BOTTOM_RADIUS;

  if (height <= 0 || (upperWidth <= 0 && lowerWidth <= 0)) return '';

  const centre = x + upperWidth / 2;
  const upper: StagePoint[] =
    upperWidth <= 0
      ? [[centre, y]]
      : [
          [x, y],
          [x + upperWidth, y],
        ];
  const lower: StagePoint[] =
    lowerWidth <= 0
      ? [[centre, y + height]]
      : [
          [centre + lowerWidth / 2, y + height],
          [centre - lowerWidth / 2, y + height],
        ];

  // Upper points get topRadius, lower points get bottomRadius — matching
  // Figma's intentional asymmetry (the diagonal-meets-bottom transition
  // uses a much smaller clip than the diagonal-meets-top one).
  const radii: number[] = [
    ...upper.map(() => topRadius),
    ...lower.map(() => bottomRadius),
  ];
  return roundedPolygonPath([...upper, ...lower], radii);
}

/**
 * Pull a stage's **top** edge down by `gap`, so surface shows between it and the
 * stage above.
 *
 * The top rather than the bottom on purpose: the bottom edge is what
 * `lastShapeType` defines — the triangle's apex — so leaving it exactly where
 * recharts put it keeps a `triangle` funnel ending in a real point instead of a
 * blunt 2px edge. The upper edge slides down the funnel's own slope, so the
 * taper is unchanged rather than steepened.
 *
 * A stage with no room for the gap is returned untouched: better a missing gap
 * than an inverted shape.
 */
export function funnelChartStageInset(options: {
  x: number;
  y: number;
  upperWidth: number;
  lowerWidth: number;
  height: number;
  gap: number;
}) {
  const { x, y, upperWidth, lowerWidth, height, gap } = options;
  if (gap <= 0 || height <= gap) {
    return { x, y, upperWidth, lowerWidth, height };
  }

  const insetUpperWidth =
    upperWidth + ((lowerWidth - upperWidth) * gap) / height;
  return {
    x: x + upperWidth / 2 - insetUpperWidth / 2,
    y: y + gap,
    upperWidth: insetUpperWidth,
    lowerWidth,
    height: height - gap,
  };
}

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
 * The plot-area margin.
 *
 * With nothing beside the funnel — the default, and what Figma draws — the plot
 * is the design's own inset (`PLOT_MARGIN`): just the few px the rounded corners
 * and the apex need, so the funnel fills its 120px square instead of being
 * squeezed into the middle by label room it isn't using.
 *
 * As soon as a label list *does* sit beside the funnel, the side insets come
 * back: this is overflow protection, not label room — the wrap width comes from
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
  const besideOnLeft = stageLabelAt === 'left' || valueLabelAt === 'left';
  const besideOnRight = stageLabelAt === 'right' || valueLabelAt === 'right';

  // `inside` labels sit on the segments, so they count as "nothing beside the
  // funnel" and keep the tight design margin too.
  if (!besideOnLeft && !besideOnRight) {
    return { ...PLOT_MARGIN };
  }

  return {
    ...BASE_MARGIN,
    left: besideOnLeft ? LABEL_SIDE_INSET : BASE_MARGIN.left,
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

// What recharts hands a custom `Funnel` `shape`: the trapezoid box it measured,
// the presentation props it resolved (`fill` from the `Cell`, `stroke`), the
// data row, and whether this stage is the hovered one.
type FunnelStageShapeProps = {
  x?: number;
  y?: number;
  upperWidth?: number;
  lowerWidth?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  className?: string;
  isActive?: boolean;
  payload?: Record<string, unknown>;
  showActiveShape?: boolean;
  /**
   * Which stage sits at the top of the plot area, and so takes no gap above it.
   * Not always the first row: `reversed` flips the stack, which puts the *last*
   * stage at the top.
   */
  topStageIndex?: number;
};

/**
 * One funnel stage. Replaces recharts' `Trapezoid` because the design's stage
 * has two things it can't express: a 2px gap to the stage above and 2px rounded
 * corners.
 *
 * Safe to substitute — recharts puts the tooltip/click handlers on the `<g
 * className="recharts-funnel-trapezoid">` that wraps this, not on the shape, so
 * hover and the tooltip keep working without any event plumbing here.
 */
function FunnelStageShape({
  x = 0,
  y = 0,
  upperWidth = 0,
  lowerWidth = 0,
  height = 0,
  fill,
  stroke,
  strokeWidth,
  className,
  isActive,
  payload,
  showActiveShape,
  topStageIndex = 0,
}: FunnelStageShapeProps) {
  const isTopStage = payload?.[STAGE_INDEX_KEY] === topStageIndex;
  const inset = funnelChartStageInset({
    x,
    y,
    upperWidth,
    lowerWidth,
    height,
    // The funnel's own top edge is not a seam, so only the stages below the
    // topmost one are pushed down: n stages give exactly n-1 gaps.
    gap: isTopStage ? 0 : STAGE_GAP,
  });
  const d = funnelChartStagePath(inset);
  if (!d) return null;

  const outlined = Boolean(isActive && showActiveShape);
  return (
    <path
      className={cn('recharts-funnel-stage', className)}
      d={d}
      fill={fill}
      stroke={outlined ? ACTIVE_STROKE : stroke}
      strokeWidth={outlined ? ACTIVE_STROKE_WIDTH : strokeWidth}
    />
  );
}

export interface FunnelChartProps
  extends
    Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof funnelChartVariants>,
    ChartAnimationProps {
  /**
   * The dataviz palette the stages are painted from — the only source of a
   * stage's colour, bar a per-stage `stageSettings.color`. Defaults to
   * `FUNNEL_CHART_DEFAULT_PALETTE` (the sequential blue ramp), which is what
   * Figma paints the funnel with; a funnel's stages are an ordered series, so a
   * ramp reads them better than the shared categorical default.
   * See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** Row-per-stage data. Each object holds the stage's `nameKey` label + its `dataKey` numeric value. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-stage map of `label` / `icon` / `tone`, keyed by the stage's `nameKey`
   * value (imported from the shared `Chart` primitives). Turned into
   * `--color-<name>` custom properties. Series take their colour from the
   * container's `palette`; each entry maps a key to a `label` and an optional
   * `tone`.
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
  /**
   * Render the stage list beside the funnel. On by default: the design's funnel
   * carries no on-plot labels, so the legend is where the stages are named.
   */
  showLegend?: boolean;
  /** Format the value in each legend row — the stage's `dataKey` number. */
  legendValueFormatter?: (value: string | number) => string;
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
      palette,
      data,
      dataKey,
      nameKey,
      lastShape = 'triangle',
      reversed = false,
      showLabels = false,
      labelFormat = 'name',
      labelPosition = 'right',
      showValueLabels = false,
      valuePosition,
      labelFill,
      labelFormatter,
      percentFormatter,
      showLegend = true,
      legendValueFormatter,
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
        const fill =
          stageSettings?.[name]?.color ?? `var(--color-${name})`;
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
          [STAGE_INDEX_KEY]: index,
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
      data,
      dataKey,
      labelFormat,
      labelFormatter,
      nameKey,
      percentFormatter,
      stageSettings,
    ]);

    // The legend sits *outside* `ChartContainer`, beside the plot — so it can't
    // read the `--color-<name>` custom properties `ChartStyle` scopes to
    // `[data-chart=…]`. Resolving the palette here is what gives its markers the
    // same colours the stages paint with, the way `PieChart` and
    // `RadialBarChart` already do for their side legends.
    const resolvedConfigForLegend = React.useMemo(
      () =>
        showLegend
          ? resolveChartColors(config, palette ?? FUNNEL_CHART_DEFAULT_PALETTE)
          : null,
      [showLegend, config, palette]
    );

    // recharts 3 builds the legend payload from the graphical item, and `Funnel`
    // — unlike Bar/Line/Area/Pie/Radar/RadialBar/Scatter — never registers one,
    // so a `<Legend>` inside a `FunnelChart` renders empty. The payload is
    // synthesized from the visible stages instead and handed to the shared
    // `ChartLegendContent`, which keeps the funnel on the same legend markers,
    // labels and `config` lookup as every other chart. `payload` carries the row
    // so each entry resolves its own `config` entry via `nameKey`.
    //
    // One entry per *distinct* stage name: same-named stages deliberately share a
    // `config` entry, so a second entry would repeat the first verbatim — and
    // `ChartLegendContent` keys its entries on `value`, so it would also be a
    // duplicate React key.
    const legendPayload = React.useMemo<LegendPayload[]>(() => {
      if (!resolvedConfigForLegend) return [];
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
            // A `stageSettings` colour is a real colour and paints as-is; every
            // other stage takes its resolved palette stop.
            color:
              stageSettings?.[value]?.color ??
              resolvedConfigForLegend[value]?.color ??
              String(row.fill),
            payload: row,
          },
        ];
      });
    }, [nameKey, seriesData, resolvedConfigForLegend, stageSettings]);

    const resolvedValuePosition =
      valuePosition ?? funnelChartOppositeSide(labelPosition);

    // When labels sit beside the funnel (not on the segments), the 120px plot
    // is too narrow: the label margins eat the whole width and leave 0px for the
    // funnel. Make the plot grow to fill available width in that case; the fixed
    // 120px square is only for the default "no outside labels" layout.
    const hasOutsideLabels =
      (showLabels && labelPosition !== 'inside') ||
      (showValueLabels && resolvedValuePosition !== 'inside');

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
    // One renderer for both slots: recharts swaps in `activeShape` for the
    // hovered stage, so leaving it unset would drop back to its own square-
    // cornered, gapless `Trapezoid` on hover.
    const renderStage = (stageProps: FunnelStageShapeProps) => (
      <FunnelStageShape
        {...stageProps}
        showActiveShape={showActiveShape}
        // `reversed` stacks the funnel the other way up, so the stage with no
        // gap above it is the last row rather than the first.
        topStageIndex={reversed ? seriesData.length - 1 : 0}
      />
    );

    return (
      <div
        ref={ref}
        data-last-shape={lastShape}
        className={cn(
          // The design's funnel is a row: a square plot, a 16px gutter, then the
          // legend taking whatever is left — so the component fills its parent's
          // width without the plot stretching into a tall, narrow wedge.
          'flex flex-row items-center gap-4',
          !showLegend && 'justify-center',
          funnelChartVariants({ lastShape }),
          className
        )}
        {...props}
      >
        <div
          className={
            hasOutsideLabels
              ? 'h-[120px] flex-1'
              : cn(PLOT_SIZE_CLASS, 'shrink-0')
          }
        >
          <ChartContainer
            config={config}
            palette={palette ?? FUNNEL_CHART_DEFAULT_PALETTE}
            className="size-full"
          >
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
              <Funnel
                dataKey={dataKey}
                nameKey={nameKey}
                data={seriesData}
                lastShapeType={lastShape ?? 'triangle'}
                reversed={reversed}
                width={resolvedFunnelWidth}
                stroke={resolvedStroke}
                strokeWidth={strokeWidth}
                shape={renderStage}
                activeShape={renderStage}
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
                      labelFill
                        ? undefined
                        : resolveLabelFillClass(stagePosition)
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
        {showLegend && resolvedConfigForLegend && (
          <ChartLegendContent
            variant="list"
            payload={legendPayload}
            config={resolvedConfigForLegend}
            nameKey={nameKey}
            valueKey={dataKey}
            valueFormatter={legendValueFormatter}
            // Figma paints the funnel legend's value in the primary text token,
            // not the link token the donut/radial legends use for theirs.
            valueClassName="text-[var(--ui-text-on-surface-primary)]"
            className="min-w-0 flex-1"
          />
        )}
      </div>
    );
  }
);
FunnelChart.displayName = 'FunnelChart';

export { FunnelChart, funnelChartVariants };
