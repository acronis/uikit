import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
  type ClassNames,
  type CustomComponents,
} from 'react-day-picker';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `calendar`
// (packages/ui-legacy/src/components/ui/calendar.tsx). A pure day-grid built on
// `react-day-picker`'s `DayPicker` — single / range / multiple selection and one
// or more months side by side (`numberOfMonths`), with the prev/next chevrons at
// the outer edges of the month row. No `--ui-calendar-*` token tier exists yet, so
// this design-pending v1 themes off the shared semantic vocabulary:
//   • surface / text        -> bg-background / text-foreground
//   • selected day + range endpoints -> --ui-background-brand-primary + --ui-glyph-on-brand-primary
//   • range-middle highlight -> --ui-background-surface-hover (`bg-accent`)
//   • hover                 -> bg-accent / text-accent-foreground
//   • today                 -> font-weight + underline (no color dependency)
//   • outside-month / muted -> text-muted-foreground (--ui-text-on-surface-secondary)
//   • disabled days         -> --ui-text-on-surface-disabled
//   • focus ring            -> --ui-focus-primary
// Reconcile (and a possible `--ui-calendar-*` tier) with
// `/figma-component Calendar <url> --update` once mockups land.
//
// Why plain `<button>` for day cells AND nav chevrons (not `Button` / `ButtonIcon`):
//   • Day cells are a dense text grid, not icon buttons. `Button` is a fixed
//     32px-tall pill with a 64px min-width, per-variant px, and (for `ghost`) a
//     hover underline — none of which suit a square, borderless day cell. There
//     is no `size`/`square` key on `buttonVariants` to opt out of that geometry,
//     and adding one purely for the calendar would contort Button's API for a
//     one-off. `ButtonIcon` is icon-only and force-sizes its glyph to 24px
//     (`--ui-button-icon-global-icon-size`), so it cannot host day-number text.
//   • Nav chevrons look closest to `ButtonIcon` (ghost, 32px square) but adopting
//     it here is a net contortion: (1) `react-day-picker`'s Nav marks the edge
//     buttons with `aria-disabled`, while `ButtonIcon`'s disabled treatment +
//     `pointer-events-none` key off the `disabled` attribute — the disabled state
//     would never paint; (2) `ButtonIcon` force-sizes the glyph to 24px, but the
//     nav chevrons are 16px. Both would require overriding ButtonIcon internals,
//     so plain `<button>` with `aria-disabled:` variants is the honest fit until a
//     tokened `--ui-calendar-*` tier defines these controls.

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// The full `classNames` map, static aside from the one `captionLayout`-dependent
// branch (the boxed vs. dropdown caption treatment) and the per-key merge with
// `react-day-picker`'s own `getDefaultClassNames()`. Built once per render and
// merged with any caller `classNames` override at the call site.
function buildCalendarClassNames(
  captionLayout: CalendarProps['captionLayout'],
  defaultClassNames: ClassNames
): Partial<ClassNames> {
  return {
    root: cn('w-fit', defaultClassNames.root),
    months: cn(
      'relative flex flex-col gap-4 md:flex-row',
      defaultClassNames.months
    ),
    month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
    nav: cn(
      'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
      defaultClassNames.nav
    ),
    button_previous: cn(
      'inline-flex size-[var(--cell-size)] cursor-pointer select-none items-center justify-center rounded-md p-0 text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] aria-disabled:pointer-events-none aria-disabled:text-[var(--ui-text-on-surface-disabled)]',
      defaultClassNames.button_previous
    ),
    button_next: cn(
      'inline-flex size-[var(--cell-size)] cursor-pointer select-none items-center justify-center rounded-md p-0 text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] aria-disabled:pointer-events-none aria-disabled:text-[var(--ui-text-on-surface-disabled)]',
      defaultClassNames.button_next
    ),
    month_caption: cn(
      'flex h-[var(--cell-size)] w-full items-center justify-center px-[var(--cell-size)]',
      defaultClassNames.month_caption
    ),
    dropdowns: cn(
      'flex h-[var(--cell-size)] w-full items-center justify-center gap-1.5 text-sm font-medium',
      defaultClassNames.dropdowns
    ),
    dropdown_root: cn(
      'relative rounded-md border border-border has-focus:border-[var(--ui-border-on-surface-border-active)] has-focus:ring-[3px] has-focus:ring-[var(--ui-focus-primary)]',
      defaultClassNames.dropdown_root
    ),
    dropdown: cn(
      // The invisible native <select> overlays the whole `dropdown_root`
      // box, so its cursor drives the caption box's hover cursor — pointer,
      // to read as the interactive dropdown trigger it is (vs the plain,
      // non-clickable `caption_label` box in `captionLayout="label"`).
      'absolute inset-0 cursor-pointer bg-background opacity-0',
      defaultClassNames.dropdown
    ),
    caption_label: cn(
      'select-none font-medium',
      captionLayout === 'label'
        ? // Boxed caption (`[ July 2026 ]`) — reuses `dropdown_root`'s
          // border/rounded box treatment so the label and dropdown layouts
          // read as the same control.
          'rounded-md border border-border px-3 py-1 text-sm'
        : 'flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
      defaultClassNames.caption_label
    ),
    month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
    weekdays: cn('flex', defaultClassNames.weekdays),
    weekday: cn(
      'flex-1 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground',
      defaultClassNames.weekday
    ),
    week: cn('mt-2 flex w-full', defaultClassNames.week),
    week_number_header: cn(
      'w-[var(--cell-size)] select-none',
      defaultClassNames.week_number_header
    ),
    week_number: cn(
      'select-none text-[0.8rem] text-muted-foreground',
      defaultClassNames.week_number
    ),
    day: cn(
      // Logical (`-s-`/`-e-`) corner rounding so the range band's outer
      // corners flip sides under RTL along with the CSS-reversed grid.
      'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-s-md [&:last-child[data-selected=true]_button]:rounded-e-md',
      defaultClassNames.day
    ),
    range_start: cn('rounded-s-md', defaultClassNames.range_start),
    range_middle: cn('rounded-none bg-accent', defaultClassNames.range_middle),
    range_end: cn('rounded-e-md', defaultClassNames.range_end),
    today: cn(
      'rounded-md font-semibold underline data-[selected=true]:rounded-none data-[selected=true]:no-underline',
      defaultClassNames.today
    ),
    outside: cn(
      'text-muted-foreground aria-selected:text-muted-foreground',
      defaultClassNames.outside
    ),
    disabled: cn(
      'text-[var(--ui-text-on-surface-disabled)]',
      defaultClassNames.disabled
    ),
    hidden: cn('invisible', defaultClassNames.hidden),
  };
}

