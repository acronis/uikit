---
'@acronis-platform/ui-react': patch
---

**Combobox, InputSelect, DropdownMenu**: extended the Checkbox indicator glyph
fix to the remaining 16px selection-indicator slots. Combobox's selected-option
check, InputSelect's selected-option check (two call sites), and DropdownMenu's
checked menu-item indicator all rendered the full-size `CheckIcon`, whose 16px
entry reuses the same edge-to-edge path geometry as the 24px one (only the
stroke width changes), so the glyph filled the 16px box corner to corner. They
now use `CheckSmallIcon`, whose inset path is purpose-built for a 16px slot —
the same fix pattern already applied to Checkbox.

DropdownMenu additionally passed no `size` prop at all, so the icon fell back to
`defaultSize={24}` and was squeezed to 16px by `className="size-4"`, rendering a
thinner stroke than the 16px contract intends; it now passes `size={16}` like
the other indicators. No token, geometry, or API change.

**Known gaps (not addressed in this change)**: two follow-ups were reviewed and
deliberately deferred.

Visual-regression tests can't catch this class of bug at the current settings.
`.storybook/test-runner.ts` uses a kit-wide `failureThreshold: 0.005` (0.5%),
which on a checkbox-sized story (~1280×75px) is a budget of roughly 480px —
far more than the ~40–60px ink delta the glyph swap produces. That is why the
original regression (introduced when a `chore(design-assets)` Figma resync
redefined `Check.svg` from an inset path to an edge-to-edge one) shipped
silently and surfaced only in manual review. The threshold is left as-is.

`number-field.tsx` and `input-num-picker.tsx` still render `<MinusIcon
size={16} />` for their decrement buttons. Those call sites have the same icon
geometry, but the glyph is a decrement affordance rather than a selection
indicator, and whether the inset small variant is correct in that role is a
design call that hasn't been made. Left unchanged pending that decision.
