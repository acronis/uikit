---
'@acronis-platform/ui-react': minor
---

Add `StepperItem`: one step in a stepper — a consumer-composed `Avatar` marker
plus the step name, with a `variant` for the step's role in the sequence
(`current` / `completed` / `future`), a `state` for the interaction look (only
meaningful on a completed step), and Base UI `render`-prop composition so a
completed step can be a real `<button>` — which then carries the library's
standard 3px `--ui-focus-primary` focus ring. A future step is `aria-disabled`,
takes no pointer events, and is removed from the tab order, and on the default
`<div>` it gets an explicit `role="link"` so `aria-disabled` is actually
announced.

The Figma component set has no `--ui-stepper-item-*` token tier yet, so this
consumes the semantic/generic tokens whose resolved values match the design
variables exactly (documented in the component source and its ui-spec
`tokens.yaml`); re-point them once the dedicated tier ships.
