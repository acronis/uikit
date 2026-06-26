---
'@acronis-platform/ui-react': minor
---

Add `tw-animate-css` to ui-react's stylesheet, enabling enter/exit animation utilities (`animate-in` / `animate-out` / `fade-*` / `zoom-*` / `slide-*`) — the same library the legacy package uses. Components wrapping Base UI primitives can now animate against the `data-[open]` / `data-[closed]` state attributes (e.g. `Dialog`'s overlay fade and popup fade + zoom). VR-safe: the visual-regression runner screenshots with animations disabled, so baselines capture the settled end state.
