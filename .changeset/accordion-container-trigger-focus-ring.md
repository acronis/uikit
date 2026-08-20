---
'@acronis-platform/ui-react': patch
---

Fix `AccordionContainer.Trigger` missing a visible keyboard focus indicator.
The trigger now gets the same `focus-visible:ring-2` treatment as
`AccordionTrigger` in the plain `Accordion` component.
