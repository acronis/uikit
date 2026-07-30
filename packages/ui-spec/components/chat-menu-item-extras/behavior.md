# ChatMenuItemExtras — behavior

## Variant selects exactly one part

**Given** `variant="tag"`
**When** it renders
**Then** the `tag` part renders (a `Tag` fixed to `variant="info" size="sm"`)
**And** the `shortcut` part is absent — even if `labelShortcut` was supplied.

**Given** `variant="shortcut"`
**When** it renders
**Then** the `shortcut` part renders as text
**And** the `tag` part is absent — even if `labelTag` was supplied.

**Given** no `variant`
**Then** it behaves as `variant="tag"` — the Figma component set's own default.

## Missing label for the active variant

**Given** `variant="tag"` and no `labelTag`
**When** it renders
**Then** an empty `Tag` still renders — the pill's minimum width keeps it
visible, so the omission is obvious rather than silent. Same for `variant="shortcut"`
with no `labelShortcut` (an empty text node).

## Layout

**Given** the cluster inside a menu-item row wider than its content
**When** it renders
**Then** its content sits at the **logical end** of its own box (flex-end), and
children are separated by the MenuItemExtras container gap
**And** the cluster is at least 24px tall so single-line rows do not jump when
the variant changes.

## Overflow

**Given** a `labelTag` longer than the Tag's 256px max width
**When** it renders
**Then** the `Tag` truncates with its own ellipsis — this component only clips
overflow at the cluster boundary, it does not re-implement truncation.

**Given** a `labelShortcut`
**Then** it never wraps (shortcut glyph sequences must stay on one line).

## Bidirectionality

**Given** an ancestor with `dir="rtl"`
**When** it renders
**Then** the cluster mirrors: content lands at the visual left and the shortcut
text aligns to the logical end. Nothing is anchored to a physical edge, and no
glyph is flipped (neither a Tag pill nor a shortcut string is directional).

## Non-interactive

**Given** the cluster
**When** the user hovers or clicks it
**Then** nothing happens — it is a presentational affordance. Interaction belongs
to the enclosing menu item, which owns the hover/active/selected treatment.
