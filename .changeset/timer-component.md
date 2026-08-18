---
'@acronis-platform/ui-react': minor
---

Add `Timer`: an elapsed-time readout paired with a hairline-separated cluster of
icon-only actions, in a single bordered 32px box (Figma node 7987:25477).

The readout is a `role="timer"` live region rendered with tabular figures, so
the box keeps its width as the digits change. The actions are `ButtonGroupItem`
children — `Timer` renders the `ButtonGroup` itself, always in its `inlined`
style, since its own box already draws the border and radius an `outlined` group
would duplicate. Omit the actions for a read-only readout: the toolbar and the
divider then go with them.

The component holds no clock — it renders whatever `value` it is handed, leaving
the interval, the format, and the state the actions mutate to the caller.
