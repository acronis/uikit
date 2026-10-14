---
'@acronis-platform/icons-react': minor
---

Every icon now renders its kebab-case name as `data-icon` on the `<svg>` (for example `data-icon="chevron-down"`), so tests can tell icons apart. A `data-icon` passed by the consumer still wins.
