---
'@acronis-platform/ui-react': patch
---

`StepperItem` now references its dedicated container-color tokens for the
`completed` variant's `idle` state and for the `future` variant, instead of
implicitly rendering no background. `completed`/`idle` gets a
`compoundVariants` entry wired to
`--ui-stepper-item-completed-container-color-idle`, and `future` picks up
`--ui-stepper-item-future-container-color`.

No visual change in the shipped brands — both tokens currently resolve to
`transparent` — but a brand that overrides either one is now honored, matching
the convention that every variant/state combination is wired to its own token.
