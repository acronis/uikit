# CardSection — behavior

## Rendering the body

**Given** a `CardSection` with no `variant`
**When** it renders
**Then** it uses the `slot` variant and renders `content` as-is, with no
built-in layout.

**Given** `variant="tag"` and no `contentTag`
**When** it renders
**Then** the body is empty — this variant has no built-in fallback.

**Given** `variant="tag"` and a `contentTag` slot
**When** it renders
**Then** the supplied tags are shown, wrapping onto further lines when the
section is too narrow.

**Given** `variant="list"` and a `contentList` slot
**When** it renders
**Then** the rows are stacked in a column. With no `contentList` the body is
empty — this variant has no built-in fallback.

**Given** `variant="table-actions"`
**When** it renders
**Then** the root drops its horizontal inset so the table rows run edge-to-edge
inside the card, and the header row (if shown) re-applies the inset so the title
stays aligned with the table's first cell.

**Given** `variant="card-primary"` or `variant="card-secondary"`
**When** it renders
**Then** `children` are composed into a nested `Card` filling the section width.
The two variants are identical apart from the nested card's surface token —
primary uses the card surface, secondary the secondary surface.

## The header

**Given** `hasHeader` is not set
**When** it renders
**Then** no header row exists and the body is the section's only child.

**Given** `hasHeader` is set
**When** it renders
**Then** a single row shows the title (truncating with an ellipsis when it
overflows), `extras` inline after it, and `actions` pushed to the end.

**Given** `hasHeader` is set
**When** the consumer omits `title`
**Then** this is a **compile-time error** in the React adapter — the two props
form a discriminated union, because the header row always renders a title.
Passing `title` without `hasHeader` is likewise rejected.

## Stacking sections

**Given** several sections stacked in one card body
**When** every section except the last sets `hasBottomBorder`
**Then** each is separated by a divider with matching bottom padding, and the
last one closes flush against the card's own edge.

**Given** a section with `hasBottomBorder` unset
**When** it renders
**Then** no border is painted and no bottom padding is reserved.

## Composition

**Given** a `render` prop
**When** it renders
**Then** the root element is replaced by the supplied element/component, with
props and classes merged (Base UI composition) — e.g. to render the section as
a semantic `<section>`.
