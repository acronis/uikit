---
'@acronis-platform/ui-react': patch
---

Fix `ButtonMenu` missing a pointer cursor on hover. `cursor-pointer` now lives on the shared base class (matching `Button`), so the trigger shows `cursor: pointer` when hovered and reverts to the default cursor while disabled via `disabled:pointer-events-none`.
