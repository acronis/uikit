# EmptyOverlay — behavior

## Fills its container

**Given** an `EmptyOverlay`
**When** it renders
**Then** it fills the width and height of its parent (`size-full`) and centers
its content — the developer is responsible for sizing/positioning the parent
(e.g. `relative` + `absolute inset-0` to overlay other content).

## Icon badge

**Given** an `icon`
**When** it renders
**Then** a 64px circular badge shows above the title, holding the icon at
24px; the badge's fill/icon color come from the `color` prop (default
`green`).
**Given** no `icon`
**Then** the badge is omitted entirely — only the title/description center.

## Color

**Given** `color` set to one of the eight avatar palette values (`teal`,
`violet`, `red`, `yellow`, `orange`, `blue`, `gray`, `green`)
**When** it renders
**Then** the badge's fill and icon color resolve from that color's
`--ui-avatar-color-<color>` / `--ui-avatar-label-color-<color>` tokens
**And** with no `color` it defaults to `green`.

## Title / description

**Given** a `title`
**When** it renders
**Then** it shows as an `<h3>` headline below the badge.
**Given** a `description`
**When** it renders
**Then** it shows as supporting copy below the title.
**Given** no `description`
**Then** only the title renders.

## Non-interactive

**Given** an `EmptyOverlay`
**When** the user hovers or clicks it
**Then** nothing happens — it is a presentational placeholder, not a control.
