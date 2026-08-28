---
'@acronis-platform/ui-react': minor
---

feat(charts): reverse sequential ramp order, interleave diverging stops, add per-series side override

Sequential ramps now run darkest-to-lightest (stop 8 first): the most prominent series gets the most saturated colour rather than the palest.

Diverging palettes now interleave their stops (`a3-b3-a2-b2-a1-b1`) instead of sequencing one hue then the other. Adjacent series in a multi-series diverging chart now come from opposite hues, maximising contrast between neighbours.

A new `side` discriminant on `ChartSeriesTone` (and new `ChartDivergingSide` export) lets a series under a diverging palette pin itself to the "a" or "b" hue family. `resolveChartColors` does a two-pass assign: sided series walk their side's three stops strongest-first (wrapping past three), then un-sided series walk the remaining interleaved stops. `listPaletteChoices` returns `[{ side: 'a' }, { side: 'b' }]` for diverging palettes so widget editors can surface the new control.
