# Section — behavior

## Choosing a content layout

**Given** a `Section` with no `variant`
**When** it renders
**Then** it uses `column1`: the content part is one full-width area with no
imposed grid.

**Given** `variant="column2-70-30"`
**When** it renders
**Then** the content part is a three-column grid; the children span two columns
(~70%) and `secondaryContent` the remaining one (~30%). With no
`secondaryContent` the narrow column is not rendered at all and the wide column
keeps its 2:1 span rather than stretching.

**Given** `variant="grid3"`
**When** it renders
**Then** the content part is a three-column grid the children flow into. No row
count is imposed — four children wrap onto a second row.

**Given** `variant="table"`
**When** it renders
**Then** the root drops its padding entirely so the table's rows bleed to the
page edges, and the header re-applies the horizontal inset so the title still
lines up with the first column.

**Given** `secondaryContent` under any variant other than `column2-70-30`
**When** it renders
**Then** it is ignored — those layouts have a single content area.

## Stacking sections down a page

**Given** a section with `hasBottomBorder` unset
**When** it renders
**Then** no divider is painted and **no bottom padding is reserved**. This is
deliberate: the next section down opens with its own top inset, so reserving
bottom padding here would double the gap between two unbordered bands.

**Given** several sections stacked on one page
**When** every section except the last sets `hasBottomBorder`
**Then** each is separated by a divider with matching bottom padding, and the
last one closes flush.

**Given** `variant="table"` together with `hasBottomBorder`
**When** it renders
**Then** only the divider is added — the root stays flush, with no padding on
any side.

## The header

**Given** no `SectionHeader` child
**When** the section renders
**Then** there is no header row and the content is the section's only child.
There is no `hasHeader` flag: the part is simply omitted.

**Given** a `title` and `description` but no `hasDescription`
**When** it renders
**Then** only the title is shown — the description is opt-in.

**Given** `isSwitchable`
**When** it renders
**Then** a toggle switch appears at the start of the header, before the title,
carrying `switchLabel` as its accessible name. Toggling it emits
`switch-checked-change`; it never expands or collapses the section.

**Given** `extras` and `actions`
**When** it renders
**Then** `extras` sit inline immediately after the title and `actions` are
pushed to the inline end of the row, before the collapse trigger. The push
comes from the flex-grow wrapper around `title` / `description` / `extras`.

**Given** a header with `children` but no `title`, `description`, or `extras`
**When** it renders
**Then** that wrapper is not rendered at all, so `children` start at the inline
start of the row — this is what lets a consumer-supplied heading take the
title's place (see accessibility). Because nothing then grows, `actions`
follow `children` immediately rather than sitting at the inline end, unless the
consumer's own content grows (`flex-1`).

## Collapsing

**Given** `isCollapsible` on a header that is **not** inside a collapsible
`AccordionContainer`
**When** it renders
**Then** no trigger appears — `AccordionContainer.Trigger` renders `null`
outside a collapsible container, matching the design's `isCollapsable=false`
state, which has no disclosure UI at all.

**Given** a header with `isCollapsible` inside
`<AccordionContainer collapsible defaultOpen>`
**When** it renders
**Then** the trigger is shown expanded (`aria-expanded="true"`) and the content
wrapped in `AccordionContainer.Content` is visible — the design's
`true-expanded` state.

**Given** the same composition with `defaultOpen={false}`
**When** it renders
**Then** the trigger reads `aria-expanded="false"` and the panel is collapsed —
the design's `true-collapsed` state.

**When** the trigger is activated
**Then** the panel animates its height and the chevron rotates; the header,
including the switch and actions, stays visible throughout.

## Composition

**Given** a `render` prop on any part
**When** it renders
**Then** the element is replaced by the supplied element/component with props
and classes merged (Base UI composition) — e.g. rendering the root as an
`<article>`.

**Given** a `SectionHeader` or `SectionContent` rendered outside a `Section`
**When** it renders
**Then** it falls back to the `column1` layout rather than failing.
