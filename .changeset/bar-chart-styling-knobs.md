---
'@acronis-platform/ui-react': minor
---

Add the bar-styling knobs to `BarChart`.

**Highlighting a range.** `referenceArea` shades a range of categories (a forecast period, a quarter under review) accents the category ticks beneath it, and optionally marks its leading edge with a dashed `divider`; `barSettings` restyles one series over the same kind of range — `fill`, `opacity`, `dashed`, `shape`, and a per-bar track via `background` (`true` for the full plot height, or a data field name to cap it at that row's value — the headroom between a projection and its upper bound). Both address the range as `{ from, to }`, inclusive, taking either the category's own value or its 0-based row index, with an omitted bound running to that end of the data. Together they make a projection read as provisional — translucent, dashed, over its own track, inside the band — while the rest of the grouped or stacked chart is untouched.

**Painting.** `barShape` adds `pill`, `gradient` and `pattern` alongside the default `rounded`; a `barSettings` entry can override it for its range, so hatching can set a projection apart without relying on color.

**Sizing and chrome.** `barSize`, `maxBarSize`, `barGap`, `barCategoryGap` and `minPointSize` forward to recharts; `showBackground` / `backgroundFill` draw a full-height track behind every bar; `showActiveBar` / `activeBar` highlight the bar under the pointer.

**Legend order.** `BarChart` legend entries now follow the `dataKeys` order instead of the chart library's default alphabetical sort by series name. Charts whose `dataKeys` were already alphabetical are unaffected.
