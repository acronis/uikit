# FilterSearch — Accessibility Requirements

`FilterSearch` itself is a pure layout wrapper — accessibility concerns are
delegated to its composed children (Search, ButtonMenu, Select, Button).
`FilterSearchFilters` and `FilterSearchAppliedFilters` own their own
interaction and are covered below.

## ARIA Roles and Attributes

### Root (`div`)

The root element has **no semantic role** — it is a presentational flex
container. If the consumer needs a landmark, they can add `role="toolbar"`
and an `aria-label` via props.

| Attribute    | Value    | Reason                                          |
| ------------ | -------- | ----------------------------------------------- |
| No `role`    | —        | Pure layout; no inherent semantics              |
| `aria-label` | (opt-in) | Consumer may set this if using `role="toolbar"` |

---

## Keyboard Navigation

Keyboard interaction is handled by the child components:

| Component                    | Key         | Action                                        |
| ---------------------------- | ----------- | --------------------------------------------- |
| Search                       | Tab         | Focuses the search input                      |
| ButtonMenu                   | Enter       | Opens/closes the filter menu                  |
| Select                       | Enter       | Opens the select dropdown                     |
| Button                       | Enter       | Activates the action                          |
| `FilterSearchFilters`        | Enter/Space | Opens/closes the filter popover               |
| `FilterSearchFilters`        | Escape      | Closes the popover and reverts the draft      |
| `FilterSearchAppliedFilters` | Tab         | Moves between chips' remove buttons and Reset |

The toolbar itself does not manage focus — children follow their own focus
patterns. If `role="toolbar"` is applied, arrow-key navigation between
children is the consumer's responsibility.

`FilterSearchFilters`'s popover uses Base UI's `Popover` primitive, which
provides standard dialog-like focus trapping and restores focus to the
trigger on close (Apply, Cancel, outside-press, or Escape).

---

## Screen Reader Requirements

1. Each child component announces itself according to its own spec.
2. The search field should have an `aria-label` (e.g. "Search table").
3. Action buttons should have descriptive labels.
4. `FilterSearchFilters`'s trigger announces its expanded state
   (`aria-haspopup`/`aria-expanded`, from Base UI's `PopoverTrigger`).
5. Each removable chip's remove control has an explicit `aria-label`
   (`"Remove <key> filter"`, or the `removeLabel` the field supplies), so a
   screen reader announces which filter a given remove button drops.

---

## Color and Contrast

All contrast requirements are owned by the child components and their
respective token tiers, including `Button`, `Chip`, and `Popover`'s own specs
for `FilterSearchFilters`/`FilterSearchAppliedFilters`.

---

## Testing Checklist

- [ ] Root renders as a `<div>` with no unexpected ARIA roles
- [ ] All child components are reachable via Tab
- [ ] Search field has an accessible label
- [ ] ButtonMenu announces its label and expanded state
- [ ] Action buttons have accessible names
- [ ] `FilterSearchFilters`'s trigger announces expanded state and toggles via Enter/Space
- [ ] Escape closes the open popover and reverts the draft
- [ ] Each applied-filter chip's remove control has a descriptive `aria-label`
