---
'@acronis-platform/ui-react': patch
---

Correct stale comments on `InputBox`/`index.ts` that described it as an unexported internal primitive — it is exported for pairing with `Field` (`<FieldControl render={<InputBox />} />`). No behavior or API change.
