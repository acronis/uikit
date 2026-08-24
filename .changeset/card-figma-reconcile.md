---
'@acronis-platform/ui-react': major
---

Reconcile `Card` against its Figma design (node `10012-195993`).

`CardHeader` now owns the title and description directly (`title`/`description`/
`hasDescription` props) plus the design's full header feature set: a drag
handle (`isDraggable`), a toggle switch (`isSwitchable` + `switchChecked`/
`defaultSwitchChecked`/`onSwitchCheckedChange`/`switchDisabled`/`switchLabel`),
an avatar (`hasAvatar`/`avatarLabel`/`avatar`), a rename button (`hasRename`/
`onRename`/`renameLabel`), and `extras`/`actions` content slots. `Card` (the
root) gained `hasError`, which swaps the border to the error token.

**Breaking:** `CardTitle` and `CardDescription` are removed — their content is
now `CardHeader`'s `title`/`description` props.
