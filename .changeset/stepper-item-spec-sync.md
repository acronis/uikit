---
'@acronis-platform/ui-react': patch
---

docs(stepper-item): clarify typography overrides and align examples

The StepperItem label uses the generated typography tier. Ordinary Tailwind
typography utilities passed through `className` do not override it; use `style`
for an intentional one-off override. The canonical React example and generated
story fallback now match the avatar styling guidance.
