# ChartState — behavior

## Rendering per state

- **Given** `state="loading"`, **when** rendered, **then** it shows the shared
  `Spinner` (lg) above the label "Data is loading…" and marks the region
  `aria-busy`.
- **Given** `state="empty"`, **when** rendered, **then** it shows the inbox glyph
  above the label "No data found".
- **Given** `state="error"`, **when** rendered, **then** it shows the warning
  glyph above the label "Something went wrong" and announces as an alert.

## Label override

- **Given** a `message` prop, **when** rendered in any state, **then** the
  supplied text replaces that state's default label.

## Action

- **Given** an `action` node, **when** `state="error"`, **then** the action is
  rendered after the label (e.g. a "Try again" button).
- **Given** an `action` node, **when** `state` is `loading` or `empty`, **then**
  the action is **not** rendered.

## Layout

- **Given** any state, **when** placed in a sized slot (the same box a chart
  would occupy), **then** the block fills it (`size-full`) and centers its
  content, with a `min-h-32` floor so it stays legible in an unsized parent.
