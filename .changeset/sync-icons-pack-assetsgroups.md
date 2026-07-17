---
'@acronis-platform/design-assets': minor
---

Resync the `icons` pack from Figma into a single `packs/icons.json` organized by `assetsGroups` (stroke-mono, stroke-multi, solid-mono, solid-multi), 480 assets total.

Adds 12 new icons (e.g. `CheckSmall`, `MinusSmall`, `PlusSmall`, `TimesSmall`, `CirclePauseGray`, `CirclePlayGreen`, `CircleStopRed`, `MicrosoftIntune`). Renames a few ids (`BoxLogo`→`BoxCom`, `BulbCrossed`→`BulbOff`, `EyeCrossed`→`EyeOff`, `PinDisabled`→`PinOff`) and drops stale assets. Refreshes SVGO output for the rest and sets the pack `name` to `icons`.
</CodeContent>
<parameter name="EmptyFile">false
