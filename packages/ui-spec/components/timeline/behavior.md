# Timeline — behavior

## Renders a semantic event list

- **Given** `Timeline.Item`s
  **Then** they render as `<li>`s inside an `<ol>`, top to bottom, in the order
  they were passed; each row pairs an Avatar marker with a Card.
- **Given** the last row
  **Then** its trailing connector is hidden — nothing follows it.

## Item content

- **Given** `title`
  **Then** it renders as the primary line of the card header.
- **Given** `tag` / `timestamp`
  **Then** they follow the title on the same row, tag first.
- **Given** `description`
  **Then** it renders under the title.
- **Given** `children`
  **Then** they render in the card below a 1px divider, in a region with vertical
  padding only — horizontal padding belongs to the section the consumer supplies,
  matching Figma's `Card > Body`. A collapsed row hides them.

## Nesting is flat

- `level` is `1 | 2 | 3` and drives the row's indent only. A row's connector
  geometry is a pure function of its own props — the component never derives depth
  from JSX nesting, so a consumer renders one row per entry and declares its level.
  Rows must be **direct** children of `Timeline`, never wrapped in a fragment, or
  their levels cannot be read.
- **Given** `level` greater than 1 **and** `branchStart`
  **Then** an elbow joins the row to its parent's connector.
- **Given** `level` of 1 **and** `branchStart`
  **Then** `branchStart` is ignored — there is no parent to join.
- The indent step is the marker column plus the gap, so `variant="tree"` (which
  reserves a disclosure button) indents further per level than `default` does.

## Connector

- **Given** the next visible row is at this row's level or deeper
  **Then** a vertical line descends from the marker into the row gap, meeting that
  row's marker or elbow.
- **Given** the next visible row is shallower, or there is none
  **Then** no line is drawn — it would dangle in the margin. This covers the last
  row of a branch, the last row of the list, and a row whose descendants were just
  collapsed away.
- **Given** an explicit `connector`
  **Then** it overrides that derivation.
- A row's connector tracks **its own** marker, so a `tree` leaf (no disclosure
  button) draws its line further toward the inline start than a collapsible
  sibling does.

## Disclosure and collapsing

- **Given** `collapsible`
  **Then** a disclosure control renders — at the trailing edge of the card header,
  or ahead of the marker under `variant="tree"`. Its chevron points down when
  expanded and toward the inline end when collapsed.
- **Given** a collapsed row **and** `variant="default"`
  **Then** only that row's own body is hidden. The chevron belongs to the card, so
  the rows nested under it stay visible.
- **Given** a collapsed row **and** `variant="tree"`
  **Then** the root also drops every following row whose `level` is greater than
  the collapsed row's, until the level rises back to it, and drops that row's
  now-dangling connector. No consumer wiring is needed.
- **Given** a collapsed row followed by a sibling at its own level
  **Then** that sibling is unaffected.
- **Given** the control is activated
  **Then** `onExpandedChange` fires with the requested state. Uncontrolled, the
  root also updates its own state; with `expanded` set, the consumer owns it and
  the row does not change on its own.
- Rows default to **expanded**; pass `defaultExpanded={false}` to start collapsed.

## What it does not do

- It never sorts, groups, fetches, or de-duplicates events, and never decides an
  event's icon, color, or timestamp format — the caller passes ordered rows with
  resolved values.
- It derives a collapsed row's descendants from the flat `level` sequence alone —
  it holds no tree model, and cannot express a row whose depth jumps by more than
  one level at a time.
- It is not a temporal chart — use a Line / Area / Composed chart for trends.
