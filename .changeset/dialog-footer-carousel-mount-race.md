---
'@acronis-platform/ui-react': patch
---

Fix `DialogFooterCarousel` briefly rendering the wrong control (`Close` instead of `Next`, and zero position dots) on mount for every multi-slide `DialogWelcome`. `Carousel` now seeds its `slideCount`/`selectedIndex` context state from `initialSlideCount`/`opts.startIndex` instead of always starting at 0, so the footer's first render already reflects the real slide count instead of waiting for Embla's own effect to correct it a render later.
