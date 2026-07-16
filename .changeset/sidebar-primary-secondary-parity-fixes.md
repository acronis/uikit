---
'@acronis-platform/ui-react': minor
---

SidebarPrimary, SidebarSecondary: fix several UX bugs and unify the two components' collapse-trigger and tooltip behavior

**Breaking:**

- `SidebarPrimaryMenuItem.icon` is now required by default (rail mode is icon-only, so an icon-less row is a UX bug) — pass `noIcon` to explicitly opt out for the rare row that has none
- `SidebarSecondaryCollapseTrigger.expandIcon` removed — both `SidebarPrimaryCollapseTrigger` and `SidebarSecondaryCollapseTrigger` now take a single `icon` that rotates 180° between expanded/collapsed instead of swapping icon elements

**Fixes:**

- `SidebarPrimaryCollapseTrigger`'s row (and its extras) now shows a pointer cursor — the shared cva was missing `cursor-pointer` that `SidebarSecondary`'s already had
- `SidebarPrimaryHeader`'s logo/padding now animate alongside the rail's width transition instead of snapping instantly. The row's height is also now pinned to the larger of the two states' `padding×2 + logo-height` sums — `logo`/`collapsedLogo` are two separate elements swapped by a JS conditional (not one element whose size CSS-transitions), so the incoming logo mounts at its final size instantly while padding is still mid-transition; without the pinned height the row briefly overshot/undershot its resting height and the rest of the menu visibly jumped
- Truncated-label tooltips on `SidebarPrimaryMenuItem`, `SidebarSecondaryMenuItem`, `SidebarSecondarySectionLabel`, and both `CollapseTrigger`s now open to the side (right in LTR, left in RTL) instead of on top, and are anchored to the full row instead of the shrinking label span — so they align flush with the sidebar's edge instead of drifting inward when a row also has `extras`
- Collapsed/rail-mode icon-only rows now always show their label as a tooltip on hover — previously the tooltip trigger was the `sr-only` label itself, which can never receive a real hover
- `SidebarPrimaryMenuItem` (an anchor) now activates on Space in addition to Enter, matching native button behavior and `SidebarSecondaryMenuItem`
- `SidebarPrimaryMenuItem`'s required-`icon` union now rejects `icon={undefined}` without `noIcon` — previously it typechecked (since `React.ReactNode` already includes `undefined`) and silently rendered an icon-less row

**Added:**

- `TooltipContent` (`@/components/ui/tooltip`) gained an `anchor` prop — overrides what the popup positions against, independent of what triggers it open. Needed for the row-anchoring fix above; also usable directly by consumers with a similar narrow-trigger/wide-anchor layout.

**Migration:**

- Every `SidebarPrimaryMenuItem` without an `icon` now fails to typecheck. Add an `icon`, or `noIcon` for the rare row that intentionally has none:

  ```diff
  - <SidebarPrimaryMenuItem href="/settings">General settings</SidebarPrimaryMenuItem>
  + <SidebarPrimaryMenuItem href="/settings" noIcon>General settings</SidebarPrimaryMenuItem>
  ```

- Drop `expandIcon` from any `SidebarSecondaryCollapseTrigger` — the single `icon` now rotates automatically:

  ```diff
  - <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} expandIcon={<ChevronsRightIcon />} />
  + <SidebarSecondaryCollapseTrigger icon={<ChevronsLeftIcon />} />
  ```
