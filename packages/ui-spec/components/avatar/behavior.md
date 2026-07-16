# Avatar — Behavior

## Image with a fallback

- **Given** an `Avatar` with an `AvatarImage` (valid `src`) and an `AvatarFallback`
  **When** the image is still loading
  **Then** the fallback (initials) is shown until the image finishes loading,
  then the image replaces it.

- **Given** an `Avatar` whose image `src` fails to load
  **When** the load errors
  **Then** the fallback remains visible (the broken image is not shown).

## Fallback only

- **Given** an `Avatar` with only an `AvatarFallback` (no image)
  **Then** the initials render on the `color` scheme's tinted background, using
  that scheme's label color.

## Color scheme

- **Given** `color="violet"`
  **Then** the background resolves to `--ui-avatar-color-violet` and the initials
  to `--ui-avatar-label-color-violet`. The default scheme is `teal`.

- **Given** an avatar showing an image
  **Then** `color` has no visible effect (the image covers the circle).

## Group overlap

- **Given** an `AvatarGroup` wrapping several `Avatar`s
  **Then** each avatar after the first is offset left by
  `--ui-avatar-global-avatar-group-gap` (a negative value), so the avatars
  overlap; each 2px ring (`--ui-avatar-global-avatar-border-color`, drawn outside
  the 32px circle as a `box-shadow`) separates them, and later avatars paint above
  earlier ones.
