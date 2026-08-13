import { format, isValid } from 'date-fns';
import type { DayPickerLocale } from 'react-day-picker';

/** A start/end date range. Both ends are optional (a partial range while editing). */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * The date display pattern used by the trigger. Fixed month-day-year order
 * regardless of `locale` — only the month/day/era token *names* localize (see
 * {@link formatDate}); true locale-aware reordering is a separate, bigger
 * change (tracked, not done here).
 */
export const DISPLAY_FORMAT = 'MMM d, yyyy';

/**
 * Format a date with {@link DISPLAY_FORMAT}, returning `''` for a missing or
 * invalid `Date`. `date-fns`' `format` throws a `RangeError` on an invalid
 * `Date` (e.g. `new Date('garbage')`), so the `isValid` guard is load-bearing —
 * a truthy-but-invalid `Date` must not reach `format`.
 *
 * `locale` only translates the month name via `date-fns`' `format` `options`
 * — it does not reorder `DISPLAY_FORMAT`'s fixed month-day-year pattern.
 */
export function formatDate(
  date: Date | undefined,
  locale?: DayPickerLocale
): string {
  return date && isValid(date) ? format(date, DISPLAY_FORMAT, { locale }) : '';
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
