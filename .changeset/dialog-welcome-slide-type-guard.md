---
'@acronis-platform/ui-react': patch
---

Fix `DialogWelcome` counting every truthy child as a slide with no type guard: a non-`DialogWelcomeSlide` child was counted, and zero real slides fell through to rendering `slides[0]` (`undefined`) as the single-layout body. `children` is now filtered to elements whose type is `DialogWelcomeSlide` before counting/slicing, and zero real slides now renders nothing.
