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
  /** Minimum number of days selectable in `multiple` / `range` mode. */
  min?: number;
  /** Maximum number of days selectable in `multiple` / `range` mode. */
  max?: number;
  /** Matcher (or array of matchers) for days that cannot be selected. */
  disabled?: unknown;
  /** The month rendered first (uncontrolled). */
  defaultMonth?: Date;
  /** Earliest navigable month — disables the previous chevron at the edge. */
  startMonth?: Date;
  /** Latest navigable month — disables the next chevron at the edge. */
  endMonth?: Date;
  /** First day of the week (0 = Sunday … 6 = Saturday). Defaults to `1` (Monday). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Overrides for `react-day-picker`'s internal components (e.g. `DayButton`). */
  components?: unknown;
  /** Extra classes merged onto the calendar root. */
  className?: string;
}
