# Calendar — accessibility

Accessibility is provided by `react-day-picker`, which follows the ARIA
[grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) for the day grid.

## Roles & structure

- The root is a calendar application region; each month renders as a
  `<table role="grid">` with column headers for the weekdays.
- Each day is a `<button>` inside a grid cell. Selected days expose
  `aria-selected`; disabled days set the `disabled` attribute.
- The previous / next controls are labelled buttons; a control that would move
  past the allowed range is `aria-disabled`.

## Keyboard

| Key                   | Action                                          |
| --------------------- | ----------------------------------------------- |
| `Arrow Left/Right`    | Move focus to the previous / next day           |
| `Arrow Up/Down`       | Move focus to the same weekday of the adj. week |
| `Home` / `End`        | First / last day of the week                    |
| `PageUp` / `PageDown` | Previous / next month                           |
| `Shift+PageUp/Down`   | Previous / next year                            |
| `Enter` / `Space`     | Select the focused day                          |

Roving focus: only the active day is in the tab order; arrow keys move focus and
auto-advance the visible month when crossing a boundary.

## Focus

- The focused day shows a 3px `--ui-focus-primary` ring, raised above its
  neighbours (`z-10`) so the ring is never clipped by an adjacent selected fill.

## Contrast

- Selected days pair `--ui-background-brand-primary` with
  `--ui-glyph-on-brand-primary`; idle days use `text-foreground` on the calendar
  surface. Outside/disabled days use the secondary/disabled text tokens, which are
  intentionally lower-emphasis but remain within the palette's contrast budget.
