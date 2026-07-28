---
'@acronis-platform/ui-react': patch
---

Fix `DialogWelcome`'s carousel layout not mirroring under `dir="rtl"`: the internal `Carousel`'s track/item spacing used physical Tailwind utilities (`-ml-4`, `pl-4`) instead of logical ones (`-ms-4`, `ps-4`), so slide gutters stayed on the same physical side regardless of direction. Also wire Embla's own `direction` option (distinct from `axis`) to the computed direction of the Carousel's root element — previously unset (defaulting to `'ltr'`), so drag direction and Previous/Next scroll targets could resolve backward relative to the now-mirrored track.
