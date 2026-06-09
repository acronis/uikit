# Tag — behavior

## Variant

**Given** a Tag with `variant` set to one of `info`, `success`, `warning`,
`critical`, `danger`, or `neutral`
**When** it renders
**Then** its background, border, and text resolve from that status's
`--ui-background-status-*` / `--ui-border-on-status-*` / `--ui-text-on-status-*`
tokens
**And** with no `variant` it defaults to `neutral`.

## Size

**Given** `size` of `default` or `sm`
**When** it renders
**Then** the height/padding change accordingly — 24px (`default`) or 20px
(`sm`); both are fully rounded (pill).

## Icon

**Given** an `icon`
**When** it renders
**Then** the icon shows at 16px before the label and inherits the variant's text
color via `currentColor`.
**Given** no `icon`
**Then** only the label renders.

## Label overflow

**Given** a label longer than the 256px max width
**When** it renders
**Then** the tag caps at 256px and the label truncates with an ellipsis.

## Non-interactive

**Given** a Tag
**When** the user hovers or clicks it
**Then** nothing happens — a Tag is a presentational label, not a control (it
emits no events and has no interaction states).
