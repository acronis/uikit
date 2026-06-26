# Tabs — accessibility

Tabs leans on the Base UI Tabs primitive for the WAI-ARIA tabs pattern: roles,
selection state, roving focus, and keyboard navigation.

## Roles & semantics

- `TabsList` is `role="tablist"`; `TabsTrigger` is `role="tab"`; `TabsContent`
  is `role="tabpanel"`.
- The active trigger exposes `aria-selected="true"` (and `data-active` for
  styling); its panel is associated via `aria-controls` / `aria-labelledby`.
- Set `orientation="vertical"` so `aria-orientation` and arrow-key handling match
  a vertical strip.

## Keyboard

- **Tab** moves into the tablist (one stop — roving tabindex), then into the
  active panel.
- **Arrow keys** (Left/Right when horizontal, Up/Down when vertical) move focus
  between triggers **without** activating them (manual activation).
- **Enter / Space** activates the focused trigger.
- **Home / End** move to the first / last trigger.

## Screen reader

- Entering the tablist announces the tab role, the selected state, and the
  position ("tab 1 of 2"). Activating a tab announces the newly selected tab and
  its panel.

## Contrast

- Idle triggers use the brand action blue for border + label
  (`--ui-background-brand-secondary`, the same blue Button uses); the active
  trigger fills with that blue and uses a pure-white label
  (`--ui-glyph-on-brand-primary`, like the default Button), and shows a
  `--ui-focus-primary` ring on keyboard focus — all meeting WCAG AA in light and
  dark. Re-verify against the final palette once a `--ui-tabs-*` tier and Figma
  reference exist (the filled-vs-tinted active treatment is provisional).
