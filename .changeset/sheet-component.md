---
'@acronis-platform/ui-react': minor
---

feat(sheet): add Sheet (modal side panel) + Details alias

A modal side panel anchored to a screen edge, built on the Base UI Dialog
primitive (the same one `Dialog` uses) with a slide transition. Composable parts:
`Sheet`, `SheetTrigger`, `SheetContent` (with a `side` prop — `top`/`right`/
`bottom`/`left`, default `right`), `SheetHeader`, `SheetTitle`, `SheetCloseButton`,
`SheetBody`, `SheetDescription`, `SheetFooter`, `SheetClose`. Design-pending v1
ported from the legacy library; themed on the shared semantic tokens like the
Dialog family (no `--ui-sheet-*` tier yet).

The Vue UI kit called this `Details`, so the full part family is also re-exported
under `Details*` aliases (`Details`, `DetailsContent`, …) for a 1:1 migration.
