# Avatar

A circular badge for a user or entity — a profile image, or initials on a tinted
background when no image is available. Five color schemes. Stack several with
`AvatarGroup` for an overlapping row (e.g. assignees on a ticket).

## When to use

- Represent a person/entity next to their name, in a row, table, or comment.
- Show a set of participants compactly via an overlapping `AvatarGroup`.

## When not to use

- As a button/link target without a proper interactive wrapper (Avatar is
  presentational — wrap it in a control that owns focus and an accessible name).
- For non-identity imagery (logos, thumbnails, icons) — use an image or `Icon`.

## Parts

| Part     | Component        | Notes                                               |
| -------- | ---------------- | --------------------------------------------------- |
| root     | `Avatar`         | The circle; `color` tints the fallback.             |
| image    | `AvatarImage`    | Optional; shown once it loads, else the fallback.   |
| fallback | `AvatarFallback` | Initials shown when there's no image (or it fails). |
| group    | `AvatarGroup`    | Optional overlapping row of avatars.                |

## Examples

```tsx
// Image with initials fallback
<Avatar color="teal">
  <AvatarImage src="/me.png" alt="Sam Nguyen" />
  <AvatarFallback>SN</AvatarFallback>
</Avatar>

// Initials only
<Avatar color="violet">
  <AvatarFallback>GA</AvatarFallback>
</Avatar>

// Overlapping group with a label
<div className="flex items-center gap-[var(--ui-avatar-global-container-gap)]">
  <AvatarGroup>
    <Avatar color="teal"><AvatarFallback>SN</AvatarFallback></Avatar>
    <Avatar color="violet"><AvatarFallback>GA</AvatarFallback></Avatar>
    <Avatar color="red"><AvatarFallback>SI</AvatarFallback></Avatar>
  </AvatarGroup>
  <span>On this ticket</span>
</div>
```

## Color schemes

`teal` (default), `violet`, `red`, `yellow`, `orange`. Each pairs a tinted
background with a matching initials color from the `--ui-avatar-*` token tier.
