# Alert

An inline status banner. The surface is neutral in every severity; the severity
is carried by a status-colored border and a 6px status line down the leading
edge, plus a fixed icon per severity.

## When to use

- Surface a contextual status message (info, success, warning, critical, danger)
  inline on a page or in a panel, where it stays until the condition changes or
  the user dismisses it.
- Give the user something to do about it — `AlertActions` is the intended place
  for the remedy.

## When not to use

- Transient, auto-dismissing notifications — use `Toast`.
- A blocking confirmation — use `Dialog`.
- A page-wide, top-anchored announcement bar — that's `AlertRibbon`.
- A field-level validation message — that belongs on the input.

## Severity

| Variant    | Icon                    | Use for                                        |
| ---------- | ----------------------- | ---------------------------------------------- |
| `info`     | `CircleInfoBlue`        | Neutral context the user should notice.        |
| `success`  | `CircleCheckGreen`      | An operation completed.                        |
| `warning`  | `TriangleWarningYellow` | Something needs attention soon.                |
| `critical` | `CircleWarningOrange`   | Something is degraded and needs attention now. |
| `danger`   | `DiamondWarningRed`     | A failure or destructive condition.            |

## Parts

| Export             | Purpose                                                                               |
| ------------------ | ------------------------------------------------------------------------------------- |
| `Alert`            | The banner root (`role="alert"`) + `variant`.                                         |
| `AlertIcon`        | The leading status icon — defaults to the variant's own glyph.                        |
| `AlertContent`     | The column beside the icon.                                                           |
| `AlertText`        | Wraps the title + description; its padding aligns the first line with the icon.       |
| `AlertTitle`       | A short heading.                                                                      |
| `AlertDescription` | Optional supporting text.                                                             |
| `AlertActions`     | Optional wrapping row of action buttons, inside `AlertContent` after `AlertText`.     |
| `AlertClose`       | Optional trailing dismiss control — rendering it is what makes the alert dismissable. |

Keep the title and description inside `AlertText` rather than directly under
`AlertContent`: `AlertText`'s vertical padding is what keeps the first line of
text aligned with the icon box.

## Example

```tsx
import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertText,
  AlertTitle,
  Button,
} from '@acronis-platform/ui-react';

<Alert variant="danger">
  <AlertIcon />
  <AlertContent>
    <AlertText>
      <AlertTitle>Session expired</AlertTitle>
      <AlertDescription>Sign in again to keep working.</AlertDescription>
    </AlertText>
    <AlertActions>
      <Button variant="secondary">Sign in</Button>
    </AlertActions>
  </AlertContent>
  <AlertClose onClick={dismiss} />
</Alert>;
```

A title-only, non-dismissable alert is just the parts you keep:

```tsx
<Alert variant="success">
  <AlertIcon />
  <AlertContent>
    <AlertText>
      <AlertTitle>Your changes were saved</AlertTitle>
    </AlertText>
  </AlertContent>
</Alert>
```
