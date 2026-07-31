// Shared axis helpers for the cartesian chart components (BarChart, LineChart,
// AreaChart, ComposedChart, ScatterChart, ConfidenceCone, Histogram). Three
// concerns live here so every chart formats + toggles axes the same way rather
// than each reimplementing it:
//
//  1. `CartesianChartProps` — the common axis knobs each cartesian chart mixes
//     into its own props (show/hide either axis, per-axis tick formatting).
//  2. A small set of tick formatters (+ a factory) callers pass to
//     `xTickFormatter` / `yTickFormatter`.
//  3. `resolveAxisDomain` — maps the `yAxisDomain` preset to a recharts
//     `domain`, shared so all 7 charts can't drift apart on it.
//
// These format only the axis *tick labels*; series colors and tokens are
// unaffected. Formatters coerce to a number and pass non-numeric values through
// untouched (a category axis stays readable if a formatter is applied to it).

import type { AxisDomainItem } from 'recharts';

import type { ChartTooltipContentType } from './chart';

/** A recharts-compatible tick formatter: `(value, index) => label`. */
export type TickFormatter = (value: number | string, index?: number) => string;

/**
 * Props shared by every cartesian chart (Bar, Line, Area, Composed, Scatter,
 * ConfidenceCone, Histogram) — chrome toggles, axis titles/units, tick
 * formatting/visibility, and grid trim. All optional. `showLegend` and `xUnit`
 * are deliberately *not* here: `showLegend` doesn't apply to `Histogram` and
 * `xUnit` only to charts with a numeric X axis, so they stay per-component.
 */
