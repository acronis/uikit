import * as React from 'react';
import { addMonths, format } from 'date-fns';
import {
  DayPicker,
  useDayPicker,
  type DateRange,
  type DayButton,
  type DayPickerLocale,
  type Matcher,
  type MonthCaptionProps,
} from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { DialogFooterDefault } from '../dialog-footer-default';
import {
  InputSelect,
  InputSelectContent,
  InputSelectItem,
  InputSelectTrigger,
  InputSelectValue,
} from '../input-select';
import {
  DEFAULT_YEAR_SPAN,
  buildModeProps,
  buildMonthItems,
  buildYearItems,
  clampNavigationTarget,
  resolveWeekStartsOn,
  resolveYearRange,
  type CalendarSelectItem,
} from './calendar-panel-utils';

// The Figma "Calendar" panel: a bordered, elevated day-picker panel themed by the
// dedicated `--ui-calendar-*` tier. Its three variants are the three
// `react-day-picker` selection modes, and each one changes the panel's structure:
//   • single   — one 248px month, no footer.
//   • multiple — one 248px month + a Cancel/Apply footer.
//   • range    — two 248px months side by side (divided by a vertical rule) sharing
//                one Cancel/Apply footer.
// Figma's `state` axis (idle / selected) is demo-only — it is DayPicker's runtime
// selection state, not a prop.
//
// The month/year pickers in the header are real `InputSelect` instances (as in the
// design), wired through DayPicker's custom-component API: the whole `MonthCaption`
// is replaced, rather than using `captionLayout="dropdown"`'s native `<select>`
// elements. Per-instance caption options (labels, year window, month formatter) reach
// that override through `CalendarPanelCaptionContext`, since DayPicker instantiates
// custom components itself and passes only its own props.
//
// Every cell — idle, hover, in-range, endpoint — is a flat square: this design has no
// corner-radius differentiation, so there is deliberately no range-endpoint "pill"
// rounding.

export type CalendarPanelVariant = 'single' | 'multiple' | 'range';

/** Selected value, shaped by the active `variant`. */
export type CalendarPanelSelected = Date | Date[] | DateRange | undefined;

interface CalendarPanelCaptionContextValue {
  monthLabel: string;
  yearLabel: string;
  fromYear: number;
  toYear: number;
  formatMonthLabel: (date: Date) => string;
  endMonth: Date;
  numberOfMonths: number;
}

const CalendarPanelCaptionContext =
  React.createContext<CalendarPanelCaptionContextValue | null>(null);

/** One header dropdown (month or year) — an `InputSelect` over a fixed item list. */
function CalendarHeaderSelect({
  items,
  value,
  ariaLabel,
  onValueChange,
}: {
  items: CalendarSelectItem<number>[];
  value: number;
  ariaLabel: string;
  onValueChange: (next: number) => void;
}) {
  return (
    <InputSelect
      items={items}
      value={value}
      onValueChange={(next) => onValueChange(Number(next))}
    >
      <InputSelectTrigger aria-label={ariaLabel} className="min-w-0 flex-1">
        <InputSelectValue />
      </InputSelectTrigger>
      <InputSelectContent>
        {items.map((item) => (
          <InputSelectItem key={item.value} value={item.value}>
            {item.label}
          </InputSelectItem>
        ))}
      </InputSelectContent>
    </InputSelect>
  );
}
CalendarHeaderSelect.displayName = 'CalendarHeaderSelect';

/**
 * The header of one month column: a month `InputSelect` and a year `InputSelect`.
 * Replaces DayPicker's `MonthCaption`.
 */
