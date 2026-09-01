---
'@acronis-platform/ui-react': patch
---

fix(chart-state): contain long error descriptions within the card

When `ChartState` renders `state="error"` with a long `description` (e.g.
CTI error paths, API URLs), the text no longer overflows the card
horizontally or vertically:

- The `<p>` element now has `overflow-wrap: break-word` + `max-width: 100%`,
  so unbroken strings wrap instead of pushing past the card edge while normal
  words stay intact at line breaks.
- The error content is wrapped in a `my-auto` div: auto margins center short
  messages within tall cards, but collapse to zero when the content overflows —
  so the warning icon and start of the message stay visible and scrollable from
  the top in small (KPI-sized) cards. `shrink-0` on the icon prevents flex
  from compressing it when the description is long.
- `overflow-y: auto` lets the user scroll through long diagnostic text;
  `overflow-x: hidden` prevents any horizontal scrollbar.
- Loading and empty states are unaffected — they keep centered alignment.
