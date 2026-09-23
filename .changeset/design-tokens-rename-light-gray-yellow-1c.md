---
'@acronis-platform/design-tokens': major
'@acronis-platform/tokens-pd': major
---

**Breaking:** rename the `light-gray` and `yellow-1c` brand keys to
`light_gray` and `yellow_1c`.

Every other brand uses an underscore consistently in both its `branding.*`
primitive key and its `values.<brand>` key. `light-gray`/`yellow-1c` were the
only two exceptions: their `branding.*` primitive key was already
underscored, but their `values.<brand>` key stayed hyphenated (a data-entry
mistake). A brand-name mapping that assumes underscore for every brand fails
to resolve these two — this is a real bug, not just a naming
inconsistency.

Consumers must update any reference to these two brand ids:

- `light-gray` → `light_gray`
- `yellow-1c` → `yellow_1c`

This renames the generated `tokens-pd` artifact paths accordingly:
`css/light-gray.css` → `css/light_gray.css`, `css/<Component>/light-gray.css`
→ `css/<Component>/light_gray.css`, `bundles/light-gray.css` →
`bundles/light_gray.css`, `dtcg/{semantics,components}-light-gray.json` →
`dtcg/{semantics,components}-light_gray.json`, and equivalently for
`yellow-1c` → `yellow_1c`. No token values changed for either brand — only
the key.