function CalendarHeader({
  calendarMonth,
  displayIndex,
  className,
  ...props
}: MonthCaptionProps) {
  const { goToMonth } = useDayPicker();
  const context = React.useContext(CalendarPanelCaptionContext);
  if (!context) {
    throw new Error('CalendarHeader must be rendered inside <CalendarPanel>.');
  }
  const { monthLabel, yearLabel, fromYear, toYear, formatMonthLabel, endMonth, numberOfMonths } =
    context;

  const date = calendarMonth.date;
  const month = date.getMonth();
  const year = date.getFullYear();

  const monthItems = React.useMemo(
    () => buildMonthItems(formatMonthLabel),
    [formatMonthLabel]
  );

  const yearItems = React.useMemo(
    () => buildYearItems(fromYear, toYear),
    [fromYear, toYear]
  );

  return (
    <header
      className={cn(
        'flex items-center gap-[var(--ui-calendar-header-gap)] border-b-[length:var(--ui-calendar-header-border-width)] border-[color:var(--ui-calendar-header-border-color)] px-[var(--ui-calendar-header-padding-x)] py-[var(--ui-calendar-header-padding-y)] [border-bottom-style:var(--ui-calendar-header-border-style)]',
        className
      )}
      {...props}
    >
      <CalendarHeaderSelect
        items={monthItems}
        value={month}
        ariaLabel={monthLabel}
        onValueChange={(next) =>
          goToMonth(
            clampNavigationTarget(
              addMonths(new Date(year, next, 1), -displayIndex),
              endMonth,
              numberOfMonths
            )
          )
        }
      />
      <CalendarHeaderSelect
        items={yearItems}
        value={year}
        ariaLabel={yearLabel}
        onValueChange={(next) =>
          goToMonth(
            clampNavigationTarget(
              addMonths(new Date(next, month, 1), -displayIndex),
              endMonth,
              numberOfMonths
            )
          )
        }
      />
    </header>
  );
}
CalendarHeader.displayName = 'CalendarHeader';

/**
 * One day cell (Figma's "CalendarItem") — a flat 32×32 square. `data-active`
 * (a selected day or either range endpoint) and `data-range-middle` are mutually
 * exclusive, so their backgrounds never compete.
 */
function CalendarItem({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isRangeMiddle = Boolean(modifiers.range_middle);
  const isActive = Boolean(modifiers.selected) && !isRangeMiddle;

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-active={isActive}
      data-range-middle={isRangeMiddle}
      className={cn(
        'ui-calendar-value-text-style',
        'flex size-[var(--ui-calendar-item-width-min)] min-h-[var(--ui-calendar-item-height-min)] min-w-[var(--ui-calendar-item-width-min)] cursor-pointer items-center justify-center border border-[color:var(--ui-calendar-item-border-idle)] bg-[var(--ui-calendar-item-color-idle)] p-0 text-[var(--ui-calendar-value-color-idle-primary)] outline-none transition-colors [font-variant-numeric:var(--ui-calendar-value-font-variant-numeric)]',
        'not-data-[active=true]:hover:border-[color:var(--ui-calendar-item-border-hover)] not-data-[active=true]:hover:bg-[var(--ui-calendar-item-color-hover)]',
        'data-[range-middle=true]:bg-[var(--ui-calendar-item-color-hover)] data-[range-middle=true]:text-[var(--ui-calendar-value-color-idle-primary)]',
        'data-[active=true]:border-[color:var(--ui-calendar-item-border-active)] data-[active=true]:bg-[var(--ui-calendar-item-color-active)] data-[active=true]:text-[var(--ui-calendar-value-color-active)]',
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-[var(--ui-focus-primary)]',
        'disabled:pointer-events-none disabled:text-[var(--ui-calendar-value-color-disabled)]',
        className
      )}
      {...props}
    />
  );
}
CalendarItem.displayName = 'CalendarItem';

interface CalendarPanelSharedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'defaultValue'> {
  /**
   * Text direction. Forwarded to `DayPicker` explicitly — an ancestor's `dir`
   * mirrors the panel's CSS layout automatically (logical properties), but
   * `react-day-picker` only flips its Arrow Left/Right keyboard roaming when
   * `dir` is passed to it directly, so it must also be passed here.
   */
  dir?: 'ltr' | 'rtl';
  /** Uncontrolled initial month shown. */
  defaultMonth?: Date;
  /** Controlled month shown (the first month, for `range`). */
  month?: Date;
  /** Called when the displayed month changes (header dropdowns). */
  onMonthChange?: (month: Date) => void;
  /** Days that cannot be selected. */
  disabled?: Matcher | Matcher[];
  /** Minimum count (`multiple` / `range`; ignored for `single`): for `multiple`, the number of selected dates; for `range`, the number of nights between start and end. */
  min?: number;
  /** Maximum count (`multiple` / `range`; ignored for `single`): for `multiple`, the number of selected dates; for `range`, the number of nights between start and end. */
  max?: number;
  /** Render the leading/trailing days of the adjacent months. */
  showOutsideDays?: boolean;
  /**
   * First day of the week (0 = Sunday). Defaults to `locale`'s own week start,
   * falling back to Monday (per the design) when no `locale` is given.
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
   * Localizes weekday names and DayPicker's default day-cell/caption accessible
   * labels (e.g. `import { es } from 'react-day-picker/locale'`). Defaults to
   * date-fns `enUS`. Does not translate `monthLabel`/`yearLabel`/`cancelLabel`/
   * `applyLabel`/`formatMonthLabel` — those are separate props the consumer
   * must localize themselves.
   */
  locale?: DayPickerLocale;
  /** Accessible name of the month dropdown. */
  monthLabel?: string;
  /** Accessible name of the year dropdown. */
  yearLabel?: string;
  /** Formats a month's name for the month dropdown. Defaults to `locale`-aware `date-fns` formatting. */
  formatMonthLabel?: (date: Date) => string;
  /** Footer "Cancel" button label (`multiple` / `range`). */
  cancelLabel?: string;
  /** Footer "Apply" button label (`multiple` / `range`). */
  applyLabel?: string;
  /** Called when the footer's Cancel button is pressed. */
  onCancel?: () => void;
  /** Called when the footer's Apply button is pressed. */
  onApply?: () => void;
}

