---
'@acronis-platform/design-assets': major
---

Sync the `icons` pack from Figma (pack version `2.0.0` → `3.0.0`).

Breaking: removes the `CirclesMulti` asset from `assetsGroups.stroke-multi` (retired
upstream in Figma) — update any reference to `icons.stroke-multi.CirclesMulti`.
Downstream, `@acronis-platform/icons-react` generates `CirclesMultiIcon` from this
exact asset (see its `legacy-icon-map.json`), so that icon component is removed too
next time `icons-react` regenerates from this pack.

Adds 11 new icons: `ChartArea`, `ChartBarRadial`, `ChartDonut`, `ChartLine`,
`ChartRadar`, `ChartScatter`, `ComplianceNis2`, `ComplianceNist`, `RectangleStat`,
`RectangleTreemap`, `ShapesMulti`.

Re-exports a handful of existing icons with upstream Figma fixes/cleanup
(`ChevronFirst`/`ChevronLast` geometry correction, sub-pixel path re-exports for
`MicrosoftAzure`, `Minus`, `Plus`, `ShapesMulti`) — same visual result, no id changes.
