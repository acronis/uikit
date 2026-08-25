---
'@acronis-platform/ui-react': patch
---

fix(stepper-item): reserve the container border box on every variant

`StepperItem` only declared a border on its `current` variant, so — the
container being an inline-flex box with auto width/height — the current step
rendered ~2px larger than its `completed`/`future` siblings and pushed the row's
avatars and labels out of alignment. The border width is now reserved on the
shared base class with a transparent color (the same shape `Tag` uses), and
`current` only overrides the border color. No token or public API change.
