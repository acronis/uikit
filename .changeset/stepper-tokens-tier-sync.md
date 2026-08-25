---
'@acronis-platform/ui-react': minor
---

feat(stepper): sync with the dedicated `--ui-stepper-*` token tier

Re-point `Stepper`/`StepperItem` at the dedicated `--ui-stepper-*` token tier shipped by `@acronis-platform/tokens-pd` (superseding the semantic-token placeholders used before that tier existed), add the current step's border, split its container padding into the design's asymmetric left/right values, and add a fourth `state="focus"` look for a completed step.

**Migrating:** consumers composing their own `Avatar` as a step's marker should now add `className="[box-shadow:none]"` to it — Avatar's default outset ring otherwise shows as an unwanted halo on a filled step container.
