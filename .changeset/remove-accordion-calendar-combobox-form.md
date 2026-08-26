---
'@acronis-platform/ui-react': major
---

Removed `Accordion`, `Calendar`, `Combobox`, and `Form` — none had a Figma
node or internal consumers left in the codebase. `AccordionContainer` and
`CalendarPanel` remain as the shipped replacements for the first two; there
is no drop-in replacement for `Combobox`/`Form` in this release.
