# Calendar — behavior

Design-pending v1 ported from `@acronis-platform/shadcn-uikit`'s `calendar`.
Behavior is provided by `react-day-picker`'s `DayPicker`; this component only
re-themes the grid.

## Single selection

- **Given** `mode="single"`, **when** the user clicks a day, **then** `onSelect`
  fires with that `Date` and the day paints the brand fill
  (`--ui-background-brand-primary` / `--ui-glyph-on-brand-primary`).
- **Given** a selected day, **when** the user clicks it again, **then** the
  selection clears (`onSelect` fires with `undefined`).

## Range selection

- **Given** `mode="range"`, **when** the user clicks a first day, **then**
  `onSelect` fires with `{ from }` and that day becomes the range start.
- **When** the user clicks a second day, **then** `onSelect` fires with
  `{ from, to }`; the start and end days paint the brand fill and the days between
  them get the range-middle band (`--ui-background-surface-hover`).

## Multiple months

- **Given** `numberOfMonths={2}`, **then** two month grids render side by side and
  a single previous / next button pair sits at the outer edges of the row (not one
  pair per month). Clicking next advances **both** months.

## Navigation

- **When** the user clicks the previous / next button, **then** the displayed
  month(s) shift by one. A nav button at the edge of the allowed range is disabled
  and paints `--ui-text-on-surface-disabled`.

## Disabled days

- **Given** a `disabled` matcher, **then** matched days are non-interactive
  (`disabled` attribute) and paint `--ui-text-on-surface-disabled`; clicking them
  does not fire `onSelect`.

## Today & outside days

- The current day is decorated with a bold, underlined label (no color
  dependency); the underline is dropped when the day is also selected.
- With `showOutsideDays` (default), leading/trailing days from the adjacent months
  fill the grid and render in `--ui-text-on-surface-secondary`.