export interface CartesianChartProps {
  /** Render the CartesianGrid. Defaults to `true`. */
  showGrid?: boolean;
  /** Render the hover tooltip. Defaults to `true`. */
  showTooltip?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent` (from
   * this library) — e.g. with a `formatter` / `labelFormatter` — to customize it
   * without composing recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: ChartTooltipContentType;
  /** Title rendered beneath the X axis. */
  xAxisLabel?: string;
  /** Title rendered beside the Y axis (rotated). */
  yAxisLabel?: string;
  /**
   * Unit suffix appended to the Y axis's tick values (recharts `unit`) — applies
   * when the Y axis is the numeric one. `BarChart` with
   * `orientation="horizontal"` puts the values on X instead; use `xUnit` there.
   */
  yUnit?: string;
  /** Show the X axis (its ticks + title). Defaults to `true`. */
  showXAxis?: boolean;
  /** Show the Y axis (its ticks + title). Defaults to `true`. */
  showYAxis?: boolean;
  /** Format each X-axis tick value — e.g. `formatCompactNumber` or a `createTickFormatter(...)`. */
  xTickFormatter?: TickFormatter;
  /** Format each Y-axis tick value — e.g. `formatCompactNumber` or a `createTickFormatter(...)`. */
  yTickFormatter?: TickFormatter;
  /**
   * Rotate the X-axis tick labels by this many degrees. A negative angle (e.g.
   * `-45`) tilts them up toward the right; the tick anchor + axis height adjust
   * to keep long labels readable.
   */
  xAxisAngle?: number;
  /**
   * X-axis tick density — a recharts placement strategy, or a fixed number of
   * ticks to *skip* between two rendered ones (recharts `interval`: `0` shows
   * every tick, `1` every other one, `2` every third, …).
   */
  xAxisInterval?:
    | number
    | 'preserveStart'
    | 'preserveEnd'
    | 'preserveStartEnd'
    | 'equidistantPreserveStart';
  /**
   * Desired number of ticks on the value axis (recharts `tickCount`; a hint, not
   * exact). Applies to whichever axis holds the values — Y for most charts, X for
   * `BarChart` with `orientation="horizontal"`.
   */
  yAxisTickCount?: number;
  /**
   * Value-axis domain preset. Applies to whichever axis holds the values — Y for
   * most charts, X for `BarChart` with `orientation="horizontal"`.
   *
   * - `auto` — fit the data at both ends; the axis need not include 0.
   * - `zero` — anchor the axis at 0. This is also recharts' behavior when the
   *   prop is omitted, so it's the explicit form of the default.
   * - `dataMin-dataMax` — tight to the data, with no padding.
   */
  yAxisDomain?: 'auto' | 'dataMin-dataMax' | 'zero';
  /** Draw grid lines dashed instead of solid. */
  gridDashed?: boolean;
  /** Show horizontal grid lines. Defaults to each chart's own default when unset. */
  gridHorizontal?: boolean;
  /** Show vertical grid lines. Defaults to each chart's own default when unset. */
  gridVertical?: boolean;
}

/**
 * Map a `yAxisDomain` preset to a recharts `domain`. Shared by all 7 cartesian
 * charts, and applied to whichever axis holds the values (X for horizontal bars).
 *
 * `undefined` (no preset) is left to recharts, whose default is `[0, 'auto']` —
 * i.e. already zero-anchored. That's why `auto` has to be spelled out as
 * `['auto', 'auto']`: passing `undefined` for it would silently anchor at 0 and
 * make the preset indistinguishable from `zero`.
 */
export function resolveAxisDomain(
  preset: 'auto' | 'dataMin-dataMax' | 'zero' | undefined
): Readonly<[AxisDomainItem, AxisDomainItem]> | undefined {
  switch (preset) {
    case 'auto':
      return ['auto', 'auto'];
    case 'zero':
      return [0, 'auto'];
    case 'dataMin-dataMax':
      return ['dataMin', 'dataMax'];
    default:
      return undefined;
  }
}

/**
 * Which value axis a series is measured against, on a chart that can carry two.
 *
 * `secondary` is the opt-in: the second axis exists only when at least one series
 * asks for it, so a chart whose series all leave this unset keeps the single
 * shared scale — and its recharts output — exactly as before.
 */
export type ChartYAxisTarget = 'primary' | 'secondary';

/**
 * Second value-axis props, for a chart whose series can be measured on two
 * independent scales. **Only `ComposedChart` implements these today.** It is the
 * one chart in the suite where two scales are unambiguous: its series already
 * differ in mark type, so a bar read against the left axis and a line against the
 * right can't be mistaken for two marks sharing one. On a single-mark chart (Bar,
 * Area) two scales invite comparing heights that aren't comparable, which is why
 * these props are not mixed into `CartesianChartProps`.
 *
 * The primary axis is configured through `CartesianChartProps` (`yAxisLabel`,
 * `yUnit`, `yTickFormatter`, `yAxisTickCount`, `yAxisDomain`, `showYAxis`); every
 * `secondary*` prop here is its counterpart on the second axis, so the two scales
 * format and bound themselves independently, and each is inert until a series
 * selects that axis.
 *
 * `yAxisOrientation` is the exception on both counts: it places the *primary*
 * axis, and it applies whether or not a second one exists. It lives here because
 * it is only meaningful once a chart can mirror a pair of axes — a single-axis
 * chart has no second side to give up.
 */
export interface SecondaryYAxisProps {
  /**
   * Which side the *primary* value axis sits on. Defaults to `left`. The secondary
   * axis always takes the opposite side. Unlike the `secondary*` props below, this
   * one applies to a single-scale chart too.
   */
  yAxisOrientation?: 'left' | 'right';
  /**
   * Show the secondary axis's ticks + title. Defaults to `true`. Setting it false
   * keeps the second *scale* (series still measure against it) and only drops its
   * chrome — the same meaning `showYAxis` has for the primary axis.
   */
  showSecondaryYAxis?: boolean;
  /** Title rendered beside the secondary axis (rotated). */
  secondaryYAxisLabel?: string;
  /** Unit suffix appended to the secondary axis's tick values (recharts `unit`). */
  secondaryYUnit?: string;
  /** Format each secondary-axis tick value — the counterpart of `yTickFormatter`. */
  secondaryYTickFormatter?: TickFormatter;
  /** Desired number of ticks on the secondary axis (recharts `tickCount`; a hint, not exact). */
  secondaryYAxisTickCount?: number;
  /** Domain preset for the secondary axis — same presets as `yAxisDomain`. */
  secondaryYAxisDomain?: 'auto' | 'dataMin-dataMax' | 'zero';
}

/** recharts animation easing curves. */
export type ChartAnimationEasing =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear';

/**
 * Entrance-animation props shared by *every* chart type (not just the cartesian
 * ones) — charts hardcode `isAnimationActive={false}` otherwise. All optional and
 * off by default, so an unset chart renders byte-identically to before (and its
 * VR baselines stay stable). Spread `resolveAnimation(props)` onto each series.
 */
export interface ChartAnimationProps {
  /** Enable entrance animation. Defaults to `false` (keeps output/baselines stable). */
  animate?: boolean;
  /** Animation duration in ms (recharts `animationDuration`). */
  animationDuration?: number;
  /** Delay before the animation starts, in ms (recharts `animationBegin`). */
  animationBegin?: number;
  /** Easing curve (recharts `animationEasing`). */
  animationEasing?: ChartAnimationEasing;
}

/** The resolved recharts animation props to spread onto a series/shape. */
export interface ResolvedAnimation {
  isAnimationActive: boolean | 'auto';
  animationDuration?: number;
  animationBegin?: number;
  animationEasing?: ChartAnimationEasing;
}

/**
 * Turn the shared `ChartAnimationProps` into the recharts series props. The
 * timing props only appear when given, so an unset chart spreads exactly
 * `{ isAnimationActive: false }` — the previous hardcoded value.
 *
 * `animate` maps to recharts' `'auto'`, not to a literal `true`: `'auto'` is the
 * only value that honors `prefers-reduced-motion` (and disables the animation in
 * SSR). recharts resolves it as
 * `isActive = isActiveProp === 'auto' ? !isSsr && !prefersReducedMotion : isActiveProp`,
 * so a literal `true` would force motion on users who asked for none — this
 * library has no other reduced-motion escape hatch.
 */
export function resolveAnimation(props: ChartAnimationProps): ResolvedAnimation {
  const { animate = false, animationDuration, animationBegin, animationEasing } =
    props;
  return {
    isAnimationActive: animate ? 'auto' : false,
    ...(animationDuration !== undefined ? { animationDuration } : {}),
    ...(animationBegin !== undefined ? { animationBegin } : {}),
    ...(animationEasing !== undefined ? { animationEasing } : {}),
  };
}

/** Where a data label sits on a cartesian series (recharts `LabelList` position). */
export type CartesianLabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'insideTop'
  | 'insideBottom'
  | 'insideLeft'
  | 'insideRight'
  | 'insideStart'
  | 'insideEnd';

/**
 * Where a data label sits on a *polar* series (Pie, RadialBar). Deliberately not
 * `CartesianLabelPosition`: recharts routes a polar label list through
 * `getAttrsOfPolarLabel` / `renderRadialLabel`, which understand only these
 * seven values — every cartesian-only position (`top`, `insideLeft`, …) silently
 * collapses to the same mid-radius placement, so offering them would advertise
 * distinctions that don't exist.
 */
export type PolarLabelPosition =
  | 'outside'
  | 'center'
  | 'centerTop'
  | 'centerBottom'
  | 'insideStart'
  | 'insideEnd'
  | 'end';

/** Any position accepted by the suite's data labels. */
export type ChartLabelPosition = CartesianLabelPosition | PolarLabelPosition;

/**
 * Data-label props shared by the charts that can annotate each point/segment with
 * its value. `labelPosition` stays per-chart (the valid position set differs by
 * family), but `showLabels` + `labelFormatter` are common. Label formatting reuses
 * the same `TickFormatter` type as the axes, so a label and its axis read the same.
 */
export interface ChartDataLabelProps {
  /** Render a value label on each data point/segment. Defaults to `false`. */
  showLabels?: boolean;
  /** Format each label value — pass the same formatter used on the value axis. */
  labelFormatter?: TickFormatter;
}

/**
 * Fill for a label that sits on the chart *surface* — i.e. an outside position
 * (`top`, `right`, polar `outside`). Inverts with the theme, so it only works
 * against the surface background.
 */
export const CHART_LABEL_FILL_CLASS = 'fill-[var(--ui-text-on-surface-primary)]!';

/**
 * Fill for a label that sits on an *opaque series fill* — any `inside*`
 * position, a polar mid-radius/centroid placement, or a stacked bar/arc segment
 * (an area's fill is translucent, so it uses the on-surface token). The on-surface
 * token must not be used there: it resolves near-white in dark mode and drops to
 * ~1.6:1 against the saturated status/brand fills the charts colour series with,
 * failing the `accessibility/contrast` grammar rule (`must`, WCAG 1.4.3). This is
 * the same "text on a strong colored surface" token `Treemap` already uses; it is
 * white in both themes, so it holds up over every series colour.
 */
export const CHART_LABEL_FILL_ON_SERIES_CLASS =
  'fill-[var(--ui-text-on-status-strong-neutral)]!';

export const CHART_LABEL_FONT_SIZE = 12;

/**
 * Plot-area inset to apply when a Line/Area series carries outside data labels.
 * recharts hands those label lists `parentViewBox: undefined` (its own source
 * calls this out as a bug in `cartesian/Line.js`), so `getCartesianPosition`'s
 * `clamp` has nothing to clamp against and the first/last point's value is cut
 * off at the SVG edge. Widening the margin is the only lever a composition over
 * recharts has. `Bar` does pass a `parentViewBox`, so bar series don't need it.
 */
export const CHART_LABEL_MARGIN = {
  top: 16,
  right: 24,
  bottom: 5,
  left: 12,
} as const;

/** Positions that draw the label on top of the series fill rather than the surface. */
const ON_SERIES_LABEL_POSITIONS = new Set<ChartLabelPosition>([
  'center',
  'centerTop',
  'centerBottom',
  'insideTop',
  'insideBottom',
  'insideLeft',
  'insideRight',
  'insideStart',
  'insideEnd',
  'end',
]);

/**
 * Resolve where a cartesian value label sits, given the caller's override, the
 * layout, and the position of the series' growing end (`top` for a vertical bar
 * or a line/area point, `right` for a horizontal bar).
 *
 * The stacked branch is the reason this isn't inlined: a stacked segment has no
 * free space at its growing end — the next segment is drawn there — so a `top`
 * label lands *inside* its neighbour rather than over its own segment. Centring
 * it in its own segment is the readable placement; `resolveLabelFillClass` then
 * pairs it with the fill that has contrast over that family's series colour.
 */
export function resolveCartesianLabelPosition(options: {
  labelPosition?: CartesianLabelPosition;
  isStacked?: boolean;
  growingEnd?: CartesianLabelPosition;
}): CartesianLabelPosition {
  const { labelPosition, isStacked = false, growingEnd = 'top' } = options;
  if (labelPosition !== undefined) return labelPosition;
  return isStacked ? 'center' : growingEnd;
}

/**
 * Pick the label fill that actually has contrast at `position`. Callers must pass
 * the *resolved* position (after their own default), never `undefined` for a
 * polar chart — recharts' polar fallback is a mid-radius placement, which is on
 * the fill even though no `inside*` value was given.
 *
 * Returns a `className`, not a `fill` attribute, and the utility is `!`-flagged:
 * the cartesian charts scope `[&_.recharts-label]:fill-foreground` on their
 * container to theme axis titles, and a `LabelList`'s text carries
 * `.recharts-label` too — so a CSS rule would quietly beat an SVG presentation
 * attribute and undo the contrast fix.
 *
 * `translucentSeries` opts a family out of the on-fill token: an area's fill is
 * a gradient (0.8 → 0.1 alpha) or a flat `fillOpacity`, so what sits behind the
 * label is the surface tinted by the series colour, not the series colour. The
 * white on-fill token disappears into it in light mode — the theme-inverting
 * on-surface token is the readable one there, and stays white in dark mode.
 */
export function resolveLabelFillClass(
  position: ChartLabelPosition,
  options: { translucentSeries?: boolean } = {}
): string {
  if (options.translucentSeries) return CHART_LABEL_FILL_CLASS;
  return ON_SERIES_LABEL_POSITIONS.has(position)
    ? CHART_LABEL_FILL_ON_SERIES_CLASS
    : CHART_LABEL_FILL_CLASS;
}

/**
 * Adapt a `TickFormatter` to recharts' `LabelList` `formatter` prop, whose value
 * type is wider. Returns `undefined` when no formatter is given, so a label
 * renders its raw value. Lets labels reuse the same formatters as the value axis.
 *
 * Null/undefined is filtered out rather than forwarded: recharts builds a label
 * entry for *every* point including the null ones that `connectNulls` is meant to
 * bridge, and the tick formatters coerce (`formatCompactNumber(null)` is `"0"`,
 * `formatPercent(undefined)` is `"undefined"`) — which would paint a phantom
 * value over an intentional gap.
 */
export function toLabelFormatter(
  formatter: TickFormatter | undefined
): ((value: unknown) => string) | undefined {
  if (!formatter) return undefined;
  return (value: unknown) =>
    value == null ? '' : formatter(value as number | string);
}

/**
 * Range-brush props for the cartesian charts that support one — `BarChart`,
 * `LineChart`, `AreaChart`, `ComposedChart`. Deliberately not folded into
 * `CartesianChartProps`: `ScatterChart` plots a continuous X (the brush indexes
 * rows, not values) and `Histogram` / `ConfidenceCone` render a derived series,
 * so a brush over their row order would slice the wrong thing.
 */
export interface ChartBrushProps {
  /**
   * Render a range brush beneath the chart — drag its handles (or the selected
   * window) to zoom the series to a slice of the data. Defaults to `false`.
   */
  showBrush?: boolean;
  /** Height of the brush strip in px. Defaults to 28. */
  brushHeight?: number;
  /**
   * Accessible name for the brush's two range handles. Both are focusable
   * `role="slider"` elements, so they need one. Defaults to
   * `'Chart range selector'`.
   */
  brushAriaLabel?: string;
}

/**
 * Height of the brush strip. recharts' own default is 40, which eats an eighth
 * of a 320px-tall dashboard widget; 28 still fits the travellers and the
 * range captions.
 */
export const CHART_BRUSH_HEIGHT = 28;

/**
 * Accessible name for the brush handles. recharts' own fallback is
 * `"Min value: ".concat(start, ", Max value: ").concat(end)`, where both halves
 * come from a `name` property on the data row — a field none of our charts
 * require, so it announces "Min value: undefined, Max value: undefined". Always
 * pass `ariaLabel` to suppress it.
 */
export const CHART_BRUSH_ARIA_LABEL = 'Chart range selector';

/** The resolved recharts brush props to spread onto a `<Brush>`. */
export interface ResolvedBrush {
  height: number;
  fill: string;
  stroke: string;
  travellerWidth: number;
  ariaLabel: string;
}

/**
 * Theme + size a recharts `<Brush>` from the shared `ChartBrushProps`.
 *
 * recharts derives the *whole* brush from two color props, so both have to be
 * chosen for every element they reach (`cartesian/Brush.js`):
 * - `fill` paints only the strip's background rect.
 * - `stroke` paints its border, the traveller handles' **fill**, the selected
 *   window at 20% opacity, and the range caption text.
 *
 * Hence the mid-grey text token rather than the border one: the travellers are
 * solid `stroke`-colored rects with two hardcoded `#fff` grip lines drawn on
 * top, so a pale stroke would render the grips invisible in light mode. That
 * token is theme-stable (same grey in light and dark), and white grips read
 * against it either way.
 */
export function resolveBrushProps({
  brushHeight,
  brushAriaLabel = CHART_BRUSH_ARIA_LABEL,
}: Omit<ChartBrushProps, 'showBrush'>): ResolvedBrush {
  return {
    // recharts drops the brush entirely when height <= 0, which would turn
    // `showBrush` into a silent no-op — treat a non-positive height as unset.
    height:
      brushHeight != null && brushHeight > 0 ? brushHeight : CHART_BRUSH_HEIGHT,
    fill: 'var(--ui-background-surface-secondary)',
    stroke: 'var(--ui-text-on-surface-secondary)',
    travellerWidth: 8,
    ariaLabel: brushAriaLabel,
  };
}

const toNumber = (value: number | string): number | null => {
  // `Number('')` and `Number(' ')` are 0, not NaN — so blank strings have to be
  // rejected before the finite check, or an empty tick label would render "0".
  if (typeof value === 'string' && value.trim() === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

/**
 * Compact thousands/millions: `1234 → "1.2K"`, `1_500_000 → "1.5M"`. Non-numeric
 * values (including blank strings) pass through unchanged. Use for large-count
 * axes (revenue, users, …).
 *
 * Formats in `en`. For another locale use
 * `createTickFormatter({ notation: 'compact', maximumFractionDigits: 1 }, locale)`.
 */
export const formatCompactNumber: TickFormatter = (value) => {
  const n = toNumber(value);
  if (n === null) return String(value);
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
};

/**
 * Append a percent sign to an already-scaled value: `41.8 → "41.8%"`. (The value
 * is treated as a percentage, not a 0–1 fraction.) Non-numeric values (including
 * blank strings) pass through.
 *
 * Appends a bare `%`, which is not how every locale writes it. For locale-correct
 * output on values that really are fractions, use
 * `createTickFormatter({ style: 'percent' }, locale)`.
 */
export const formatPercent: TickFormatter = (value) => {
  const n = toNumber(value);
  if (n === null) return String(value);
  return `${n}%`;
};

/**
 * Build a tick formatter from `Intl.NumberFormat` options — the escape hatch for
 * currency, fixed decimals, or a specific locale. E.g.
 * `createTickFormatter({ style: 'currency', currency: 'USD', notation: 'compact' })`
 * → `146500 → "$147K"`. Non-numeric values pass through unchanged.
 */
export function createTickFormatter(
  options: Intl.NumberFormatOptions,
  locale = 'en'
): TickFormatter {
  const nf = new Intl.NumberFormat(locale, options);
  return (value) => {
    const n = toNumber(value);
    return n === null ? String(value) : nf.format(n);
  };
}
