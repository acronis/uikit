// Shared axis helpers for the cartesian chart components (BarChart, LineChart,
// AreaChart, ComposedChart, ScatterChart, ConfidenceCone, Histogram). Two
// concerns live here so every chart formats + toggles axes the same way rather
// than each reimplementing it:
//
//  1. `CartesianAxisProps` — the common axis knobs each cartesian chart mixes
//     into its own props (show/hide either axis, per-axis tick formatting).
//  2. A small set of tick formatters (+ a factory) callers pass to
//     `xTickFormatter` / `yTickFormatter`.
//
// These format only the axis *tick labels*; series colors and tokens are
// unaffected. Formatters coerce to a number and pass non-numeric values through
// untouched (a category axis stays readable if a formatter is applied to it).

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
  /** Unit suffix appended to the numeric axis's tick values (recharts `unit`). */
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
   * X-axis tick density — a fixed number (show every Nth tick), or a recharts
   * placement strategy that thins ticks while keeping the ends legible.
   */
  xAxisInterval?:
    | number
    | 'preserveStart'
    | 'preserveEnd'
    | 'preserveStartEnd'
    | 'equidistantPreserveStart';
  /** Desired number of Y-axis ticks (recharts `tickCount`; treated as a hint, not exact). */
  yAxisTickCount?: number;
  /**
   * Y-axis domain preset: `auto` (recharts' padded default), `dataMin-dataMax`
   * (tight to the data), or `zero` (anchor the axis at 0). Applies to the
   * numeric Y axis.
   */
  yAxisDomain?: 'auto' | 'dataMin-dataMax' | 'zero';
  /** Draw grid lines dashed instead of solid. */
  gridDashed?: boolean;
  /** Show horizontal grid lines. Defaults to each chart's own default when unset. */
  gridHorizontal?: boolean;
  /** Show vertical grid lines. Defaults to each chart's own default when unset. */
  gridVertical?: boolean;
}

const toNumber = (value: number | string): number | null => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

/**
 * Compact thousands/millions: `1234 → "1.2K"`, `1_500_000 → "1.5M"`. Non-numeric
 * values pass through unchanged. Use for large-count axes (revenue, users, …).
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
 * is treated as a percentage, not a 0–1 fraction.) Non-numeric values pass through.
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
