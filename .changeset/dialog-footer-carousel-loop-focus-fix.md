---
'@acronis-platform/ui-react': patch
---

Fix `DialogFooterCarousel`: derive its first/middle/last state from the ambient Carousel's `selectedIndex`/`slideCount` instead of Embla's `canScrollPrev`/`canScrollNext`, which stay permanently `true` (and previously hid the Close button forever) when the Carousel is configured with `opts={{ loop: true }}`. Also: when Back unmounts (first slide) or the Next/Close swap happens (last slide) while the outgoing control holds keyboard focus, focus now moves onto the control left standing instead of dropping to `document.body`; each position dot now has its own accessible name, localizable via the new `dotAriaLabel` prop (default `` `Slide ${index} of ${count}` ``).
