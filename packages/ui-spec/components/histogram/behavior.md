# Histogram — behavior

`Histogram` bins a set of continuous samples (`values`) into equal-width ranges
and renders their frequencies as contiguous bars, built on the shared `Chart`
primitives.

```gherkin
Scenario: Bin and render a distribution
  Given values and a binCount
  Then the [min, max] range is split into binCount equal-width bins
  And each bar's height is the number of samples in that bin
  And the bars are contiguous (no category gap), reading as a distribution
```

```gherkin
Scenario: Max value placement
  Given a sample equal to the range maximum
  Then it falls in the last bin (whose upper edge is inclusive), not dropped
```

```gherkin
Scenario: Explicit domain
  Given a domain [lo, hi]
  Then bins span [lo, hi] instead of the data's own min/max
  And samples outside [lo, hi] are dropped
```

```gherkin
Scenario: Degenerate range
  Given all values are equal (a zero-width range)
  Then the range is widened so a single bin still has extent and counts them
```

```gherkin
Scenario: Non-finite samples
  Given values containing NaN / Infinity
  Then those are ignored and only finite samples are binned
```

```gherkin
Scenario: Tooltip on hover
  Given showTooltip is true
  When the user hovers a bar
  Then a card shows the bin range label and its count
```

```gherkin
Scenario: Empty data
  Given values is empty (or has no finite samples)
  Then no bars render and the chart does not throw
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
