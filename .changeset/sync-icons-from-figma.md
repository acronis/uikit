---
'@acronis-platform/design-assets': major
---

Sync the `icons` pack from Figma (pack version `2.0.0` → `3.0.0`).

Breaking: renamed `CirclesMulti` → `ShapesMulti` in `assetsGroups.stroke-multi`
(same category/tags; `ShapesMulti`'s `legacyNames` carries `CirclesMulti` forward)
— update any reference from `icons.stroke-multi.CirclesMulti` to
`icons.stroke-multi.ShapesMulti`. Downstream, `@acronis-platform/icons-react`
generates `CirclesMultiIcon` from this exact asset (see its
`legacy-icon-map.json`), so that export becomes `ShapesMultiIcon` next time
`icons-react` regenerates from this pack.

Adds 10 new icons: `ChartArea`, `ChartBarRadial`, `ChartDonut`, `ChartLine`,
`ChartRadar`, `ChartScatter`, `ComplianceNis2`, `ComplianceNist`, `RectangleStat`,
`RectangleTreemap`.

Re-exports a handful of existing icons with upstream Figma changes:

- `ChevronFirst`/`ChevronLast` — an actual geometry fix: the two icons' arrow
  directions were swapped, correcting a prior mislabeling. Visual result
  changes for both; ids are unchanged.
- `MicrosoftAzure`, `Minus`, `Plus`, `ShapesMulti` — sub-pixel path
  re-parameterization only (coordinate precision / anchor shifts under 1px),
  visually equivalent at rendered sizes; ids are unchanged.
