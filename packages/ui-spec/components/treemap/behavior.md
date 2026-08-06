# Treemap — behavior

`Treemap` is a typed [recharts](https://recharts.org) composition over the shared
`Chart` primitives. It tiles a flat set of leaves into rectangles sized by
`dataKey` and colored per `nameKey`, inside a `ChartContainer`.

```gherkin
Scenario: Render cells from data and config
  Given data rows and a config mapping each leaf name to a label and color
  And dataKey "size" and nameKey "name"
  Then one rectangle renders per row, its area proportional to the dataKey value
  And each cell fills from its injected --color-<name> custom property
```

```gherkin
Scenario: On-cell labels
  Given showLabels is true
  Then each cell large enough shows its name at the tile's bottom-left corner
  And the name shown is the leaf's config label, falling back to its nameKey value
  But small cells omit the label to avoid overflow
  And when showLabels is false no labels render
```

```gherkin
Scenario: Tiles are separated by the surface, not a stroke
  Given any data
  Then each tile is inset inside its node's rectangle and its corners are rounded
  And the gap between neighbouring tiles is the chart's surface showing through
```

```gherkin
Scenario: Label alignment
  Given labelAlign is "top-left" or "center"
  Then the label block is anchored at the tile's top-left corner, or centered in it
  And what the alignment aligns is the block, not its first line
  And a corner-anchored block hugs the tile's start edge, so it mirrors under dir="rtl"
```

```gherkin
Scenario: A second label line
  Given secondaryKeys naming other fields on the row
  Then a second line renders under the leaf's name, one entry per field
  And the entries are joined by secondarySeparator
  And each entry is formatted by secondaryFormatter, which receives the field's index
  But a field that is missing or empty on a row is skipped rather than left as a gap
```

```gherkin
Scenario: Labels degrade with the tile
  Given a cell too short to hold two lines
  Then only the leaf's name renders
  And given a line wider than its cell
  Then that line is truncated with an ellipsis
  And given a cell below the size a label needs at all
  Then the cell renders no label
```

```gherkin
Scenario: Legend is opt-in
  Given showLegend is true
  Then one legend entry renders per distinct leaf name, labelled and colored from config
  And legendPos places it on the top or the bottom edge
  And it is laid out as a row beside the tiled surface, which gives up that height,
    so the legend never covers the tiles
  And it wraps onto further rows when its entries outgrow the chart's width
  But when showLegend is false no legend renders and no row is added
```

```gherkin
Scenario: Aspect ratio
  Given an aspectRatio
  Then the tiling targets that width-to-height ratio per cell
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a cell
  Then a card shows that leaf's name and value
```

```gherkin
Scenario: Empty data
  Given data is an empty array
  Then the chart renders no cells and does not throw
```

```gherkin
Scenario: Entrance animation is opt-in
  Given animate is unset
  Then the series render at their final geometry with no entrance animation
  And the committed visual baselines are unaffected
```

```gherkin
Scenario: Reduced motion
  Given animate is true
  And a user with prefers-reduced-motion
  Then the entrance animation does not play and the series render at their final geometry
  And the same applies when rendering on the server
```
