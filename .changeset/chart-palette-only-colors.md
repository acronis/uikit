---
'@acronis-platform/ui-react': major
---

feat(chart)!: series colours come from the palette, and only from the palette

**Breaking.** `ChartConfig` no longer accepts a free-form `color` or a
`theme: { light, dark }` pair. A chart's **series** cannot paint a hue the
design system doesn't define.

Note: certain chart types (`FunnelChart` `stageSettings[].color`, `PieChart`
per-slice `color`, `ComposedChart` per-bar `color`, `SankeyChart`
`data.links[].color`) still expose per-element free-form color overrides
outside of `ChartConfig`. Those are intentional escape hatches for edge cases
like custom gradient ramps or explicit link tints; they are not controlled by
`palette` and are not part of this breaking change.

`ChartContainer`'s `palette` now defaults to `{ type: 'categorical' }` — there
is no "no palette" state. Series walk the chosen palette in its defined order.

Migrating: **delete the `color` from each `config` entry.** Most charts used
those tokens as "some distinct colour per series", which is exactly what the
default categorical palette does — so deleting is usually the whole migration.

```diff
  const config = {
-   desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
-   mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
+   desktop: { label: 'Desktop' },
+   mobile: { label: 'Mobile' },
  } satisfies ChartConfig;
```

Where the colour carried meaning, pick the palette and name the tone:

```diff
- const config = {
-   failed: { label: 'Failed', color: 'var(--ui-background-status-strong-danger)' },
- } satisfies ChartConfig;
+ const config = {
+   failed: { label: 'Failed', tone: { status: 'danger' } },
+ } satisfies ChartConfig;
  …
- <BarChart config={config} … />
+ <BarChart config={config} palette={{ type: 'status' }} … />
```

Other `tone` forms: `{ slot: 7 }` picks another categorical hue, and
`{ sameAs: 'actual' }` paints whatever another series paints — for a twin
series (a forecast tail, a projection band) that must not read as a second
metric. An aliased series doesn't consume a palette stop.

**Watch out for entries you don't plot.** A stop is assigned by an entry's
position in `config`, not by which series get drawn, so a config declaring a
series the chart doesn't render still consumes a colour and shifts the ones
that follow. That is deliberate — a series keeps its colour when a sibling is
toggled off — but it means each config should declare exactly what its chart
plots.

Also in this change:

- `CategoryBar` gains the same `palette` prop. It paints plain elements rather
  than a recharts plot, so it resolves the palette itself.
- `ChartStyle` emits one CSS block instead of a light/dark pair: every palette
  colour is a `light-dark()` token that follows `color-scheme` on its own.
- New exported type `ResolvedChartConfig` — a `ChartConfig` with every colour
  filled in, which is what `ChartStyle` takes and what the context carries.
- Every chart's Storybook meta exposes a `palette` select, so the palettes can
  be compared on a real chart from the Controls panel.
