---
'@acronis-platform/icons-react': major
---

feat(icons-react)!: regenerate against the resynced `icons` pack (2.0.0)

The pack this package generates from removed 9 asset ids and added 15, so the
public export list changes. Four removals are renames — update the import and
the JSX tag together:

| removed export    | replacement   |
| ----------------- | ------------- |
| `BoxLogoIcon`     | `BoxComIcon`  |
| `BulbCrossedIcon` | `BulbOffIcon` |
| `EyeCrossedIcon`  | `EyeOffIcon`  |
| `PinDisabledIcon` | `PinOffIcon`  |

Five have no replacement and must be swapped for a different glyph:
`CircleLockIcon`, `CirclesIcon`, `EllipsisMovingIcon`, `InboxFullIcon`,
`ProgressIcon`.

New exports: `CheckSmallIcon`, `MinusSmallIcon`, `PlusSmallIcon`,
`TimesSmallIcon`, `CircleArrowsCircleIcon`, `CircleArrowsCircleBlueIcon`,
`CirclePauseGrayIcon`, `CirclePlayGreenIcon`, `CircleReplyIcon`,
`CircleReplyBlueIcon`, `CircleSmallSolidIcon`, `CircleStopRedIcon`,
`CommvaultIcon`, `MicrosoftIntuneIcon`, `VeeamIcon`.

`legacy-icon-map.json` is regenerated with the same rename chain. Two legacy
Acronis names lost their target and now report
`unresolved: NO_LEGACY_NAME_MATCH` instead of pointing at a deleted asset —
`LoadingIcon` (`loading`) and `TypingIcon` (`typing`); `/migrate-icons` will
flag them for a manual pick rather than emitting a dead import.

Artwork is refreshed across the pack: many glyphs are redrawn on the full
24-unit box (`Check`, `Plus`, `Minus`, `Ellipsis`, the arrows, …), so icons
render slightly larger and optically heavier at the same nominal size.
