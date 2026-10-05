---
'@acronis-platform/ui-react': patch
---

- fix(table): removed `rounded-sm` from `TableActionsCell` and `TableSettingsCell` hover styles.
- fix(table): removed `[&:has([role=checkbox])]:pe-0` selector from `TableHead` and `TableCell`.
- fix(data-table): `__actions` column now sets `minSize: 48` and `maxSize: 48` alongside `size: 48`, preventing TanStack's resize logic from adjusting it.
- fix(data-table): select column default width changed from 32px to 48px to match `__actions` and the 48px touch-target budget.
