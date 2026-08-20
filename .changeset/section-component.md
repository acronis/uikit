---
'@acronis-platform/ui-react': minor
---

Add `Section`: a titled band that groups `Card`s (or a table) on a page, rewritten from the Figma spec (node `8262:6179`).

Compound parts — `Section`, `SectionHeader`, `SectionContent` — with the root's `variant` threaded through context so the header and body adapt without repeating it:

- `variant`: `column1` | `column2-70-30` | `grid3` | `table`. The three padded variants inset the root (`px-4 pt-4`, `gap-3`); `table` is flush so rows bleed edge-to-edge while the header re-applies its own inset. `column2-70-30` and `grid3` lay their content out as a 3-column grid, the former spanning its first child across two columns.
- `hasBottomBorder`: adds the divider plus the matching bottom padding — border only on `table`, which has no root padding to extend.
- `SectionHeader`: `title`, optional `description`, an `isSwitchable` toggle (controlled or uncontrolled), and `icon` / `extras` / `actions` slots.
- Collapsing composes the shared `AccordionContainer` primitive, so a `Section` and any `Card` nested inside keep independent open state.

Themed by the shared semantic tokens (`--ui-text-on-surface-primary`, `--ui-text-on-surface-secondary`, `--ui-border-on-surface-divider`) — Section has no component-local token tier by design. Linked to Figma via Code Connect.

This replaces the earlier placeholder ported from `ui-legacy`, which had no variants, no collapsible support, and the wrong typography. Nothing consumed it, so there is no migration path to preserve.
