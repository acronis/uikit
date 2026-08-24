---
'@acronis-platform/ui-react': patch
---

Re-point `Stepper`/`StepperItem` at the dedicated `--ui-stepper-*` token tier shipped by `@acronis-platform/tokens-pd` (superseding the semantic-token placeholders used before that tier existed), add the current step's border, split its container padding into the design's asymmetric left/right values, and add a fourth `state="focus"` look for a completed step.
