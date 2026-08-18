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

**Status line:** the 6px leading status line now genuinely covers the 1px border,
as the design intends. It is positioned to bleed 1px outwards, but `overflow: clip`
clips at the _padding_ box — the same box that forms an absolutely positioned
pseudo-element's containing block — so the bleed was silently shaved off and the
line rendered 5px wide starting inside the border. Since the border and the line
use different tokens, every variant read as two adjacent stripes. Moving the clip
edge to the border box (`overflow-clip-margin: border-box`) lets the bleed survive
while still rounding the line's square corners.

**`AlertClose`:** `variant` and `render` are removed from `AlertCloseProps`, since
the control is documented as a fixed ghost `ButtonIcon` and `...props` spread after
those defaults — `<AlertClose variant="secondary" />` previously type-checked and
silently won. `aria-label` is dropped from the type too, but because TypeScript
does not check hyphenated JSX attributes, `ariaLabel` is now also pinned after the
spread so it stays authoritative.

**Typography:** the title now uses the generated `ui-typography-headings-lead`
class (Inter Regular 18 / 24) instead of hand-written `text-base font-medium`
utilities (Inter Medium 16 / 24), and the description uses the Alert tier's own
generated description class (same computed values as before). `Toast` shares both,
so the two banners are typographically identical.
