---
'@acronis-platform/tokens-pd': minor
---

Add semantic color utility classes from PLTFRM-94106: `.ui-text-*`/`.ui-bg-*`/`.ui-border-*`, one class per existing `--ui-text-*`/`--ui-background-*`/`--ui-border-*` custom property (129 total), full path with no truncation (e.g. `--ui-text-on-surface-link-idle` → `.ui-text-on-surface-link-idle`), mechanically generated from the resolved token stream rather than a hand-picked list.
