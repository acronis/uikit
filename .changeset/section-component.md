---
'@acronis-platform/ui-react': major
---

Rebuild `Section` from its Figma design (node `8262:6179`), replacing the
draft layout primitive ported from `ui-legacy`. It is now a page-level titled
band that groups cards — or a table — with four content layouts on the root
(`column1`, `column2-70-30`, `grid3`, `table`), an optional bottom divider
(`hasBottomBorder`), and a header carrying the 20px title, an optional
description, an optional toggle switch, inline extras, and end-aligned
actions. The root publishes its `variant` through context, so `SectionHeader`
and `SectionContent` never repeat it, and the `table` variant sits completely
flush so its rows bleed to the page edges. Collapsing is a composition with
the shared `AccordionContainer` primitive, the same as `Card`.

**Breaking:** `SectionTitle` and `SectionDescription` are removed — the title
and description are now `SectionHeader` props (`title`, `description`,
`hasDescription`), matching `CardHeader`. Replace
`<SectionHeader><SectionTitle>…</SectionTitle><SectionDescription>…</SectionDescription></SectionHeader>`
with `<SectionHeader title="…" description="…" hasDescription />`.
