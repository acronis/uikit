# EmptyOverlay

A full-bleed empty-state overlay: a colored icon badge over a centered
title/description, on a fade-to-solid backdrop.

## When to use

- Overlay a "no data yet" message on top of other content — e.g. a
  frozen/blurred widget preview behind the message.
- As a standalone empty state that should fill its container edge-to-edge.

## When not to use

- For a plain, non-overlay empty state with no background treatment — use
  `Empty`'s composable parts instead.
- For a bordered dashboard-widget card with a header/footer — use
  `WidgetPlaceholder`.

## Sizing

`EmptyOverlay` always fills its parent (`size-full`) — the developer is
responsible for sizing and positioning the parent, typically
`relative` + `absolute inset-0`.

## Examples

```tsx
import { EmptyOverlay } from '@acronis-platform/ui-react';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

<div className="relative h-96">
  <EmptyOverlay
    icon={<InboxIcon />}
    title="No object yet"
    description="Short description."
  />
</div>;
```

## Parts

| Part          | Element | Purpose                                      |
| ------------- | ------- | -------------------------------------------- |
| root          | `div`   | Fills the parent; fade-to-solid backdrop.    |
| `icon`        | `svg`   | Optional 24px glyph in a 64px colored badge. |
| `title`       | `h3`    | The empty-state headline.                    |
| `description` | `p`     | Optional supporting copy under the title.    |
