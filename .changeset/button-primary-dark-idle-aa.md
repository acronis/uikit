---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

**Button**: fixed the primary variant's dark-mode idle background failing WCAG AA
(GH #630) — **for the `default` brand only**.

`--ui-button-primary-container-color-idle` resolved to `rgb(81 157 246)` in dark
mode — **2.80:1** behind Button's fixed-white label, well under the 4.5:1 AA
floor. It now resolves to `rgb(10 112 230)` = `hsl(212 92% 47%)` — **4.69:1**.
Light mode is unchanged (`rgb(23 99 207)`, 5.64:1).

## Scope limitation: `default` brand only

Only `Button.primary.container.color.idle`'s **`default`** brand value was
re-pointed. The five other brand tiers — `telstra`, `virtuozzo`,
`deep_sky_itkontoret`, `light-gray`, `yellow-1c` — still carry the identical
failing `rgb(81 157 246)` dark idle in `css/Button/<brand>.css`, because they
resolve the semantic through their own `branding.<brand>.ButtonPrimary.idle` and
were not touched. **They need their own follow-up.**

This still closes #630 for ui-react's published surface: `ui-react`'s own
stylesheet (`packages/ui-react/src/styles/index.css`) imports **only**
`css/default.css` and the per-component `css/<Component>/default.css` files —
never a brand-specific tier. So the fixed `default.css` is what every current
ui-react consumer actually gets.

## Known, unfixed defects in sibling components

The failing value came from the shared semantic
`colors.background.brand.secondary` (`{palette.blue.7}`). Neither that semantic
nor `palette.blue.7` was touched, so no other component re-tints — but that is a
**non-regression statement, not an all-clear**. The other consumers of that
semantic have live contrast defects that this changeset does **not** fix:

- **ButtonMenu has the identical unfixed AA defect.** In
  `css/ButtonMenu/default.css`, `--ui-button-menu-primary-container-color-idle`
  is still `rgb(81 157 246)` in dark mode behind an all-white
  `--ui-button-menu-primary-label-color` — the same **2.80:1**, failing 1.4.3.
  It needs its own follow-up issue.
- **Checkbox and Radio checked-state fills are below the non-text floor.**
  `--ui-checkbox-checked-box-color-idle` / `--ui-radio-checked-box-color-idle`
  (and the indeterminate equivalents) are also `rgb(81 157 246)` in dark mode
  behind a white checkmark / dot icon — **2.80:1** against the WCAG **1.4.11**
  non-text 3:1 floor. That floor is lower than AA text, but 2.80:1 still fails
  it. Should be assessed separately.
- **Calendar** consumes the same semantic; its pairings were not re-measured
  here.

None of the above is fixed by this change. Treat them as separate, open defects.

> ⚠️ **The new shade is provisional, not Figma-sourced.** It is carried by a new
> primitive, `palette.blue.aa-on-white` (`light` re-aliases `{palette.blue.7}`;
> `dark` is a hand-computed literal), because no existing palette shade both
> clears 4.5:1 against white and stays visually distinct from Button's dark
> hover (`rgb(23 99 207)`, 5.64:1) and active (`rgb(18 77 161)`, 8.07:1).
> Replace the token with
> a real palette shade once the brand ramp gains an AA-safe dark blue in Figma.
> Note that dark-mode hover is now a subtler step down from idle than before
> (ΔE76 ≈ 7 instead of ≈ 27) — an inherent consequence of darkening idle to
> reach AA.

## CI: the dark-mode VR check will fail on this commit

Regenerated `tokens-pd`: `css/Button/default.css`,
`tailwind/default/components/Button.js`, and the `dtcg/` intermediates. No other
component's generated output changed.

Storybook VR baselines are **deliberately not included here** — they are
refreshed in a deferred batch step. Because this commit touches
`packages/design-tokens/**` and `packages/tokens-pd/**`, both of which are path
filters in `.github/workflows/visual-regression.yml`, the
`visual-regression (ui-react, dark)` leg **runs and will fail** on this branch
until the baselines are regenerated. **This is expected and intentional, not an
oversight.**

The failures are not limited to Button's own dark stories: any dark story that
composes a primary Button as a sub-element re-renders with the new fill. That is
~22 story files beyond `button/`, including `dialog`,
`dialog-footer-default`, `wizard`, `sheet` (incl. `sheet-details` and the
generated set), `page-header` (incl. the responsive set), `toolbar`,
`calendar-panel`, `popover`, `form`, `alert`, `empty`, `card`, `data-table`,
`toast`, `tooltip`, `section`, `chip`, `chart-state` and `filter-search`. Expect
a broad dark-leg diff; do not treat it as a regression signal until baselines are
refreshed.

`tokens-pd` takes a **minor**, not a patch: it ships `dtcg/**/*.json` in its
published `files`, and `palette.blue.aa-on-white` is a genuine addition to that
published DTCG surface — even though palette primitives never emit as CSS custom
properties (confirmed: zero `--ui-palette-*` in the generated CSS). Per
`packages/design-tokens/context/versioning.md` and `context/releasing.md`,
"adding a new token" is additive = minor; precedent is tokens-pd `2.6.0`, a minor
for "Adds the SideSheet component tier: 10 new tokens."
