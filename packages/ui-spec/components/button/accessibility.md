# Button — Accessibility

- **Role:** native `<button>` (implicit `role="button"`); when composed as a
  link via `render`, it becomes a native `<a>` with link semantics.
- **Accessible name:** from the text content. An **icon-only** button has no
  text, so it MUST be given an `aria-label` (or `aria-labelledby`). For
  icon-only buttons prefer the dedicated `ButtonIcon` component.
- **Keyboard:** Enter and Space activate (native). Tab focuses; a `disabled`
  button is removed from the tab order (native).
- **Focus visible:** keyboard focus shows a 3px ring in `--ui-focus-primary`
  flush to the button edge (no offset), via `:focus-visible` (no ring on pointer
  activation).
- **Contrast:** label/background pairs come from the design tokens, which are
  authored to meet WCAG contrast. State is never conveyed by color alone — the
  disabled state also removes interactivity.
  - One pairing is a known exception, **partially corrected**: the `default`
    (primary) variant's **dark-mode idle** background measured 2.80:1 behind its
    fixed-white label — below the 4.5:1 AA floor (GH #630). It is fixed to
    4.69:1 by a **provisional** token value that was hand-computed rather than
    sourced from Figma, because no existing palette shade clears AA while
    staying distinct from the dark hover and active steps. Expect the value to
    be replaced once the brand ramp gains an AA-safe dark blue; the token name
    Button consumes (`--ui-button-primary-container-color-idle`) does not
    change.
    - **The fix covers the `default` brand only.** The `telstra`, `virtuozzo`,
      `deep_sky_itkontoret`, `light-gray` and `yellow-1c` brand tiers still
      resolve that token to the failing 2.80:1 dark value and need their own
      follow-up. Because ui-react's stylesheet imports only the `default`
      tiers, the `default` brand is what a stock ui-react consumer renders — but
      Button's dark-mode AA story is **not** fully resolved across brands.
    - **ButtonMenu has the identical, still-unfixed defect** on its own
      `--ui-button-menu-primary-container-color-idle` (2.80:1 behind a white
      label, all brands). Checkbox and Radio checked-state fills sit at the same
      2.80:1 behind a white icon, failing the lower 1.4.11 non-text 3:1 floor.
      Both are separate open defects, not addressed by this Button fix.
- **WCAG:** 2.1.1 (keyboard), 2.4.7 (focus visible), 1.4.3 / 1.4.11 (contrast),
  4.1.2 (name/role/value).
