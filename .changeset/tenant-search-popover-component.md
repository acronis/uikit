---
'@acronis-platform/ui-react': minor
---

Add `TenantSearchPopover`: a Popover-based tenant/organization search-and-select tree

Composes the existing `Popover` shell with the presentational search-row, section, and tree-row pieces shared with `InputSelect` (`InputSelectSearchField`, `InputSelectSectionView`/`InputSelectSectionLabelView`, `InputSelectRowContent`, `InputSelectExpander`). Renders an optional "Recent" section plus a "Browse" tree of nested tenants (client/partner/folder/unit), with client-side search filtering, single-leaf selection, and `loading`/`empty`/`error` status states. Keyboard-navigable as two `role="tree"` regions with roving tabindex and RTL-aware arrow-key semantics. Only leaf nodes are selectable; nodes with children are expand/collapse toggles.
