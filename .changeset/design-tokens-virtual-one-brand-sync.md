---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync the `virtual_one` brand theme from Figma. `branding.virtual_one` already
existed as a primitive palette group but was never wired into
`values.virtual_one` across `semantics.json`/`components.json`, so
`tokens-pd` never generated `virtual_one.css` and the brand silently fell
back to `default`.

Populates `values.virtual_one` across every semantic and component token
(228 semantic + 1199 component leaves). No token paths added, removed, or
changed in value for any existing brand — purely additive. This release adds
the corresponding generated `tokens-pd` artifacts (`css/virtual_one.css`,
`css/<Component>/virtual_one.css`, `bundles/virtual_one.css`,
`dtcg/{semantics,components}-virtual_one.json`).
