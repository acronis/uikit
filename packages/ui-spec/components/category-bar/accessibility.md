# CategoryBar — accessibility

`CategoryBar` is a data visualization: a single bar of proportional segments.

## Text alternative

- The track carries `role="img"` with an `aria-label`. By default the label is a
  locale-neutral `"<label> <value>"` list built from the data (e.g. `"Registered
42, Trained 32, Certified 26"`); pass a fuller `aria-label` sentence when you
  have one. This is the screen-reader equivalent of the bar.
- **Do not rely on color alone.** The legend (`showLegend`) and the per-segment
  tooltip both carry the text label, so the meaning survives without color
  perception.

## Tooltip

- The per-segment tooltip is a **hover/pointer** affordance layered on the
  `role="img"` bar; the `aria-label` already conveys the same information to
  assistive tech, so the tooltip is supplementary rather than the sole source.
- Because the segments sit inside a `role="img"`, their tooltip triggers are not
  exposed as separate focusable controls — keeping a single, coherent image
  semantic instead of a row of unlabeled controls.

## Contrast

- Segment fills are caller-supplied tokens; pick colors that stay distinguishable
  from each other and from the track background in both light and dark themes.
  Adjacent segments should not read as one block — the legend disambiguates when
  hues are close.
