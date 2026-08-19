---
'@acronis-platform/ui-react': minor
---

Add `Wizard`: the full-page wizard page template, from the Figma "RegionMain"
frame (node `10511-61418`).

Four composable parts — `Wizard` (full-height column), `WizardHeader` (the
sticky header band, on `--ui-background-surface-secondary` with a
`--ui-border-on-surface-divider` bottom rule, `--ui-gap-16` padding and a
`--ui-gap-12` inter-row gap), `WizardSubtitle` (optional muted supporting line)
and `WizardBody` (the step's content column, capped at 1024px).

It is a composition, not a new primitive: the breadcrumb, the title row
(`PageHeaderRow` / `PageHeaderTitle` / `PageHeaderActions`, reused from
`PageHeader`), the step indicator (`Stepper` + `StepperItem`) and the step
content (`Section`) are all existing components the consumer places as children.
`Wizard` owns layout and slots only — no step index, no navigation, and no
button wiring: which of Cancel / Back / Next / Submit shows on a given step is
the consuming UI block's decision, the same boundary `PageHeader` draws around
its own actions slot.
