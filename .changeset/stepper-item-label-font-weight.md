---
'@acronis-platform/ui-react': patch
---

fix(stepper-item): apply the tier's generated text-style class to the step label

`StepperItem` hand-transcribed part of its
`.ui-stepper-item-global-container-text-style` tier into utilities (`text-sm
leading-6`) and dropped the tier's `font-weight: 500`, so the step name rendered
at the inherited default weight of 400 — visibly lighter than the design. The
base class now applies the generated class by name instead, the way `Alert`,
`InputOTP`, and the sidebars apply theirs, so the family, size, weight,
line-height, and letter-spacing all follow the tier and cannot drift out of it.
