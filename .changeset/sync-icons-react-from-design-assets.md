---
'@acronis-platform/icons-react': major
---

Regenerate against the resynced `icons` pack (`@acronis-platform/design-assets` 3.0.0).

Breaking: `CirclesMultiIcon` (`stroke-multi`) is removed — the underlying
`CirclesMulti` asset was renamed to `ShapesMulti` upstream. Replace it with
the new `ShapesMultiIcon` export; the glyph is the same.

New exports: `ChartAreaIcon`, `ChartBarRadialIcon`, `ChartDonutIcon`,
`ChartLineIcon`, `ChartRadarIcon`, `ChartScatterIcon`, `ComplianceNis2Icon`,
`ComplianceNistIcon`, `RectangleStatIcon`, `RectangleTreemapIcon`.

`ChevronFirstIcon`/`ChevronLastIcon` change visually — their arrow directions
were swapped upstream, correcting a prior mislabeling. No id changes.

The `./legacy-map` export also updates to track these changes: `AreaChartIcon`,
`LastRangeIcon`, `NextRangeIcon`, `MultipleIcon`, and `MultipleMixIcon` now
point at the renamed/corrected underlying assets.