// The component-override map. Fully static (no prop/state dependency), so it lives
// at module scope and is merged with any caller `components` override at the call
// site. `Chevron`'s RTL flip keys off the `rtl:` variant, so it needs no props.
const calendarComponents: Partial<CustomComponents> = {
  Root: ({ className, rootRef, ...props }) => (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  ),
  Chevron: ({ className, orientation, ...props }) => {
    // Mirror the horizontal nav chevrons under RTL — `react-day-picker`
    // hardcodes orientation "left"/"right" for previous/next regardless of
    // direction, so we flip them ourselves. Applied on the icon we own via
    // the `rtl:` variant ([dir=rtl] ancestor), so it's robust to rdp's
    // internal class names. The vertical (dropdown) chevron never flips.
    if (orientation === 'left') {
      return (
        <ChevronLeftIcon
          size={16}
          className={cn('rtl:rotate-180', className)}
          {...props}
        />
      );
    }
    if (orientation === 'right') {
      return (
        <ChevronRightIcon
          size={16}
          className={cn('rtl:rotate-180', className)}
          {...props}
        />
      );
    }
    return <ChevronDownIcon size={16} className={cn(className)} {...props} />;
  },
  DayButton: CalendarDayButton,
  WeekNumber: ({ children, ...props }) => (
    <td {...props}>
      <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
        {children}
      </div>
    </td>
  ),
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  // Default the grid to a Monday week start (0=Sun..6=Sat); consumers can still
  // override per instance.
  weekStartsOn = 1,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={weekStartsOn}
      className={cn(
        'group/calendar bg-background p-3 [--cell-size:2rem] [[data-slot=popover-content]_&]:bg-transparent',
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        ...buildCalendarClassNames(captionLayout, defaultClassNames),
        ...classNames,
      }}
      components={{
        ...calendarComponents,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'flex aspect-square size-[var(--cell-size)] w-full min-w-[var(--cell-size)] cursor-pointer flex-col items-center justify-center gap-1 rounded-md p-0 font-normal leading-none text-foreground outline-none transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'data-[selected-single=true]:bg-[var(--ui-background-brand-primary)] data-[selected-single=true]:text-[var(--ui-glyph-on-brand-primary)] data-[selected-single=true]:hover:bg-[var(--ui-background-brand-primary-hover)]',
        'data-[range-start=true]:rounded-md data-[range-start=true]:bg-[var(--ui-background-brand-primary)] data-[range-start=true]:text-[var(--ui-glyph-on-brand-primary)] data-[range-start=true]:hover:bg-[var(--ui-background-brand-primary-hover)]',
        'data-[range-end=true]:rounded-md data-[range-end=true]:bg-[var(--ui-background-brand-primary)] data-[range-end=true]:text-[var(--ui-glyph-on-brand-primary)] data-[range-end=true]:hover:bg-[var(--ui-background-brand-primary-hover)]',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground',
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-[var(--ui-focus-primary)]',
        'disabled:pointer-events-none disabled:text-[var(--ui-text-on-surface-disabled)]',
        '[&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
