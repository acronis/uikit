import { format, isValid, parse, startOfDay } from 'date-fns';

/** A start/end date range. Both ends are optional (a partial range while editing). */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/** The date display / parse pattern used by the trigger and the editable fields. */
export const DISPLAY_FORMAT = 'MMM d, yyyy';

/**
 * Format a date with {@link DISPLAY_FORMAT}, returning `''` for a missing or
 * invalid `Date`. `date-fns`' `format` throws a `RangeError` on an invalid
 * `Date` (e.g. `new Date('garbage')`), so the `isValid` guard is load-bearing —
 * a truthy-but-invalid `Date` must not reach `format`.
 */
export function formatDate(date: Date | undefined): string {
  return date && isValid(date) ? format(date, DISPLAY_FORMAT) : '';
}

/**
 * Parse a {@link DISPLAY_FORMAT} string into a `Date`, or `undefined` when the
 * text is empty, partial (mid-type), or not a real calendar date
 * (e.g. `"Feb 30, 2026"`). The result is normalized to the start of the day so
 * it round-trips with {@link formatDate} — `date-fns`' `parse` fills the unspecified
 * time-of-day from its reference date, which would otherwise leave a "now" time
 * on the value and break equality with the midnight dates the calendar emits.
 *
 * NOTE: the pattern is locale-fixed (US-style `MMM d, yyyy`), matching the
 * `InputDatePicker` trigger. Locale-aware parsing is not yet supported — a
 * known limitation to revisit once the design tier lands.
 */
export function parseDate(text: string): Date | undefined {
  const parsed = parse(text.trim(), DISPLAY_FORMAT, new Date());
  return isValid(parsed) ? startOfDay(parsed) : undefined;
}

/** Structural equality of two ranges by their endpoints' timestamps. */
export function rangesEqual(a: DateRange, b: DateRange): boolean {
  return (
    a.from?.getTime() === b.from?.getTime() &&
    a.to?.getTime() === b.to?.getTime()
  );
}

/**
 * Return a range whose `from` is never after its `to`. When both ends are set
 * and inverted (e.g. the user typed an end date earlier than the start), the two
 * are swapped; a partial range (one end unset) is returned unchanged. Used to
 * keep the calendar highlight and the committed value chronologically ordered.
 */
export function normalizeRange(range: DateRange): DateRange {
  const { from, to } = range;
  if (from && to && from.getTime() > to.getTime()) {
    return { from: to, to: from };
  }
  return range;
}
