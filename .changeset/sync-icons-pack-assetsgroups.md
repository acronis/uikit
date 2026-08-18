---
'@acronis-platform/design-assets': major
---

Resync the `icons` pack from Figma into a single `packs/icons.json` organized by `assetsGroups` (stroke-mono, stroke-multi, solid-mono, solid-multi), 487 assets total.

Breaking: renames asset ids (`BoxLogo`→`BoxCom`, `BulbCrossed`→`BulbOff`, `EyeCrossed`→`EyeOff`, `PinDisabled`→`PinOff`) and removes stale assets (`CircleLock`, `Circles`, `EllipsisMoving`, `InboxFull`, `Progress`), so the pack version goes to `2.0.0`.

Adds 15 new icons (e.g. `CheckSmall`, `MinusSmall`, `PlusSmall`, `TimesSmall`, `CirclePauseGray`, `CirclePlayGreen`, `CircleStopRed`, `MicrosoftIntune`, `CircleArrowsCircle`, `CircleReply`, `CircleSmallSolid`, `Commvault`, `Veeam`). Refreshes SVGO output for the rest and sets the pack `name` to `icons`.
