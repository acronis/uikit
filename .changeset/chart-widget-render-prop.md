---
'@acronis-platform/ui-react': patch
---

fix(chart-widget): expose the `render` prop the a11y docs already promised

`ChartWidget`'s accessibility notes pointed at `render` as the way to give a
widget a landmark role, but the prop was never on `ChartWidgetProps` — so
`<ChartWidget render={<section aria-label="Sessions" />}>` failed to type-check
and there was no supported way to make a widget a landmark.

The prop is now declared and forwarded to `Card`, with a test that renders the
documented recipe and asserts the region is really there. The docs also now say
the part they left out: the accessible name has to come from the caller, because
the header's `title` is visible text _inside_ the region rather than a name
for it.
