import { addMonths } from 'date-fns';

import type { CalendarPanelSelected, CalendarPanelVariant } from './calendar-panel';
import type { DateRange, DayPickerLocale, DayPickerProps } from 'react-day-picker';

/** Number of years offered on each side of the current year by default. */
export const DEFAULT_YEAR_SPAN = 50;

/** A `{value, label}` pair for one `InputSelect` option in the header dropdowns. */
export interface CalendarSelectItem<T> {
  value: T;
  label: string;
}

/**
 * Resolves the year dropdown's bounds: an explicit `fromYear`/`toYear` wins,
 * otherwise falls back to `currentYear` ± `span`.
 */
export function resolveYearRange(
  fromYear: number | undefined,
  toYear: number | undefined,
  currentYear: number,
  span: number = DEFAULT_YEAR_SPAN
): { fromYear: number; toYear: number } {
  return {
    fromYear: fromYear ?? currentYear - span,
    toYear: toYear ?? currentYear + span,
  };
}

/** Day-of-week index DayPicker accepts for `weekStartsOn` (0 = Sunday). */
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Resolves the week's first day: an explicit `weekStartsOn` wins, then the
 * `locale`'s own week start, then Monday (per the design default).
 */
export function resolveWeekStartsOn(
  weekStartsOn: WeekStartsOn | undefined,
  locale: DayPickerLocale | undefined
): WeekStartsOn {
  return weekStartsOn ?? (locale?.options?.weekStartsOn as WeekStartsOn | undefined) ?? 1;
}

/**
 * Builds the 12 month dropdown items. Formats each from year 2000 (a leap
 * year), so every month — including February 29 — formats from a valid date.
 */
export function buildMonthItems(
  formatMonthLabel: (date: Date) => string
): CalendarSelectItem<number>[] {
  return Array.from({ length: 12 }, (_unused, index) => ({
    value: index,
    label: formatMonthLabel(new Date(2000, index, 1)),
  }));
}

/**
 * Builds the year dropdown items spanning `fromYear`..`toYear` inclusive.
 * An inverted range (`toYear < fromYear`) clamps to a single `fromYear` item
 * rather than producing an empty or negative-length list.
 */
export function buildYearItems(
  fromYear: number,
  toYear: number
): CalendarSelectItem<number>[] {
  return Array.from({ length: Math.max(toYear - fromYear + 1, 1) }, (_unused, index) => ({
    value: fromYear + index,
    label: String(fromYear + index),
  }));
}

/**
 * Backs a header-dropdown navigation target off so the last of `numberOfMonths`
 * displayed months doesn't run past `endMonth`. Mirrors react-day-picker's own
 * `getInitialMonth` back-off — its `goToMonth` only clamps the *first* displayed
 * month to `endMonth`, so for a two-month `range` panel, requesting a first month
 * within one month of `endMonth` (e.g. `endMonth` itself) leaves the second month
 * past the bound, and `getDisplayMonths` silently drops it instead of the pair
 * sliding back.
 */
export function clampNavigationTarget(
  target: Date,
  endMonth: Date,
  numberOfMonths: number
): Date {
  const monthsUntilEnd =
    (endMonth.getFullYear() - target.getFullYear()) * 12 +
    (endMonth.getMonth() - target.getMonth());
  return monthsUntilEnd < numberOfMonths - 1
    ? addMonths(endMonth, -(numberOfMonths - 1))
    : target;
}

/**
 * Assembles DayPicker's mode-specific selection props from `variant`. DayPicker's
 * props are a discriminated union keyed by a literal `mode`, so each branch is
 * built separately (rather than a single object with `mode: variant`) — a
 * literal tag is what lets TypeScript pick the matching union member without
 * an `as DayPickerProps` assertion. `selected`/`onSelect` are cast per branch
 * to their branch-specific shape only, which the discriminated `CalendarPanelProps`
 * union above guarantees is safe at the call site.
 */
export function buildModeProps(
  variant: CalendarPanelVariant,
  selected: CalendarPanelSelected,
  onSelect: ((selected: CalendarPanelSelected, triggerDate: Date) => void) | undefined,
  min: number | undefined,
  max: number | undefined
): DayPickerProps {
  switch (variant) {
    case 'single':
      return {
        mode: 'single',
        selected: selected as Date | undefined,
        onSelect: onSelect as ((selected: Date | undefined, triggerDate: Date) => void) | undefined,
      };
    case 'multiple':
      return {
        mode: 'multiple',
        selected: selected as Date[] | undefined,
        onSelect: onSelect as ((selected: Date[] | undefined, triggerDate: Date) => void) | undefined,
        min,
        max,
      };
    case 'range':
      return {
        mode: 'range',
        selected: selected as DateRange | undefined,
        onSelect: onSelect as ((selected: DateRange | undefined, triggerDate: Date) => void) | undefined,
        min,
        max,
      };
  }
}
