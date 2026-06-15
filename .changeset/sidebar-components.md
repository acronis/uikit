---
'@acronis-platform/ui-react': minor
---

Add `SidebarPrimary` and `SidebarSecondary` — composable, next-gen sidebar
components themed by the `--ui-sidebar-primary-*` / `--ui-sidebar-secondary-*`
token tiers.

Both are multi-part component families (mirroring the `Breadcrumb` pattern) with
an `expanded` / `collapsed` model exposed as a controlled **and** uncontrolled
prop (`expanded` / `defaultExpanded` / `onExpandedChange`), driven by a dedicated
`…CollapseTrigger` part (the Figma "Collapse menu" affordance). The rail reflows
width/padding/logo between states via the per-state metric tokens; collapsed-mode
labels stay in the DOM as `sr-only` so icon-only rows keep an accessible name.

- **`SidebarPrimary`** — `SidebarPrimary`, `…Header`, `…Content`, `…Footer`,
  `…Section`, `…Menu`, `…MenuItem` (cva `variant: selected | unselected`,
  recoloring container + icon + label per state), `…MenuItemExtras` (shortcut +
  external-link icon), `…CollapseTrigger`.
- **`SidebarSecondary`** — adds a `…CollapsedBreadcrumb` (shown in rail mode),
  a `…SectionLabel`, and an expandable disclosure group (`…MenuSub` /
  `…MenuSubTrigger` / `…MenuSubContent` / `…MenuSubItem`) built on the Base UI
  `Collapsible` primitive, with a Level-2 indent. Its menu-item cva swaps only the
  container fill; icon/label use the shared global state tokens.

Polymorphic link parts use Base UI `useRender` + `mergeProps` (no Radix
`asChild`). Tokens-only (no hardcoded colors); the focus ring reuses
`--ui-focus-brand`. `ui-react/styles` imports the two new
`@acronis-platform/tokens-pd/css/Sidebar{Primary,Secondary}/acronis.css` tiers.
Includes unit tests, Storybook stories (+ generated state stories), Figma Code
Connect, ui-spec specs, and Docker visual-regression baselines.
