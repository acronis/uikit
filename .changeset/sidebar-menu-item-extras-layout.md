---
'@acronis-platform/ui-react': minor
---

Fix `SidebarPrimaryMenuItem` / `SidebarSecondaryMenuItem` trailing-extras layout: tags, shortcuts, and external-link icons passed as children are now split from the label and pinned to the right edge of the row (`shrink-0`), while the title takes the remaining width and truncates with an ellipsis (`min-w-0`). Previously the extras flowed inline after the label, so a long title pushed them off the row instead of truncating.

Fix the `SidebarSecondary` collapsed rail: the breadcrumb labels now read vertically (`writing-mode: vertical-rl`, separator chevron turned to point down) so they run down the ~48px rail instead of clipping into single letters, and `SidebarSecondaryHeader` is hidden when collapsed (the breadcrumb's parent label carries the section context), matching the Figma collapsed design. The footer is now pinned to the bottom of the rail in the collapsed state, and `SidebarSecondaryCollapseTrigger`'s chevron auto-flips 180° when collapsed so a chevron-left ("collapse") becomes a chevron-right ("expand").

Add an optional `shortcut` prop to `SidebarSecondaryCollapseTrigger` — a right-aligned keyboard-shortcut hint (e.g. `⌘J`) that is hidden alongside the label in the collapsed rail.
