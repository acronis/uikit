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
  matching Figma's `Card > Body`. Collapsing a _branch_ never hides them; only this
  row's own `collapsibleBody` chevron does.

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
  reserves a disclosure button on every level) indents further per level than
  `default` does.

## Connector

- **Given** the next visible row is at this row's level or deeper
  **and** that row's marker sits in the same column
  **Then** a vertical line descends from the marker into the row gap, meeting that
  row's marker or elbow.
- **Given** the next visible row is shallower, or there is none
  **Then** no line is drawn — it would dangle in the margin. This covers the last
  row of a branch, the last row of the list, and a row whose descendants were just
  collapsed away.
- **Given** the next visible row is a `tree` sibling whose marker sits in a
  different column — one of the two has descendants and so reserves a disclosure
  button, the other does not
  **Then** no line is drawn either: a straight line between them is impossible, so
  the kit omits it rather than drawing a crooked one. This is only reachable once a
  row has been collapsed, since an expanded row with descendants is always followed
  by one of them.
- **Given** an explicit `connector`
  **Then** it overrides that derivation.
- A row's connector tracks **its own** marker. A row that has descendants always
  carries the disclosure button, so its connector starts from the same column the
  elbow of its first child is drawn against — which is why an elbow always meets
  its parent's line.

## Disclosure and collapsing

Collapsing is the **variant**, not a per-row opt-in. There is no `collapsible`
property: a `tree` branch nobody can collapse would be indistinguishable from
`default` with a wider indent.

- **Given** `variant="default"`
  **Then** nothing collapses and no disclosure control is rendered.
- **Given** `variant="tree"` **and** a row that has descendants — the row authored
  after it is deeper
  **Then** that row gets a disclosure control ahead of its marker. Its chevron
  points down when expanded and toward the inline end when collapsed.
- **Given** `variant="tree"` **and** a row with no descendants
  **Then** it gets no control, and its marker sits at the start of the indent step
  rather than after the reserved button.
- **Given** a collapsed row
  **Then** the root drops every following row whose `level` is greater than the
  collapsed row's, until the level rises back to it, and drops that row's
  now-dangling connector. No consumer wiring is needed.
- **Given** a collapsed row
  **Then** it keeps its own control — "has descendants" is read from the authored
  children, not the visible ones, so the branch can always be expanded again.
- **Given** a collapsed row followed by a sibling at its own level
  **Then** that sibling is unaffected.
- **Given** the control is activated
  **Then** `onExpandedChange` fires with the requested state. Uncontrolled, the
  root also updates its own state; with `expanded` set, the consumer owns it and
  the branch does not change on its own.
- Branches default to **expanded**; pass `defaultExpanded={false}` to start
  collapsed.

## The card's own body disclosure

A second, **orthogonal** control. `collapsibleBody` is not a variant and not tied
to one: it is the card's chevron, so it behaves identically under `default` and
`tree`, and a tree row that has descendants can carry both at once. (It lives on
`Timeline.Item` only until `Card` grows the behaviour itself.)

- **Given** `collapsibleBody`
  **Then** a chevron renders at the trailing edge of the card header (Figma's
  `Action Button`), and activating it shows or hides this row's `children`.
- **Given** `collapsibleBody` **and** a `tree` row that has descendants
  **Then** the row carries two controls: the branch button ahead of the marker
  drops the rows below, the header chevron folds this card's body. Neither affects
  the other.
- **Given** the header chevron is activated
  **Then** `onBodyExpandedChange` fires with the requested state. Uncontrolled, the
  row updates its own state; with `bodyExpanded` set, the consumer owns it.
- Card bodies default to **shown**; pass `defaultBodyExpanded={false}` to start
  folded.
- **Given** no `collapsibleBody`
  **Then** no chevron renders and the body is always shown.

## What it does not do

- It never sorts, groups, fetches, or de-duplicates events, and never decides an
  event's icon, color, or timestamp format — the caller passes ordered rows with
  resolved values.
- It derives a collapsed row's descendants from the flat `level` sequence alone —
  it holds no tree model, and cannot express a row whose depth jumps by more than
  one level at a time.
- It is not a temporal chart — use a Line / Area / Composed chart for trends.
