# Stepper — behavior

## Two layouts, chosen by the viewport

- **Given** a viewport **at or above 1024px**
  **Then** the `StepperItem` children render as a start-aligned row that wraps, and
  the compact summary is `display: none`.
- **Given** a viewport **below 1024px**
  **Then** the two-line text summary renders, and the item row is
  `display: none` — no step items are shown at all.
- **Given** any viewport
  **Then** _both_ subtrees are in the DOM. The switch is a CSS media query
  (Tailwind's `lg:`, i.e. `@media (min-width: 1024px)`), not a JS measurement,
  so nothing is mounted or unmounted as the window resizes and there is no
  hydration mismatch, no `ResizeObserver`, and no measuring pass.
- **Given** a viewport of exactly **1024px**
  **Then** the wide row renders. Figma names the variants `0-1024` and `>1025`,
  which makes 1024 itself ambiguous; the implementation follows the kit's pinned
  `lg` breakpoint (1024px = 64rem) rather than inventing a one-off `1025px`
  query, so the boundary sits one pixel lower than the Figma label suggests.
- **Given** a `dir="rtl"` document
  **Then** both layouts mirror without extra work: neither uses a physical
  directional utility.

## The compact summary

- **Given** `currentStep`, `totalSteps`, and `current`
  **Then** the first line reads "Step {currentStep} of {totalSteps}: {current}",
  with the generated prefix in the secondary surface text and the step's name in
  the primary surface text.
- **Given** a `next` step name
  **Then** a second line reads "Next: {next}", with the same two-tone treatment.
- **Given** no `next`
  **Then** the second line is **not rendered at all** — no empty paragraph, no
  dangling "Next:". This is how the last step in a sequence renders.
- **Given** `stepLabel`, `ofLabel`, `nextLabel`, or `separatorLabel`
  **Then** the corresponding generated string is replaced. The component ships
  English defaults and no other copy of its own, so a localized application
  overrides exactly these four. `separatorLabel` (default `": "`) is the
  punctuation joining the counter to the step name — a prop rather than an inlined
  literal because not every locale writes it that way.

## The wide row

- **Given** `children`
  **Then** they are laid out in a flex row, start-aligned, wrapping onto further
  lines when the sequence is too wide. Each wrapped line packs to the start
  (left in LTR) rather than centering independently, so a lone trailing item on
  the last line stays visually connected to the row above it instead of
  floating under the container's midpoint.
- **Given** more steps than fit
  **Then** the row wraps rather than scrolling or truncating; below the
  breakpoint the summary takes over instead.

## Not owned here

- The steps themselves — their number, order, labels, markers, and which one is
  `current` are the application's, passed as `StepperItem` children.
- Navigation: the component has no events. A completed step becomes clickable by
  composing that `StepperItem` with its own `render` prop.
- Keeping `currentStep` / `current` / `next` consistent with the children. The
  compact summary and the wide row are two renderings of the same state, but the
  component cannot inspect its children to derive one from the other — the
  caller supplies both.
