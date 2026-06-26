# WidgetPlaceholder

An empty-state placeholder for a dashboard widget — a bordered card with a
header, a centered illustration / message / action, and an optional footer.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `WidgetPlaceholder`. No
> `--ui-widget-placeholder-*` tier; it maps onto semantic tokens (the muted
> illustration tone is a stand-in for the legacy soft-brand tint). Reconcile with
> `/figma-component WidgetPlaceholder <url> --update` once a mockup lands.

## When to use

- A dashboard widget that has no data yet (and a way to get started).
- A widget tile that is configurable / clickable as a whole (`interactive`).

## When not to use

- A full-page or in-table empty state — use `Empty`.
- A loading state — use `Spinner` (busy) or `Progress` (determinate).

## Parts

| Part                       | Element | Purpose                                      |
| -------------------------- | ------- | -------------------------------------------- |
| `WidgetPlaceholder`        | div     | Root card; `interactive` makes it focusable. |
| `WidgetPlaceholderHeader`  | div     | Icon + title row.                            |
| `WidgetPlaceholderIcon`    | div     | Leading 16px header glyph.                   |
| `WidgetPlaceholderTitle`   | div     | Widget name (truncates).                     |
| `WidgetPlaceholderContent` | div     | Centered column for the body.                |
| `WidgetPlaceholderImage`   | div     | Large 72px decorative illustration.          |
| `WidgetPlaceholderText`    | div     | Short supporting message.                    |
| `WidgetPlaceholderAction`  | div     | Inline call-to-action.                       |
| `WidgetPlaceholderFooter`  | div     | Optional metadata line.                      |

## Example

```tsx
import {
  WidgetPlaceholder,
  WidgetPlaceholderHeader,
  WidgetPlaceholderIcon,
  WidgetPlaceholderTitle,
  WidgetPlaceholderContent,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderAction,
} from '@acronis-platform/ui-react';
import { ChartBarVerticalIcon } from '@acronis-platform/icons-react/stroke-mono';

<WidgetPlaceholder className="h-[220px] w-[320px]">
  <WidgetPlaceholderHeader>
    <WidgetPlaceholderIcon>
      <ChartBarVerticalIcon />
    </WidgetPlaceholderIcon>
    <WidgetPlaceholderTitle>Backup statistics</WidgetPlaceholderTitle>
  </WidgetPlaceholderHeader>
  <WidgetPlaceholderContent>
    <WidgetPlaceholderImage>
      <ChartBarVerticalIcon />
    </WidgetPlaceholderImage>
    <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>
    <WidgetPlaceholderAction>Set up backup plan</WidgetPlaceholderAction>
  </WidgetPlaceholderContent>
</WidgetPlaceholder>;
```
