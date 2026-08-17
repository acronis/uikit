---
'@acronis-platform/ui-react': minor
---

Rebuild `Alert` against the current Figma design (node `7421:125155`) and its own
`--ui-alert-*` token tier.

The banner is no longer a pale status-tinted surface. It is now a neutral surface
whose severity is carried by a status-colored 1px border plus a 6px status line
down the leading edge (mirrored under `dir="rtl"`), with the geometry, colors, and
spacing all read from the `Alert` tier — which was present in `tokens-pd` but not
imported by this package, so none of it was reaching the component.

**Breaking — `variant` now matches the Figma set exactly:**

- `destructive` → renamed **`danger`**.
- `ai` and `neutral` are **removed**; they were invented during the original port
  from `shadcn-uikit` and have no counterpart in the design system's Alert.

**New:**

- `AlertClose` — the trailing dismiss control (a ghost `ButtonIcon`). Rendering it
  is what makes an alert dismissable; its `ariaLabel` defaults to `"Close"`.
- `AlertText` — wraps the title and description. Its vertical padding is what
  aligns the first line of text with the status icon, so move existing
  title/description children inside it.
- `AlertIcon` now renders the variant's own multicolor status icon when given no
  children, so consumers no longer have to know the icon-per-severity mapping.
  Passing children still overrides it.
- `alertVariants` and the `AlertVariant` type are exported.
