# DialogFooterDefault

A bottom action bar for panels, dialogs, and sheets — end-aligned actions
plus an optional start slot: a truncated description, or a link.

## When to use

- The bottom action row of a panel/dialog/sheet — e.g. Cancel + Save.
- When the actions need brief accompanying context (a description) or a
  related link (e.g. "Learn more").

## When not to use

- For a bulk-action/selection bar above a list or table — use `Toolbar`.
- For a full app-level bottom bar — compose the layout directly.

## Parts

| Part        | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| description | Optional truncated text next to the actions.                           |
| link        | Optional `Link` (or similar) element next to the actions.              |
| actions     | End-aligned action content — typically a secondary + primary `Button`. |

`description` and `link` are mutually exclusive — pass at most one.

## Example

```tsx
import { Button, DialogFooterDefault, Link } from '@acronis-platform/ui-react';

<DialogFooterDefault>
  <Button variant="secondary">Cancel</Button>
  <Button>Save</Button>
</DialogFooterDefault>

<DialogFooterDefault description="Changes are saved automatically as you type.">
  <Button variant="secondary">Cancel</Button>
  <Button>Save</Button>
</DialogFooterDefault>

<DialogFooterDefault link={<Link href="/docs">Learn more</Link>}>
  <Button variant="secondary">Cancel</Button>
  <Button>Save</Button>
</DialogFooterDefault>
```
