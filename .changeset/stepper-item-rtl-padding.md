---
'@acronis-platform/ui-react': patch
---

fix(stepper-item): mirror the asymmetric container padding under RTL

`StepperItem` mapped its asymmetric container padding tokens
(`--ui-stepper-item-global-container-padding-{l,r}`, 8px/16px) with physical
`pl-`/`pr-` utilities. Because the avatar and label mirror with the flex order
under `dir="rtl"`, the tighter padding stayed pinned to the visual left, so the
spacing was inverted relative to the marker. They now use the logical `ps-`/`pe-`
utilities, so the 8px side always sits next to the avatar in both directions.
