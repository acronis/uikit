---
'@acronis-platform/ui-react': minor
---

feat(description-list): add DescriptionList — key/value data list

A composable, semantic `<dl>` for key/value data: rows of label → value, where
the value can be plain text, a status (leading icon + value + a muted
description), or action links. Parts: `DescriptionList`, `DescriptionListItem`,
`DescriptionListLabel`, `DescriptionListValue`, `DescriptionListValueDescription`,
`DescriptionListActions`. Built from the Cyber-Compliance "Service status" design
(Figma node 3001-20448, COMPLETE Code Connect); composes the shared semantic
tokens — no new tier. `SheetDetails` and the `sheet-detail-panel` pattern now
render their property list through it instead of an ad-hoc grid.
