# ChartState — behavior

## Rendering per state

- **Given** `state="loading"`, **when** rendered, **then** it shows the shared
  `Spinner` (lg) above the label "Data is loading…" and announces the label via
  its `role="status"` live region (no `aria-busy`, which could defer that
  announcement).
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

## Per-type empty states

`empty` is the one state the design draws per chart type: an area silhouette for
an area chart, a ring for a donut, a funnel for a funnel. An empty widget then
still says what it _would_ have shown, which a single generic glyph can't.

`variant` selects it. `donut` and `radial` share one ring — a radial-bar widget
with no data has nothing to tell it apart. Without a `variant` the state falls
back to the generic inbox glyph, so an existing caller keeps working.

The geometry is exported from the Figma instances rather than redrawn, and every
path is `currentColor`: the tone is set once on the container, so brand and theme
overrides reach the artwork. Two of the eleven silhouettes use a second, fainter
tone (the table and metric-list ones tint their header row darker than the body
rows); that hierarchy is kept as `fill-opacity` on the same colour rather than a
second token.

The caption is **one line, in one style**. Figma styles it `body/default` on
`text/onSurface/primary` — 14/24, centred, _not_ muted — which is what the root
already applies, so the description and the fallback status label read
identically. For a per-type empty state that line is the `description`: the mockups draw the silhouette over "Widget description" with no
status label, because the artwork already says "no data" and the sentence worth
the space is what the widget _would_ show. With no `description` it falls back to
the status label, so a caller that only sets `variant` still reads sensibly.

`loading` and `error` deliberately keep one shared treatment — the design only
redesigned `empty`.

## Not `WidgetPlaceholder`

Two components, two jobs, and they are not interchangeable:

- **`ChartState`** is the placeholder _inside_ a chart's slot. It fills whatever
  gives the slot its height, renders one of three states, and is what a chart
  widget swaps in for its plot.
- **`WidgetPlaceholder`** is a composable skeleton with its own header, footer
  and action parts, plus an `interactive` affordance — for a dashboard widget
  that isn't a chart, or a whole tile that is still being set up.

`WidgetPlaceholder` predates the per-type empty states and is used by consuming
MFEs, so it stays.
