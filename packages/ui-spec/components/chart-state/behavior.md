# ChartState — behavior

## Rendering per state

- **Given** `state="loading"`, **when** rendered, **then** it shows the shared
  large `Spinner` and the default message "Data is loading…".
- **Given** `state="empty"`, **when** rendered, **then** it shows the neutral
  circle with the `CircleMinusGray` glyph and the default message "No data
  found".
- **Given** `state="warning"`, **when** rendered, **then** it shows the warning
  circle with the `TriangleWarningYellow` glyph and the default message "Data
  may be incomplete".
- **Given** `state="error"`, **when** rendered, **then** it shows the critical
  circle with the `DiamondWarningRed` glyph and the default message "Something
  went wrong".
- **Given** `state="number"`, **when** rendered, **then** it shows the centered
  disabled-style numeric value "0" without a state icon.
- **Given** empty, warning, or error, **when** rendered, **then** the group is
  centered and uses a 64px state circle, a 24px glyph, 12px separation, and
  centered 14px / 24px text.

## Copy

- **Given** a `description`, **when** rendered in any state, **then** the supplied
  content replaces that state's fallback message. Consumers provide localized
  or context-specific copy.

## Layout and overflow

- **Given** any state, **when** placed in a chart slot, **then** the block fills
  the slot without forcing a minimum height beyond its content.
- **Given** loading, empty, or warning, **when** rendered, **then** the content
  is centered in the slot.
- **Given** `state="error"` with a short message, **when** rendered, **then**
  the icon and message are vertically centered.
- **Given** an error with a long message, **when** it exceeds the slot height,
  **then** the icon remains fully visible, the state scrolls vertically, and
  unbroken strings wrap within the available width.

## Composition boundary

`ChartState` controls the state visuals inside one chart slot. It does not set
the chart-widget card border or arrange a group of widgets; those belong to
their respective component or consuming application.