/** `variant="single"` (the default) — `selected` is a single optional `Date`. */
export interface CalendarPanelSingleProps extends CalendarPanelSharedProps {
  /** Selection mode + panel structure. `multiple`/`range` add the Cancel/Apply footer; `range` shows two months. */
  variant?: 'single';
  /** The selected date. Uncontrolled unless `onSelect` is provided. */
  selected?: Date;
  /** Called when the selection changes. Providing it makes `selected` controlled. */
  onSelect?: (selected: Date | undefined, triggerDate: Date) => void;
}

/** `variant="multiple"` — `selected` is a `Date[]`, and the footer is shown. */
export interface CalendarPanelMultipleProps extends CalendarPanelSharedProps {
  variant: 'multiple';
  selected?: Date[];
  onSelect?: (selected: Date[] | undefined, triggerDate: Date) => void;
}

/** `variant="range"` — `selected` is a `DateRange`, two months render, and the footer is shown. */
export interface CalendarPanelRangeProps extends CalendarPanelSharedProps {
  variant: 'range';
  selected?: DateRange;
  onSelect?: (selected: DateRange | undefined, triggerDate: Date) => void;
}

/**
 * `CalendarPanel`'s props, discriminated by `variant` — a `single` panel only
 * accepts a `Date`, `multiple` only a `Date[]`, `range` only a `DateRange`, so
 * mismatched `selected`/`onSelect` shapes are caught at the call site instead
 * of silently reaching `react-day-picker` with the wrong shape at runtime.
 */
export type CalendarPanelProps =
  | CalendarPanelSingleProps
  | CalendarPanelMultipleProps
  | CalendarPanelRangeProps;

