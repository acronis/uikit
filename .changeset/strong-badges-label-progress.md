---
'@acronis-platform/ui-react': minor
---

feat(label,progress,badge): add Label and Progress components, alias Badge to Tag

- **Label** — a caption for a form control (native `<label>`, small
  medium-weight type, `peer-disabled:` dimming). Design-pending v1 ported from
  the legacy library; inherits `text-foreground` (no `--ui-label-*` tier yet).
- **Progress** — a determinate/indeterminate progress bar wrapping the Base UI
  Progress primitive. Design-pending v1; track uses `bg-input`, the indicator the
  brand blue (`bg-secondary`), with a sliding `indeterminate-progress` animation
  when `value` is `null`.
- **Badge** — re-exported as an alias of `Tag`. The generic legacy shadcn Badge
  is replaced by the design-system-native `Tag` (its own `--ui-tag-*` token tier,
  icon slot, and sizes); `import { Badge }` returns `Tag`.
