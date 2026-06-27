---
'@acronis-platform/ui-react': minor
---

feat(sheet): add the SheetDetails preset (sheet-detail-panel pattern)

`SheetDetails` is the "easy path that is the pattern" for the sheet-detail-panel
recipe: a right-anchored Sheet whose header (title + close), body, and optional
footer are driven by props. The body switches by `contentState` —
`loading` → Spinner, `empty`/`error` → Empty, else a key/value `properties` list
or custom children. Composes the existing `Sheet*` parts; reach for those
directly only for layouts the preset doesn't cover.
