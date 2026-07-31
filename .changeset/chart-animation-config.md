---
'@acronis-platform/ui-react': minor
---

Add opt-in entrance animation to every chart component via shared `animate` / `animationDuration` / `animationBegin` / `animationEasing` props (a `resolveAnimation` helper over the shared chart utils). Off by default, so unset charts render identically. `animate` maps to recharts' `isAnimationActive="auto"` rather than a literal `true`, so the animation honors `prefers-reduced-motion` and is skipped during SSR.
