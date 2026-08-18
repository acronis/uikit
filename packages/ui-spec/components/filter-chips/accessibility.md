# FilterChips — accessibility

## Roles and ARIA

- The **root** is a `role="group"` with an accessible name from `ariaLabel`
  (default `"Applied filters"`). This gives the region a landmark-like
  announcement so a screen-reader user can tell the applied-filter summary apart
  from the controls that produced it. Override `ariaLabel` to localize it or to
  name the specific data set ("Applied workload filters").
- The **list** is a plain container with no role. It is deliberately not a
  `list`/`listitem` structure: `Chip` renders a `<div>`, so imposing list
  semantics would require the consumer to wrap every chip in an `<li>`, and the
  chips are already individually announced through their remove buttons.
- Each **chip** is presentational apart from its remove button; that button
  carries its own accessible name via Chip's `removeLabel`. Always give it a name
  that identifies _which_ filter it removes ("Remove type filter") — a row of
  buttons all named "Remove" is ambiguous out of context.
- The **reset** action is a native `<button type="button">` whose accessible name
  is its visible label. It is not `aria-disabled`-only: when it is unavailable it
  is really `disabled`, so it leaves the tab order.

## Keyboard

- The row adds no keyboard behavior of its own: it is a sequence of native
  buttons in DOM order. `Tab` / `Shift+Tab` moves through each chip's remove
  button and then the reset action; `Enter` / `Space` activates the focused
  button.
- No arrow-key roving is implemented. The chips are independent controls rather
  than a single composite widget, so the sequential tab order is the expected
  pattern; adding roving focus would hide the remove buttons from users who
  navigate by `Tab` alone.
- Removing the last chip in the list moves focus out of the removed element.
  Consumers that clear filters one by one should move focus deliberately — to the
  reset action, or to the filter trigger once the row empties — so focus never
  lands on `<body>`.

## Screen reader

- Entering the region announces the group and its name, then each chip's label
  followed by its remove button's name.
- Removals and resets are not announced by the component. A consumer whose result
  set changes as a result should own that announcement (for example a live region
  reporting the new result count), because only the consumer knows what the
  filter change did.

## Focus visibility

- Focus indication comes from the composed parts: the chip shows the 3px
  `--ui-focus-primary` ring around the whole pill when its remove button takes
  focus (`focus-within`), and the reset button shows the same ring on
  `focus-visible`. The row itself is not focusable and draws no ring.

## Contrast

- The row contributes no colors, so contrast is Chip's and Button's
  responsibility. Both are verified in their own specs against WCAG 2.1 AA in
  light and dark themes.
- The reset action is a ghost button — a text-only control. Its idle label color
  (`--ui-button-ghost-label-color-idle`) must clear 4.5:1 against the surface the
  row sits on, which is Button's contract; do not place the row on a custom
  background that has not been checked against it.

## Right-to-left

- The row mirrors under `dir="rtl"` with no extra props: it uses logical flex
  ordering only, and it contains no directional artwork. The chip's × is
  direction-agnostic and must not be flipped.
