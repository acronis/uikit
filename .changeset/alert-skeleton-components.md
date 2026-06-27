---
'@acronis-platform/ui-react': minor
---

feat(alert,skeleton): add Alert and Skeleton (ported from ui-legacy)

- **Alert** — a status banner (`role="alert"`) with seven severity variants
  (info / success / warning / critical / destructive / ai / neutral) and
  composable `AlertIcon` / `AlertContent` / `AlertTitle` / `AlertDescription`
  parts. Each variant maps to the `--ui-*` status tokens.
- **Skeleton** — a pulsing placeholder box for loading states; shape/size via
  className.

Design reconciliation pending.
