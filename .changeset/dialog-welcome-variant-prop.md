---
'@acronis-platform/ui-react': minor
---

Add an optional `variant?: 'carousel' | 'single'` prop to `DialogWelcome`, matching its real Figma component property (previously omitted — the layout was derived purely from `<DialogWelcomeSlide>` child count). When passed, it overrides the count-derived default: `variant="carousel"` keeps the carousel chrome for a single slide, and `variant="single"` forces the single layout, dropping any slides beyond the first. Omitting `variant` keeps the existing count-derived behavior unchanged.
