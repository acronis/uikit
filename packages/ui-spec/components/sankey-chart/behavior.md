# SankeyChart — behavior

`SankeyChart` is a typed [recharts](https://recharts.org) composition over the
shared `Chart` primitives. It renders a flow diagram from a `nodes` + `links`
graph inside a `ChartContainer`.

```gherkin
Scenario: Render nodes and links from data and config
  Given a graph with nodes (each a CSS-safe name) and links (source/target indices + value)
  And a config mapping each node name to a label and color
  Then one bar renders per node, filled from its --color-<name> custom property
  And one ribbon renders per link, its width proportional to the link value
```

```gherkin
Scenario: Link ribbon color
  Given a link with no explicit color
  Then its ribbon is stroked in the target node's color at 35% opacity
  Given a link with an explicit color
  Then its ribbon is stroked in that color at full opacity (matching its node bar)
```

```gherkin
Scenario: Node labels
  Given showLabels is true
  Then each node shows its config label — to the right for nodes with outgoing
    links, to the left for terminal (sink) nodes
  And when showLabels is false no node labels render (e.g. an external legend names them)
```

```gherkin
Scenario: Legend
  Given showLegend is true
  Then a legend renders below the chart with a color dot + label per node
  And each node's value (incoming flow, or outgoing for a source) plus its share
    of the largest node as a percentage
```

```gherkin
Scenario: Node order
  Given sort is false (the default)
  Then nodes render in the order given by data.nodes within each column
  Given sort is true
  Then recharts reorders nodes vertically to minimize link crossings
```

```gherkin
Scenario: Geometry
  Given nodePadding, nodeWidth, and linkCurvature
  Then nodes are spaced/sized accordingly and ribbons curve by that amount
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a node or link
  Then a card shows a color dot matching the ribbon (its link color + opacity),
    the source → target labels, and the value
```

```gherkin
Scenario: Minimal graph
  Given a two-node, single-link graph
  Then the chart renders one ribbon and does not throw
```
