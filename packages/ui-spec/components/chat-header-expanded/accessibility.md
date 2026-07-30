# ChatHeaderExpanded — accessibility

## Roles and structure

| Element                              | Role / semantics                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| root                                 | `<header>` → `banner` landmark; swap via `render` if the page already has one |
| `tabs` inner row                     | `role="tablist"`                                                              |
| `tab`                                | `<button role="tab">` with `aria-selected`                                    |
| `tab-counter`                        | plain text inside the tab's accessible name (a `Tag` `<span>`)                |
| `tab-scroll` buttons                 | `<button>` with `aria-label`                                                  |
| `action-history` / `action-new-chat` | `<button>` (ButtonIcon) with `aria-label`                                     |

> **Landmark caution.** `<header>` maps to the `banner` landmark only when it is
> not nested inside `<article>`/`<aside>`/`<main>`/`<nav>`/`<section>`. Inside the
> chat panel it usually _is_ nested, so it is typically not a second `banner`. If
> the component is placed at document level next to the page's real banner, pass
> `render={<div />}` to avoid two `banner` landmarks.

## Accessible names

Every control the component renders on its own has an overridable accessible
name — the English literal exists only as the prop's default value, never inline
in JSX:

| Control         | Prop                  | Default                  |
| --------------- | --------------------- | ------------------------ |
| new-chat button | `newChatLabel`        | `'New chat'`             |
| history button  | `historyLabel`        | `'Chat history'`         |
| scroll backward | `scrollBackwardLabel` | `'Scroll tabs backward'` |
| scroll forward  | `scrollForwardLabel`  | `'Scroll tabs forward'`  |

Tab labels come from `children` and are therefore already the consumer's to
localize.

## Keyboard

| Key               | Result                                                            |
| ----------------- | ----------------------------------------------------------------- |
| `Tab`             | Moves through each tab, then the scroll buttons, then the actions |
| `Enter` / `Space` | Activates the focused tab or action button                        |

**Known gap (placeholder).** A real tab list should implement a _roving
tabindex_: one stop for the whole list, with `ArrowLeft`/`ArrowRight` (mirrored
under RTL), `Home`, and `End` moving selection between tabs. The placeholder
leaves every tab individually tabbable instead. This is deliberate — the
behavior belongs to the standalone `SegmentControl` component, which is still in
progress in Figma. Until then, all controls remain reachable and operable by
keyboard; only the _number_ of tab stops is non-ideal.

**Known gap (placeholder).** Tabs carry no `aria-controls` pointing at a
`role="tabpanel"`, because this Figma node contains no panels — the panel lives
elsewhere in the chat layout. Consumers that render a panel should add
`aria-controls` / `id` themselves (both are forwarded), or wait for
SegmentControl.

## Screen reader

- The band itself announces as a banner/group boundary; it carries no redundant
  label of its own.
- The selected tab announces as "selected" via `aria-selected="true"`; idle tabs
  announce `aria-selected="false"` rather than being silent, so the selected/idle
  distinction is conveyed non-visually and not by color alone.
- A tab's counter is part of its accessible name — "Tasks 7" — so the count is
  announced with the tab it belongs to. Consumers should keep the counter
  numeric; if it needs units ("7 open tasks"), pass a fuller `aria-label` on the
  tab.
- Icon-only buttons announce their `aria-label`; the glyphs are decorative and
  contribute no text.

## Focus visibility

Tabs and the scroll affordance buttons draw a 3px `--ui-focus-primary`
focus-visible ring. The action buttons inherit `ButtonIcon`'s identical ring, so
focus treatment is consistent across the whole header.

## Contrast

All colors resolve to `--ui-*` tokens from `@acronis-platform/tokens-pd`, which
the design team maintains against WCAG AA for both light and dark modes:

- selected tab label `--ui-segment-control-value-color-active` on
  `--ui-segment-control-item-color-active`
- idle tab label `--ui-segment-control-value-color-idle` on
  `--ui-segment-control-container-color`
- action glyphs `--ui-button-icon-global-icon-color-*` on the button fill

Selection is not signalled by color alone: the selected tab also gains a visible
border and a raised fill, plus the `aria-selected` state.

## RTL

The header mirrors wholesale under `dir="rtl"`: the layout uses logical
utilities throughout (`px-`, `end-`, `border-s-`), so the tab group and action
cluster swap edges and the affordance separators flip. The two chevron glyphs
carry an explicit `rtl:rotate-180` so the artwork mirrors along with the layout.
