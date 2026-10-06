---
'@acronis-platform/ui-react': patch
---

- **@acronis-platform/ui-react**: fix grouped-header rows rendering a stray `border-b` between the group-label row and the leaf-header row
- **@acronis-platform/ui-react**: replace hand-rolled skeleton divs (using the near-invisible `--ui-background-surface-secondary`) with the `<Skeleton>` component (which uses `--ui-background-surface-active`)
