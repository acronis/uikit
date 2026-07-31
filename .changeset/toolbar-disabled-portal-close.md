---
'@acronis-platform/ui-react': patch
---

fix(toolbar): carry the disabled state to the overflow menu through React

`ToolbarActionList` learned that its ancestor `Toolbar` had become disabled by
running a `MutationObserver` over the `<fieldset>`'s `disabled` attribute. That
resolved a render late — the portalled overflow menu stayed interactive for a
beat after the toolbar was disabled — and the resulting `setState` landed
outside React's own scheduling, where it could be dropped entirely, leaving an
open menu enabled indefinitely. The state now comes from the `Toolbar` via
context and gates the menu's `open` prop, so it closes in the same commit.
