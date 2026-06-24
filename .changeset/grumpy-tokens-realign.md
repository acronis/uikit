---
'@acronis-platform/tokens-pd': patch
---

Regenerate tokens-pd so its committed CSS / Tailwind presets / DTCG match the
current `design-tokens` source. The earlier Figma token sync (ElectricBlue,
Avatar, ink removal) left the generated output drifted — this re-runs the
Style Dictionary build to drop the removed dark-mode brand and `Icon` / `Table`
/ `InputDatePicker` component tiers and pick up the updated dark primitive
values.
