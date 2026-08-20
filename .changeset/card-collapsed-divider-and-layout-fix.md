---
'@acronis-platform/ui-react': patch
---

Fix two visual bugs in `Card`'s collapsible composition: `CardHeader` no
longer doubles up its bottom divider against `Card`'s own outer border once
the panel is collapsed (it now reads the accordion's `open` state via
`AccordionContainer`'s context instead of a new prop), and the collapsible
Storybook stories no longer re-center the whole card when the panel's height
changes.
