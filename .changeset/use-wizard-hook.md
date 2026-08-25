---
'@acronis-platform/ui-react': minor
---

Add `useWizard`: an opt-in headless hook that owns a wizard's step index so a
consumer no longer hand-maintains one `StepperItem` block per step.

Given `steps` (`{ id, label }`, plus any extra fields of your own, which survive
on the derived step) and an optional `initialStep` seed (a zero-based index,
clamped, or a step `id`), it returns the `Stepper` summary props
(`currentStepNumber` / `stepCount` / `currentStepLabel` / `nextStepLabel` —
`undefined` on the last step, so the "Next: …" line is dropped rather than
rendered empty), a derived `steps` array carrying each step's `variant` and
`Avatar` colour/classes, `isFirstStep` / `isLastStep`, and
`goToNextStep` / `goToPreviousStep` / `goToStep` (neither boundary wraps; an
unknown `id` is a no-op).

Purely additive: `Wizard`, `Stepper` and `StepperItem` are unchanged and still
own no state, so a consumer already driving them by hand keeps working.
