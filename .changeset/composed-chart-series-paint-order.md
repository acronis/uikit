---
'@acronis-platform/ui-react': patch
---

Fix `ComposedChart` so the paint order actually follows the `series` array. recharts 3 assigns graphical items to z-index layers keyed by mark type (area 100, bar 300, line 400), so an area listed after a bar was still painted underneath it, contradicting the documented "later entries sit on top". Each series now gets an explicit z-index from its position in `series`.
