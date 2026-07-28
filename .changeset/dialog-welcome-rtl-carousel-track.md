---
'@acronis-platform/ui-react': patch
---

Fix `DialogWelcome`'s carousel layout not mirroring under `dir="rtl"`: the internal `Carousel`'s track/item spacing used physical Tailwind utilities (`-ml-4`, `pl-4`) instead of logical ones (`-ms-4`, `ps-4`), so slide gutters stayed on the same physical side regardless of direction.
