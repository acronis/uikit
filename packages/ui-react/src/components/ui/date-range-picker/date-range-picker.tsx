import * as React from 'react';
import type {
  DateRange as RdpDateRange,
  DayPickerLocale,
  Matcher,
} from 'react-day-picker';

import { useDocDir } from '@/lib/use-doc-dir';
import { CalendarPanel } from '../calendar-panel';
import { InputDatePicker } from '../input-date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  formatDate,
  normalizeRange,
  type DateRange,
} from './date-range-picker-utils';

export type { DateRange };

// A range date picker: the `InputDatePicker` trigger (pickerType="dateRange")
// opens a Popover holding a dual-month range `CalendarPanel`. Mirrors the
// draft/commit/revert idiom of `FilterSearchFilters`: the applied range is
// snapshotted into a draft on open; selecting days mutates only the draft;
// dismissing the popover (outside press / Escape) reverts the draft, `Cancel`
// does the same explicitly, and only `Apply` commits it via `onValueChange`
// and closes. The footer (Cancel/Apply) is `CalendarPanel`'s own — this
// component owns no footer or fields of its own.
//
// Everything below `className` in the props is a pass-through to that
// `CalendarPanel` — the selection constraints and every string it renders on its
// own — so a consumer can localize and constrain the popup without reaching for
// `CalendarPanel` directly. Only `disabledDays` is renamed (the panel's
// `disabled`), because `disabled` here disables the trigger. `locale` is also
// read directly by the trigger's `formatDate` (below), not just passed through.
//
// No dedicated token tier — the trigger brings `--ui-input-date-picker-*` and
// the popup is themed by the composed `CalendarPanel`. `Popover` contributes
// only positioning, portaling and dismissal — its own container chrome is
// neutralized via `className` below so `CalendarPanel`'s own chrome shows
// through instead.

export interface DateRangePickerProps {
  /** The applied range (controlled). Omit for uncontrolled use with `defaultValue`. */
  value?: DateRange;
  /** The initial applied range (uncontrolled). */
  defaultValue?: DateRange;
  /** Called with the committed range when Apply is pressed. */
  onValueChange?: (range: DateRange) => void;
  /** Field label for the trigger. */
  label?: React.ReactNode;
  /** Helper text below the trigger. */
  description?: React.ReactNode;
  /** Error message below the trigger (switches the trigger to its error treatment). */
  error?: React.ReactNode;
  /** Hint shown in the trigger when no range is selected. */
  placeholder?: React.ReactNode;
  /** Disables the trigger and prevents opening the popover. */
  disabled?: boolean;
  /** Marks the trigger required. */
  required?: boolean;
  /** Extra classes merged onto the trigger. */
  className?: string;
  /** Days that cannot be selected in the calendar. */
  disabledDays?: Matcher | Matcher[];
  /** Minimum number of nights between the range's start and end (`differenceInCalendarDays(to, from)`) — e.g. `min={7}` requires at least 8 selectable days. */
  min?: number;
  /** Maximum number of nights between the range's start and end (`differenceInCalendarDays(to, from)`) — e.g. `max={31}` admits up to 32 selectable days. */
  max?: number;
  /** Render the leading/trailing days of the adjacent months. */
  showOutsideDays?: boolean;
  /**
   * First day of the week (0 = Sunday). Defaults to `locale`'s own week
   * start, falling back to Monday when no `locale` is given.
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * First year offered by the year dropdown and the earliest month the grid
   * can navigate to. Defaults to 50 years back.
   */
  fromYear?: number;
  /**
   * Last year offered by the year dropdown and the latest month the grid can
   * navigate to. Defaults to 50 years ahead.
   */
  toYear?: number;
  /**
   * Localizes weekday names, the calendar's default day-cell/caption
   * accessible labels, and the trigger's month name (e.g. `import { es }
   * from 'react-day-picker/locale'`). The trigger's day/year order stays
   * fixed (`MMM d, yyyy`) — only the month name translates, not the
   * ordering. Defaults to date-fns `enUS`. Does not translate `monthLabel`/
   * `yearLabel`/`cancelLabel`/`applyLabel`/`formatMonthLabel` — those are
   * separate props.
   */
  locale?: DayPickerLocale;
  /** Accessible name of the calendar's month dropdown. */
  monthLabel?: string;
  /** Accessible name of the calendar's year dropdown. */
  yearLabel?: string;
  /** Formats a month's name for the month dropdown. Defaults to `locale`-aware `date-fns` formatting. */
  formatMonthLabel?: (date: Date) => string;
  /** Popup footer's "Cancel" button label. */
  cancelLabel?: string;
  /** Popup footer's "Apply" button label. */
  applyLabel?: string;
}

