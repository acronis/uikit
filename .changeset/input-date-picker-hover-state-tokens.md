---
'@acronis-platform/ui-react': patch
---

Fix `InputDatePicker`: wire the label, value, placeholder, separator, description, and icon text colors to their `-hover` token on trigger hover or `open`, matching the Figma design's hover/active treatment (previously only the box border/background switched). No brand currently sets a `-hover` value that differs from `-idle` for these tokens, so the color wiring itself won't change rendering until a brand's token diverges.

The trigger icon now also sits in a fixed `--ui-input-date-picker-global-icon-box-size` (20px) box instead of a hug-content one, matching the same fixed-box treatment given to `InputSelect` (see the icon-box-size changeset) — this part does change rendering immediately.
