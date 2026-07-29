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

/** A recharts-compatible tick formatter: `(value, index) => label`. */
export type TickFormatter = (value: number | string, index?: number) => string;

/** Axis knobs shared by every cartesian chart. All optional; axes show by default. */
export interface CartesianAxisProps {
  /** Show the X axis (its ticks + title). Defaults to `true`. */
  showXAxis?: boolean;
  /** Show the Y axis (its ticks + title). Defaults to `true`. */
  showYAxis?: boolean;
  /** Format each X-axis tick value — e.g. `formatCompactNumber` or a `createTickFormatter(...)`. */
  xTickFormatter?: TickFormatter;
  /** Format each Y-axis tick value — e.g. `formatCompactNumber` or a `createTickFormatter(...)`. */
  yTickFormatter?: TickFormatter;
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
