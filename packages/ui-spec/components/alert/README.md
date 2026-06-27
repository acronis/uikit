# Alert

A status banner with severity variants and composable parts.

> Design-pending v1, ported from the legacy shadcn-uikit `alert`.

## When to use

- Surface a contextual status message (success, warning, error, info, …) inline
  on a page or in a panel.

## When not to use

- Transient, auto-dismissing notifications — use `Toast`.
- A blocking confirmation — use `Dialog`.

## Parts

| Export             | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| `Alert`            | The banner root (`role="alert"`) + `variant`.                  |
| `AlertIcon`        | Leading status-icon slot.                                      |
| `AlertContent`     | The text column beside the icon.                               |
| `AlertTitle`       | A short heading.                                               |
| `AlertDescription` | Supporting text.                                               |
| `AlertActions`     | Optional action buttons — right edge or under the description. |

`AlertActions` placement: as a direct child of `Alert` after `AlertContent` it
sits at the right edge (add `self-center` to center it vertically); placed inside
`AlertContent` (after the description) it flows below the text.

## Example

```tsx
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '@acronis-platform/ui-react';
import { CircleWarningIcon } from '@acronis-platform/icons-react/stroke-mono';

<Alert variant="destructive">
  <AlertIcon>
    <CircleWarningIcon size={16} />
  </AlertIcon>
  <AlertContent>
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      Your session has expired. Please log in again.
    </AlertDescription>
  </AlertContent>
</Alert>;
```
