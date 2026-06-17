---
'@acronis-platform/ui-react': minor
---

Rewire components to the next-gen token tiers shipped by the Figma sync and add a
multiline text-area.

### Fixed — components were binding to `--ui-*` variables that no longer exist

- **Radio** — rewired from the legacy `--ui-form-*` tier (never shipped) to the
  dedicated `--ui-radio-*` tier, with each box/icon state wired to its own token
  (mirrors Checkbox).
- **Search** — rewired from `--ui-form-*` to `--ui-input-search-*`.
- **Input** — remapped from the old `--ui-input-{global,normal,content,error}-*`
  names to `--ui-input-text-*` (incl. `content-value` → `global-value-color`,
  `content-placeholder` → `global-placeholder-color`, `error-*` → `error-msg-*`).
- **SidebarSecondary** — re-themed for the redesigned tier: the per-state
  menu-item icon/label colors collapsed to single `…-color-color` tokens,
  `container-height` → `container-height-min`, section-header padding renamed; the
  removed inter-section divider and dedicated level-2 indent tokens are dropped
  (the level-2 indent is now derived from surviving tokens).

`Radio` and `InputSearch` token tiers are now imported in `src/styles/index.css`
so their custom properties resolve.

### Added

- **InputTextArea** — new multiline text-area component themed by the
  `--ui-input-text-area-*` tier.

### Known gap

- **Select** still binds to the legacy `--ui-form-*` tier; `tokens-pd` ships no
  `--ui-select-*` tier yet, so it is left stranded and documented in-source until
  those tokens land.
