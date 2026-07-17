---
'@acronis-platform/ui-react': patch
---

Migrate Dialog and Sheet off the removed `--ui-background-overlay-primary` token. Dialog's overlay now uses `--ui-background-backdrop-screen`; Sheet no longer renders a backdrop by default (sheets open on top of the page), though the `SheetOverlay` / `DetailsOverlay` export is retained for drop-in compatibility.
