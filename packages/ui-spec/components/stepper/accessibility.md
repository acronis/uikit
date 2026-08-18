# Stepper — accessibility

- **Only one layout is ever announced.** Both subtrees are in the DOM at all
  times, but the inactive one is `display: none`, which removes it from the
  accessibility tree. A screen-reader user below 1024px hears the text summary;
  above it, the step items. Nothing is duplicated. Do not "fix" this with
  `aria-hidden` — which layout is live is a CSS decision the component cannot
  observe, so any JS-set flag would be wrong half the time.
- **The compact summary is the accessible progress statement.** "Step 3 of 5:
  Choose a plan" is plain text in a `<p>`, so it is read verbatim, in order,
  with no ARIA required. That is deliberately the same sentence a sighted user
  reads.
- **The wide row is not itself a list.** The root is a plain `<div>` with no
  `role`. If the sequence should announce as an ordered list, or the current
  step as `aria-current="step"`, the application composes that on the
  `StepperItem` children — which are polymorphic via their own `render` prop.
- **No tab stops of its own.** The root and both layouts are non-interactive.
  Focusability comes only from whatever a `StepperItem` child is rendered as.
- **Ships three English strings** — `stepLabel`, `ofLabel`, `nextLabel` — and
  nothing else. They are props, so a localized application replaces them; the
  step names themselves are always consumer-supplied.
- **RTL**: the summary is a plain block flow and the row uses logical flex
  layout with a gap, so both mirror under `dir="rtl"` with no extra work and no
  physical directional utility to correct.

## Contrast

The generated prefix uses the secondary surface-text token and the step names
the primary one; both are semantic tokens carried over from `StepperItem`, so
contrast is inherited from the semantic scale and holds in light and dark.
Re-check it when the dedicated `--ui-stepper-*` tier ships (see `tokens.yaml`),
since a brand may then define distinct values — the secondary/prefix pairing is
the one to watch, as it is the lowest-contrast text the component renders.
