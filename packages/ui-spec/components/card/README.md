# Card

A surface that groups related content and actions into a bordered, rounded
container. Composable from parts (`Card`, `CardHeader`, `CardContent`,
`CardFooter`); the header carries a rich, Figma-driven feature set.

> Figma node: `10012-195993`. The design's `isCollapsable` variant
> (expanded/collapsed) is implemented by composing `Card` with
> `AccordionContainer` — see "Collapsible" below.

## When to use

- Grouping related information into a self-contained block (a stat, a
  summary, a settings group, a reorderable list item).
- A header that needs any combination of: a drag handle (reorderable lists), a
  toggle switch, an avatar, a title with an optional rename affordance, extra
  inline content (tags/badges), and end-aligned actions (e.g. a menu button).
- Nesting cards (a "main" card containing one or more "secondary" cards as
  content) — `Card` is the same component in both roles; there is no separate
  primary/secondary variant.

## When not to use

- For a compact single-stat tile with built-in variants, use **`CardFilter`**
  instead.
- As a generic layout `<div>` with no visual surface — just use a styled
  element.
- For modal/overlay surfaces — use the dialog/popover components.

## Parts

| Part          | Element (default) | Purpose                                                                            |
| ------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `Card`        | `div`             | The card surface (border, radius); `hasError` swaps the border to the error token. |
| `CardHeader`  | `div`             | Title/description + drag handle, switch, avatar, rename, extras, actions.          |
| `CardContent` | `div`             | Primary body region for arbitrary children.                                        |
| `CardFooter`  | `div`             | Bottom region; horizontal action row.                                              |

`Card` and `CardContent` accept a `render` prop for polymorphic composition.

## Example

```tsx
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@acronis-platform/ui-react';

<Card className="w-[350px]">
  <CardHeader
    title="Backup status"
    description="Last successful run 5 minutes ago."
    hasDescription
  />
  <CardContent>All 24 workloads are protected.</CardContent>
  <CardFooter className="gap-2">
    <Button>View report</Button>
    <Button variant="secondary">Run now</Button>
  </CardFooter>
</Card>;
```

## Header features

```tsx
<CardHeader
  title="Backup policy"
  isDraggable
  isSwitchable
  defaultSwitchChecked
  hasAvatar
  avatarLabel="SB"
  hasRename
  onRename={() => setRenaming(true)}
  extras={<Badge>Beta</Badge>}
  actions={
    <ButtonIcon aria-label="More actions">
      <EllipsisIcon size={24} />
    </ButtonIcon>
  }
/>
```

- `isDraggable` shows a grip handle for reorderable lists — wire your own
  drag library (e.g. `@dnd-kit/sortable`) onto the header or handle.
- `isSwitchable` renders a real `Switch`; control it with `switchChecked` /
  `defaultSwitchChecked` / `onSwitchCheckedChange`.
- `hasAvatar` defaults to an initials avatar (`avatarLabel`); pass `avatar`
  to render a custom node (e.g. an image avatar) instead.
- `hasRename` renders a pencil icon button; wire `onRename` to open your own
  rename UI (an inline input, a dialog, …) — Card does not manage rename
  state itself.
- `hasError` (on `Card`, not `CardHeader`) only swaps the root border color.

## Collapsible

Compose `Card` with `AccordionContainer` (the shared disclosure primitive):
wrap `CardContent`/`CardFooter` in `AccordionContainer.Content` and set
`CardHeader`'s `isCollapsible` to render the trigger — restyled to match the
Figma design's ghost `ButtonIcon` chrome rather than `AccordionContainer`'s
own neutral default.

```tsx
import {
  AccordionContainer,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@acronis-platform/ui-react';

<Card className="w-[420px]">
  <AccordionContainer collapsible defaultOpen>
    <CardHeader
      title="Backup policy"
      description="Applies to 12 workloads."
      hasDescription
      isCollapsible
      collapseLabel="Toggle backup policy"
    />
    <AccordionContainer.Content>
      <CardContent>All 24 workloads are protected and up to date.</CardContent>
      <CardFooter className="gap-2">
        <Button>Save</Button>
        <Button variant="secondary">Cancel</Button>
      </CardFooter>
    </AccordionContainer.Content>
  </AccordionContainer>
</Card>;
```

- `isCollapsible` on `CardHeader` only has an effect when the header renders
  inside a collapsible `AccordionContainer` — it's a no-op otherwise.
- The header itself (title, drag handle, switch, avatar, actions, …) stays
  visible in both the open and closed state; only content wrapped in
  `AccordionContainer.Content` is hidden when closed.
