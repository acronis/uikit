// Curated prop surface for the docs `<AutoTypeTable>`. The runtime `CalendarProps`
// in calendar.tsx is `React.ComponentProps<typeof DayPicker>` — the full
// react-day-picker prop union, which expands to a huge, mode-discriminated table.
// This companion documents only the props callers reach for on this
// design-pending v1. (The runtime type lives in calendar.tsx; this file is never
// bundled.)

/** Props for `Calendar` — a day grid built on `react-day-picker`'s `DayPicker`. */
export interface CalendarProps {
  /** Selection mode. Defaults to `single`. */
  mode?: 'single' | 'multiple' | 'range';
  /** How many months to render side by side. Defaults to `1`. */
  numberOfMonths?: number;
  /** Show days from the previous/next month to fill the grid. Defaults to `true`. */
  showOutsideDays?: boolean;
  /** How the month/year caption is rendered. Defaults to `label`. */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  /** The controlled selection; shape depends on `mode` (`Date`, `Date[]`, or a `{ from, to }` range). */
  selected?: unknown;
  /** Called when the selection changes. */
  onSelect?: (selected: unknown) => void;
  /** Matcher (or array of matchers) for days that cannot be selected. */
  disabled?: unknown;
  /** The month rendered first (uncontrolled). */
  defaultMonth?: Date;
  /** Extra classes merged onto the calendar root. */
  className?: string;
}
