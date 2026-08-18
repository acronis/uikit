---
'@acronis-platform/ui-react': minor
---

Add `StepperItem`: one step in a stepper — a consumer-composed `Avatar` marker
plus the step name, with a `variant` for the step's role in the sequence
(`current` / `completed` / `future`), a `state` for the interaction look (only
meaningful on a completed step), an optional trailing `connectingLine`, and Base
UI `render`-prop composition so a completed step can be a real `<button>`.

The Figma component set has no `--ui-stepper-item-*` token tier yet, so this
consumes the semantic/generic tokens whose resolved values match the design
variables exactly (documented in the component source and its ui-spec
`tokens.yaml`); re-point them once the dedicated tier ships.
