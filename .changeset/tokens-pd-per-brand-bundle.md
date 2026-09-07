---
'@acronis-platform/style-dictionary': minor
'@acronis-platform/tokens-pd': minor
---

Add a full per-brand CSS bundle so a runtime consumer can re-theme in one step.

Previously `tokens-pd` only shipped the semantic tier (`css/<brand>.css`) and an
opt-in component tier (`css/<Component>/<brand>.css`), with no artifact carrying
"everything for brand X". A consumer that swaps brands at runtime (rather than at
build time via static imports) could only swap the semantic file, silently
leaving every component on the default brand's colors.

`pd-css` now also emits `bundles/<brand>.css` — one file per brand with the
semantic tier and every component tier merged into a single `:root, :host {}`
block, always full (never override-only). The brand/component set is derived
from the same data `tokens.ts` already uses internally (`BRANDS`, the per-slice
declaration maps), so it can't drift from what's actually built. Exposed via
`tokens-pd`'s `package.json` `exports` as `./bundles/*`.
