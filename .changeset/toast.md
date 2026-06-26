---
'@acronis-platform/ui-react': minor
---

feat(toast): add Toast (Toaster + imperative toast API)

Transient corner-stack notifications. Render one `<Toaster />` near the app root
and trigger toasts imperatively from anywhere with `toast(title, options)` —
including `toast.success` / `info` / `warning` / `error` / `loading`,
`toast.dismiss`, and `toast.promise`. Rebuilt on the Base UI toast manager (no
Sonner dependency), replacing the legacy `sonner` wrapper. Each toast shows a
status-colored icon, title, optional description, optional action button, and a
close button; auto-dismisses after `timeout` (default 5000ms), with `loading`
toasts persisting until updated or dismissed. Design-pending v1 on semantic
tokens (no `--ui-toast-*` tier yet). `Toaster` accepts `timeout`, `limit`, and
`portalContainer`.