const CalendarPanel = React.forwardRef<HTMLDivElement, CalendarPanelProps>(
  (
    {
      className,
      variant = 'single',
      selected,
      onSelect,
      defaultMonth,
      month,
      onMonthChange,
      disabled,
      min,
      max,
      showOutsideDays = true,
      weekStartsOn,
      fromYear,
      toYear,
      locale,
      monthLabel = 'Month',
      yearLabel = 'Year',
      formatMonthLabel,
      cancelLabel = 'Cancel',
      applyLabel = 'Apply',
      onCancel,
      onApply,
      dir,
      ...props
    },
    ref
  ) => {
    const currentYear = new Date().getFullYear();
    const { fromYear: resolvedFromYear, toYear: resolvedToYear } = resolveYearRange(
      fromYear,
      toYear,
      currentYear,
      DEFAULT_YEAR_SPAN
    );
    const resolvedWeekStartsOn = resolveWeekStartsOn(weekStartsOn, locale);
    const showFooter = variant !== 'single';
    const numberOfMonths = variant === 'range' ? 2 : 1;

    // Stable across renders when the consumer doesn't override `formatMonthLabel`,
    // so `captionContext` below doesn't get a new identity (and rebuild the month
    // dropdown items) on every render.
    const defaultFormatMonthLabel = React.useCallback(
      (date: Date) => format(date, 'MMMM', { locale }),
      [locale]
    );
    const resolvedFormatMonthLabel = formatMonthLabel ?? defaultFormatMonthLabel;

    // Bounds the header dropdowns' navigation to the same window their own
    // options list offers — without this, keyboard shortcuts (Shift+PageUp/
    // PageDown) and a controlled `month` can move the grid past `fromYear`/
    // `toYear` while the year dropdown still only lists that range.
    const startMonth = React.useMemo(() => new Date(resolvedFromYear, 0, 1), [resolvedFromYear]);
    const endMonth = React.useMemo(() => new Date(resolvedToYear, 11, 1), [resolvedToYear]);

    const captionContext = React.useMemo<CalendarPanelCaptionContextValue>(
      () => ({
        monthLabel,
        yearLabel,
        fromYear: resolvedFromYear,
        toYear: resolvedToYear,
        formatMonthLabel: resolvedFormatMonthLabel,
        endMonth,
        numberOfMonths,
      }),
      [
        monthLabel,
        yearLabel,
        resolvedFromYear,
        resolvedToYear,
        resolvedFormatMonthLabel,
        endMonth,
        numberOfMonths,
      ]
    );

    // `selected`/`onSelect` are already guaranteed consistent with `variant` by
    // the discriminated `CalendarPanelProps` union above — this is the one
    // place that bridges to `DayPickerProps`'s own (differently-shaped)
    // discriminated union.
    const modeProps = buildModeProps(
      variant,
      selected,
      onSelect as unknown as
        | ((selected: CalendarPanelSelected, triggerDate: Date) => void)
        | undefined,
      min,
      max
    );

    return (
      <div
        ref={ref}
        dir={dir}
        data-slot="calendar-panel"
        data-variant={variant}
        className={cn(
          'inline-flex w-fit flex-col overflow-hidden rounded-[var(--ui-calendar-container-border-radius)] border-[length:var(--ui-calendar-container-border-width)] border-[color:var(--ui-calendar-container-border-color)] bg-[var(--ui-calendar-container-color)] shadow-md [border-style:var(--ui-calendar-container-border-style)]',
          className
        )}
        {...props}
      >
        <CalendarPanelCaptionContext.Provider value={captionContext}>
          <DayPicker
            {...modeProps}
            dir={dir}
            defaultMonth={defaultMonth}
            month={month}
            onMonthChange={onMonthChange}
            disabled={disabled}
            startMonth={startMonth}
            endMonth={endMonth}
            showOutsideDays={showOutsideDays}
            weekStartsOn={resolvedWeekStartsOn}
            locale={locale}
            numberOfMonths={variant === 'range' ? 2 : 1}
            // The design navigates months through the header dropdowns only —
            // there are no prev/next chevrons.
            hideNavigation
            classNames={{
              root: 'flex',
              months: 'flex flex-row',
              // The vertical rule between the two `range` months is the first
              // column's inline-end border, so it mirrors under RTL.
              // Width = 7 day columns + 2 sides of body padding, derived from tokens
              // so it stays in sync if either is retokened.
              month:
                'flex w-[calc(var(--ui-calendar-item-width-min)*7+var(--ui-calendar-body-padding-x)*2)] flex-col border-e-[length:var(--ui-calendar-body-border-width)] border-[color:var(--ui-calendar-body-border-color)] last:border-e-0 [border-inline-end-style:var(--ui-calendar-body-border-style)]',
              // `table-fixed` (rather than the default `auto`) is what makes the
              // 32px-per-column contract above actually hold: under `auto`
              // layout a single wide weekday abbreviation (e.g. some `ar`/`te`/
              // `kn` locales) widens its whole column past the fixed 248px month
              // width, which the panel's `overflow-hidden` then clips — silently
              // dropping a day column instead of just the label.
              month_grid:
                'w-full table-fixed border-separate border-spacing-0 px-[var(--ui-calendar-body-padding-x)] py-[var(--ui-calendar-body-padding-y)]',
              weekday:
                'ui-calendar-value-text-style size-[var(--ui-calendar-item-width-min)] overflow-hidden whitespace-nowrap p-0 text-center font-normal text-[var(--ui-calendar-value-color-idle-secondary)]',
              day: 'group/day size-[var(--ui-calendar-item-width-min)] p-0 text-center',
              outside: '[&_button]:text-[var(--ui-calendar-value-color-disabled)]',
              disabled: '[&_button]:text-[var(--ui-calendar-value-color-disabled)]',
              hidden: 'invisible',
            }}
            components={{
              MonthCaption: CalendarHeader,
              DayButton: CalendarItem,
            }}
          />
        </CalendarPanelCaptionContext.Provider>
        {showFooter && (
          <DialogFooterDefault>
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button onClick={onApply}>{applyLabel}</Button>
          </DialogFooterDefault>
        )}
      </div>
    );
  }
);
CalendarPanel.displayName = 'CalendarPanel';

export { CalendarPanel, CalendarItem, CalendarHeader };
