---
'@acronis-platform/ui-react': minor
---

feat(charts): add rich cell labels and a legend to Treemap

`Treemap` labelled each cell with its leaf key, centered, on one line, and had no
legend at all. It now carries the label block the design asks for, plus the legend
for the tiles too small to hold one.

**Labels.** The block is anchored at the tile's bottom start corner, per the design;
`labelAlign` moves it to the top start corner or centers it (the previous look). Its
values are named for the start edge rather than a physical corner because they
mirror under `dir="rtl"`. The
name shown is the leaf's `config` **label** rather than its raw `nameKey` value:
that value becomes part of a `--color-<name>` custom property, so it has to be
CSS-safe, and a leaf whose display name has a space in it is keyed by a slug — the
slug is not what belongs on the tile. `secondaryKeys` adds a second line built from
any other fields on the row — a value, a count, or both — joined by
`secondarySeparator` and formatted by `secondaryFormatter`, which receives each
field's index so one formatter can cover fields of different kinds. A field a row
doesn't carry — or that the formatter returns empty for — is skipped instead of
leaving a dangling separator.

Both lines degrade with the tile: a cell too short for two lines keeps just its
name, each line truncates with an ellipsis, and a tile too small for a label at all
is left blank. The thresholds are measured in rendered line boxes rather than font
sizes, so a label is never drawn into a tile that would clip it. The title is set in the chart label size at semibold and the second
line one step down, so the hierarchy is weight and size rather than a second color,
which the on-strong secondary text token can't provide (it resolves to a dark grey
in dark mode, over a fill that stays saturated).

The block is HTML inside a `foreignObject` rather than SVG `<text>`, which is what
lets it behave like every other label in the kit: `truncate` measures the text
instead of estimating it, and `text-start` mirrors the block under `dir="rtl"` —
SVG's `x`/`text-anchor` are physical, so the same label would otherwise need the
direction read in JS and applied by hand.

**Cell shape.** Each tile is inset inside its node's rectangle with rounded
corners, so tiles are separated by the surface showing through instead of by the
surface-colored stroke they used to carry.

**Legend.** `showLegend` renders one entry per distinct leaf name — labelled,
colored and marked like every other chart's legend, because it goes through the
shared `ChartLegendContent` — and `legendPos` picks its edge. Two things had to be
worked around. The renderer builds no legend payload for a treemap (unlike
bar/line/area/pie/radar), so the component synthesizes one from its leaves. And a
treemap tiles its _whole_ surface rather than a plot area, so a legend drawn inside
the plot paints over the tiles: it is rendered as a row of its own beside the chart
instead, where normal flow gives it the height it needs and takes that height off
the tiled surface. That placement also keeps the tiling correct — a treemap reads
its container's size exactly once, and a recharts `<Legend>` can only render after
the chart has a size, so the box it read would always be the one from before its own
legend existed and the bottom row of tiles would be laid out under the clip.

**Shared legend.** Two changes to `ChartLegendContent`, both needed by the above and
useful beyond it:

- it wraps instead of overflowing — a legend with one entry per tile or per slice is
  wider than the chart on a narrow surface, and a row that can't wrap paints past
  the chart's edge. The column gap is unchanged, so every legend that already fits
  on one row keeps its exact layout.
- it accepts the series `config` as a prop, so it can render outside its
  `ChartContainer` (where the context doesn't reach). Charts that keep their legend
  inside the plot pass nothing and still read the context; rendering it with neither
  a prop nor a container still throws, as it always did.
- an entry with no `config` label falls back to the series key, the way the tooltip
  row already did, instead of rendering a marker with no text.

Existing treemaps keep their behavior except for the label placement, the tile
shape, and cells now showing their config label; the legend is off by default.
