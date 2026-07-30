---
'@acronis-platform/ui-react': patch
---

docs: add curated `.docs.ts` prop-table companions for `apps/docs`'s `<AutoTypeTable>`

No functional or export changes — these are docs-only, type-only files (never
imported by `index.ts`, never bundled) that give the docs site a curated prop
surface for components whose real props interface extends `HTMLAttributes`/
`ComponentPropsWithoutRef` (which otherwise expands `<AutoTypeTable>` into a
table of every inherited DOM attribute) or declares no local props interface
at all. Companions added for `accordion`, `app-shell-chat`, `collapsible`,
`combobox`, `form`, `grid`, `input-select`, `number-field`, `page-content`,
`separator`, `slider`, `stack`, `toggle-group`, `tooltip`; `calendar` and
`field`'s existing companions gained previously-undocumented real props
(`min`/`max`/`startMonth`/`endMonth`/`weekStartsOn`/`components`, `validate`).
