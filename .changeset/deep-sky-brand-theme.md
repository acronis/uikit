---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

## design-tokens

### Added

| Scope                           | What was added                                        |
| ------------------------------- | ----------------------------------------------------- |
| `semantics.colors.*`            | `"deep-sky"` mode values for all color tokens         |
| `semantics.gradients.*`         | `"deep-sky"` mode values for all 4 AI gradient tokens |
| `components.Breadcrumb.*`       | `"deep-sky"` mode values                              |
| `components.Button.*`           | `"deep-sky"` mode values                              |
| `components.ButtonIcon.*`       | `"deep-sky"` mode values                              |
| `components.Checkbox.*`         | `"deep-sky"` mode values                              |
| `components.InputText.*`        | `"deep-sky"` mode values                              |
| `components.SidebarPrimary.*`   | `"deep-sky"` mode values                              |
| `components.SidebarSecondary.*` | `"deep-sky"` mode values                              |
| `components.Switch.*`           | `"deep-sky"` mode values                              |
| `components.Tag.*`              | `"deep-sky"` mode values                              |
| `components.Tooltip.*`          | `"deep-sky"` mode values                              |

## tokens-pd

### Added

- `css/deep-sky.css` — full semantic + component CSS custom properties for the deep-sky brand
- `css/<Component>/deep-sky.css` — per-component CSS for all allowlisted components
- `dtcg/semantics-deep-sky.json` — resolved DTCG semantics for deep-sky
- `dtcg/components-deep-sky.json` — resolved DTCG components for deep-sky
- `tailwind/deep-sky/tokens.js` — Tailwind preset for deep-sky semantic tokens
- `tailwind/deep-sky/components/<Component>.js` — per-component Tailwind presets for deep-sky

Brand-specific tokens (e.g. `background.brand.*`, `text.onSurface.*`) carry hardcoded HSL values for deep-sky; all other tokens alias into the shared semantics layer identical to the `acronis` brand.
