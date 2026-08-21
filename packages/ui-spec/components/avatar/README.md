# Avatar

A circular badge for a user or entity — a profile image, initials, or an icon
on a tinted background when no image is available. Eight color schemes. Stack
several with `AvatarGroup` for an overlapping row (e.g. assignees on a ticket).

## When to use

- Represent a person/entity next to their name, in a row, table, or comment.
- Show a set of participants compactly via an overlapping `AvatarGroup`.
- Use `variant="icon"` for a non-personal entity (a team, a bot, a system
  actor) where an icon reads better than initials.

## When not to use

- As a button/link target without a proper interactive wrapper (Avatar is
  presentational — wrap it in a control that owns focus and an accessible name).
- For non-identity imagery (logos, thumbnails, decorative icons) — use an
  image or `Icon` directly.

## Parts

| Part     | Component        | Notes                                               |
| -------- | ---------------- | --------------------------------------------------- |
| root     | `Avatar`         | The circle; `color` tints the fallback.             |
| image    | `AvatarImage`    | Optional; shown once it loads, else the fallback.   |
| fallback | `AvatarFallback` | Initials shown when there's no image (or it fails). |
| icon     | —                | Consumer-supplied icon, shown for `variant="icon"`. |
| group    | `AvatarGroup`    | Optional overlapping row of avatars.                |

## Examples

```tsx
// Image with initials fallback
<Avatar color="teal">
  <AvatarImage src="/me.png" alt="Sam Nguyen" />
  <AvatarFallback>SN</AvatarFallback>
</Avatar>

// Initials only, via children
<Avatar color="violet">
  <AvatarFallback>GA</AvatarFallback>
</Avatar>

// Initials only, via the `label` convenience prop (equivalent to the above)
<Avatar color="violet" label="GA" />

// Icon avatar (no children composed)
<Avatar color="gray" variant="icon" icon={<UserIcon size={16} />} />

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

`teal` (default), `violet`, `red`, `yellow`, `orange`, `blue`, `gray`, `green`.
Each pairs a tinted background with a matching initials color from the
`--ui-avatar-*` token tier.

## Variants

`text` (default) shows `label` (initials); `icon` shows a consumer-supplied
`icon`. Both are ignored once `children` (`AvatarImage`/`AvatarFallback`) are
composed directly — `variant`/`label`/`icon` only drive the no-children case.

"No children" means the slot is left unset. Passing an explicit `null` child is
a deliberate "render nothing" and yields an empty circle rather than the default
`'SB'` label — that's how `Timeline` renders a blank marker.