const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      label,
      description,
      error,
      placeholder,
      disabled,
      required,
      className,
      disabledDays,
      min,
      max,
      showOutsideDays,
      weekStartsOn,
      fromYear,
      toYear,
      locale,
      monthLabel,
      yearLabel,
      formatMonthLabel,
      cancelLabel,
      applyLabel,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalApplied, setInternalApplied] = React.useState<DateRange>(
      defaultValue ?? {}
    );
    const applied = isControlled ? (value as DateRange) : internalApplied;

    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<DateRange>(applied);

    // `CalendarPanel` needs an explicit `dir` — `react-day-picker`'s own
    // Arrow-Left/Right roaming only mirrors when `dir` reaches it directly,
    // not via CSS/ancestor `dir` inheritance (see calendar-panel.tsx). Read
    // it via `useDocDir()` (`src/lib/use-doc-dir.ts`) rather than adding a
    // public `dir` prop, so an ancestor still sets it and this component
    // doesn't need one of its own — the same hook `app-shell-chat.tsx` and
    // `dialog-welcome.tsx` use to feed `dir` into other things that need it
    // directly (a resize edge's keyboard math, Embla's `direction` option).
    // It reads `document.documentElement`, not a per-ancestor lookup off the
    // trigger, so it isn't affected by the trigger itself being rendered
    // inside another component's portaled content (e.g. a
    // `FilterSearchFilters` popover) — the real DOM ancestor chain there no
    // longer includes an app-level `dir` wrapper that only wraps the React
    // tree, but `document.documentElement` is unaffected either way.
    const dir = useDocDir();

    const handleOpenChange = (nextOpen: boolean) => {
      // Snapshot the applied range on open; revert the draft on any dismiss
      // (outside press / Escape) so an un-applied edit never leaks out.
      setDraft(applied);
      setOpen(nextOpen);
    };

    const handleCancel = () => {
      setDraft(applied);
      setOpen(false);
    };

    const handleApply = () => {
      // Commit chronologically ordered so an inverted selection is normalized
      // rather than committed inverted.
      const committed = normalizeRange(draft);
      if (!isControlled) setInternalApplied(committed);
      onValueChange?.(committed);
      setOpen(false);
    };

    // Feed the calendar a normalized range so an inverted draft still
    // highlights the correct band. react-day-picker's `DateRange` requires
    // `from`, so a to-only draft is fed as a single selected day at `to` —
    // otherwise `selected` would be `undefined` and the next calendar click
    // would start a fresh range instead of completing this one.
    const normalizedDraft = normalizeRange(draft);
    let selectedRange: RdpDateRange | undefined;
    if (normalizedDraft.from) {
      selectedRange = { from: normalizedDraft.from, to: normalizedDraft.to };
    } else if (normalizedDraft.to) {
      selectedRange = { from: normalizedDraft.to, to: normalizedDraft.to };
    }

    const handleSelect = (range: RdpDateRange | undefined) => {
      setDraft({ from: range?.from, to: range?.to });
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <InputDatePicker
              ref={ref}
              pickerType="dateRange"
              label={label}
              description={description}
              error={error}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              startDate={formatDate(applied.from, locale)}
              endDate={formatDate(applied.to, locale)}
              open={open}
              className={className}
            />
          }
        />
        <PopoverContent
          align="start"
          className="w-auto max-w-none rounded-none border-none bg-transparent p-0 shadow-none"
        >
          <CalendarPanel
            variant="range"
            selected={selectedRange}
            onSelect={handleSelect}
            defaultMonth={draft.from ?? applied.from}
            onCancel={handleCancel}
            onApply={handleApply}
            dir={dir}
            disabled={disabledDays}
            min={min}
            max={max}
            showOutsideDays={showOutsideDays}
            weekStartsOn={weekStartsOn}
            fromYear={fromYear}
            toYear={toYear}
            locale={locale}
            monthLabel={monthLabel}
            yearLabel={yearLabel}
            formatMonthLabel={formatMonthLabel}
            cancelLabel={cancelLabel}
            applyLabel={applyLabel}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
